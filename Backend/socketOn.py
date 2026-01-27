from .pokemon_utils import generate_pokemon
from .env import PATH_TO_PUBLIC
from .app import socketio, battles
from .store import users_to_sockets
from .socketEmit import (
    emit_joinBattle,
    emit_joinBattleFromRoom,
    emit_joinWaitingRoom,
    emit_loginAck,
    emit_notification,
    emit_getPokemonCreatedResponse,
)
from .sharedTypes import *
from random import randrange

from .battle import Battle, BattleEvent
from .db import (
    get_all_pokemons,
    get_pokemon_from_id,
    get_pokemons_from_user,
    initialise_user,
    request,
)

from sharedTypes import *


@socketio.on("requestOnePokemon")
def handle_requestOnePokemon(json: OnePokemonData):
    return get_pokemon_from_id(json["pokemon_id"])


@socketio.on("requestAllPokemons")
def handle_requestAllPokemons():
    return get_all_pokemons()


@socketio.on("requestUserPokemons")
def handle_requestUserPokemons(json: AssociateUsernameWithSocketData):
    username = json["username"]
    pokemons = get_pokemons_from_user(username)
    return pokemons


@socketio.on("createPokemon")
def handle_createPokemon(data: CreatePokemonData):
    """Create a new Pokemon."""
    emit_notification(message="Pokemon being created", severity="info", sid=request.sid)
    img_raw = bytes(data["image_bytes"])

    img_name = hash(img_raw)
    img_path = (
        f"images/pokemon/uploaded_images/{img_name}.jpg"  # Path from the public folder
    )
    with open(PATH_TO_PUBLIC + img_path, "wb") as file:
        file.write(img_raw)

    try:
        generate_pokemon(data["username"], img_path)
        emit_getPokemonCreatedResponse(succeeded=True, sid=request.sid)
        emit_notification(
            message="Pokemon successfully created", severity="success", sid=request.sid
        )
    except:
        emit_getPokemonCreatedResponse(succeeded=False, sid=request.sid)
        emit_notification(
            message="An error occurred when trying to generate your Pokemon..",
            severity="error",
            sid=request.sid,
        )


@socketio.on("login")
def handle_login(json: AssociateUsernameWithSocketData):
    username = json["username"]
    pid = initialise_user(username)

    emit_loginAck(pid=pid, username=username, sid=request.sid)


@socketio.on("associateUsernameWithSocket")
def handle_associateUsernameWithSocket(json: AssociateUsernameWithSocketData):
    """Associate a username with a socket."""
    username = json["username"]

    if username not in users_to_sockets:
        print(f"Overwriting the sid for user {username}")
    users_to_sockets[username] = request.sid


@socketio.on("createBattle")
def handle_createBattle(json: CreateBattleData):
    """Create a new battle."""
    game_id = str(randrange(0, 1000000))
    pokemon_id = json["pokemon_id"]
    username = json["username"]

    print(
        f"Creating battle (id: {game_id}) for user {username} with client id: {request.sid}"
    )

    battles[game_id] = Battle(username, pokemon_id)

    emit_joinWaitingRoom(game_id=game_id, sid=request.sid)


@socketio.on("joinBattle")
def handle_joinBattle(json: PlayerJoinBattleData):
    """Join a new player to a battle."""
    game_id = json["game_id"]
    pokemon_id = json["pokemon_id"]
    username = json["username"]

    print(f"User {username} with client id {request.sid} joining battle: {game_id}")
    if game_id in battles:
        battle = battles[game_id]
    else:
        emit_notification("Failed to find a battle with that id", "error", request.sid)
        print(f"No battle with id {game_id} exists")
        return

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
    battles[json["game_id"]].handle_event(BattleEvent.attack, json, request.sid)
