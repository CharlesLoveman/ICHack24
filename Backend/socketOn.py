import PIL
from .pokemon import delete_pokemon
from .pokemon_utils import generate_pokemon
from .env import PATH_TO_PUBLIC, POKEMON_FOLDER
from .server import socketio, app
from .battle import battles
from .store import users_to_sockets
from .socketEmit import (
    emit_getPokemonCreatedAck_with_retries,
    emit_joinBattle,
    emit_joinBattleFromRoom,
    emit_joinWaitingRoom,
    emit_loginAck,
    emit_notification,
    emit_getPokemonCreatedResponse,
    emit_notification_with_retries,
    emit_rejoinBattle,
)
from .sharedTypes import *
from random import choice, randrange
from flask import Response, jsonify, request as _request, Request as _Request
from .pokemon_constants import loading_flavour_texts

from .battle import Battle, BattleEvent
from .db import (
    add_pokemon_to_user,
    get_all_pokemons,
    get_pokemon_from_id,
    get_pokemons_from_user,
    initialise_user,
)

from sharedTypes import *


class Request(_Request):
    sid: str


socket_request: Request = _request  # type: ignore


@socketio.on("requestCreationUpdate")
def handle_requestCreationUpdate(json: UsernameData):
    emit_notification(
        message=choice(loading_flavour_texts),
        severity="info",
        sid=socket_request.sid,
    )


@socketio.on("addPokemonToUser")
def handle_addPokemonToUser(json: CreateBattleData):
    pokemon_id = json["pokemon_id"]
    username = json["username"]

    add_pokemon_to_user(username, pokemon_id)

    name = get_pokemon_from_id(pokemon_id)["name"]
    emit_notification(
        message=f"Added Pokemon {name} to your Pokedex",
        severity="success",
        sid=socket_request.sid,
    )
    print(f"Added pokemon {name} with id {pokemon_id} to user {username}'s pokedex")


@socketio.on("deletePokemon")
def handle_deletePokemon(json: OnePokemonData):
    pokemon_id = json["pokemon_id"]
    name = "unknown"
    try:
        name = delete_pokemon(pokemon_id)
        emit_notification(
            message=f"Pokemon {name} deleted",
            severity="success",
            sid=socket_request.sid,
        )
        print(f"Successfully deleted pokemon {name} with id {pokemon_id}")
        return True
    except Exception as e:
        print(f"Failed to delete pokemon {name} with id {pokemon_id}")
        print(e)
        emit_notification(
            message=f"Failed to delete pokemon",
            severity="error",
            sid=socket_request.sid,
        )
        return False


@socketio.on("requestOnePokemon")
def handle_requestOnePokemon(json: OnePokemonData):
    return get_pokemon_from_id(json["pokemon_id"])


@socketio.on("requestAllPokemons")
def handle_requestAllPokemons():
    return get_all_pokemons()


@socketio.on("requestUserPokemons")
def handle_requestUserPokemons(json: UsernameData):
    username = json["username"]
    pokemons = get_pokemons_from_user(username)
    return pokemons


@socketio.on("login")
def handle_login(json: UsernameData):
    username = json["username"]
    pid = initialise_user(username)

    emit_loginAck(pid=pid, username=username, sid=socket_request.sid)


@socketio.on("associateUsernameWithSocket")
def handle_associateUsernameWithSocket(json: UsernameData):
    """Associate a username with a socket."""
    username = json["username"]

    if username in users_to_sockets:
        print(f"Overwriting the sid for user {username} with {socket_request.sid}")
    users_to_sockets[username] = socket_request.sid


@socketio.on("createBattle")
def handle_createBattle(json: CreateBattleData):
    """Create a new battle."""
    game_id = str(randrange(0, 1000000))
    pokemon_id = json["pokemon_id"]
    username = json["username"]

    print(
        f"Creating battle (id: {game_id}) for user {username} with client id: {socket_request.sid}"
    )

    battles[game_id] = Battle(username, pokemon_id)

    emit_joinWaitingRoom(game_id=game_id, sid=socket_request.sid)


@socketio.on("joinBattle")
def handle_joinBattle(json: PlayerJoinBattleData):
    """Join a new player to a battle."""
    game_id = json["game_id"]
    pokemon_id = json["pokemon_id"]
    username = json["username"]

    if game_id in battles:
        battle = battles[game_id]
    else:
        print(f"No battle with id {game_id} exists")
        emit_notification("That battle doesn't exist", "error", socket_request.sid)
        return

    print(
        f"User {username} with client id {socket_request.sid} joining battle: {game_id}"
    )

    if battle.is_full():
        # Then consider if the player is trying to rejoin a game they accidentally left

        player_no = battle.which_player_is_this(username)
        if player_no is not None:
            print(f"User {username} rejoining battle: {game_id}")
            p1: IPokemon = battle.p1.to_interface()
            p2: IPokemon = battle.p2.to_interface()
            if player_no == 1:
                self_pokemon = p1
                target_pokemon = p2
            else:
                self_pokemon = p2
                target_pokemon = p1

            emit_rejoinBattle(
                game_id=game_id,
                sid=socket_request.sid,
                self_pokemon=self_pokemon,
                target_pokemon=target_pokemon,
            )
            emit_notification("Rejoining the battle", "success", socket_request.sid)
        else:
            print(f"The battle with id {game_id} is already full")
            emit_notification(
                "That battle is already full!", "error", socket_request.sid
            )

    else:
        battle.add_player(username, pokemon_id)

        emit_joinBattle(
            self_pokemon=get_pokemon_from_id(battle.p2_id),
            target_pokemon=get_pokemon_from_id(battle.p1_id),
            game_id=game_id,
            sid=battle.s2(),
        )

        emit_joinBattleFromRoom(
            self_pokemon=get_pokemon_from_id(battle.p1_id),
            target_pokemon=get_pokemon_from_id(battle.p2_id),
            game_id=game_id,
            sid=battle.s1(),
        )


@socketio.on("attack")
def handle_attack(json: AttackData):
    battles[json["game_id"]].handle_event(BattleEvent.attack, json, socket_request.sid)


@app.route("/create-pokemon/<username>", methods=["POST"])
def create_pokemon(username: str) -> Response:
    print(f"Creating new Pokemon for: {username}")
    emit_getPokemonCreatedAck_with_retries(username)
    emit_notification_with_retries(
        message="Pokemon being created", severity="info", username=username
    )
    img_raw: bytes = _request.files["img"].read()

    img_name = hash(img_raw)
    img_path = f"{POKEMON_FOLDER}/{img_name}.jpg"  # Path from the public folder
    with open(PATH_TO_PUBLIC + img_path, "wb") as file:
        file.write(img_raw)

    try:
        generate_pokemon(username, img_path)
        emit_getPokemonCreatedResponse(succeeded=True, sid=users_to_sockets[username])
        emit_notification(
            message="Pokemon successfully created",
            severity="success",
            sid=users_to_sockets[username],
        )
    except Exception as e:
        print(e)
        emit_getPokemonCreatedResponse(succeeded=False, sid=users_to_sockets[username])
        emit_notification(
            message="An error occurred when trying to generate your Pokemon..",
            severity="error",
            sid=users_to_sockets[username],
        )
        return jsonify(success=False)

    return jsonify(success=True)
