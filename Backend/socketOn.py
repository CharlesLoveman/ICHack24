from .app import socketio, battles
from .store import users_to_sockets
from .socketEmit import (
    emit_joinBattle,
    emit_joinBattleFromRoom,
    emit_joinWaitingRoom,
)
from .sharedTypes import *
from random import randrange

from .pokemon import Battle, BattleEvent
from .db import (
    get_pokemon_from_id,
    request,
)

from sharedTypes import *


@socketio.on("associateUsernameWithSocket")
def handle_associateUsernameWithSocket(json: AssociateUsernameWithSocketData):
    """Associate a username with a socket."""
    if json["username"] not in users_to_sockets:
        print(f"Overwriting the sid for user {json['username']}")
    users_to_sockets[json["username"]] = request.sid


@socketio.on("createBattle")
def handle_createBattle(json: CreateBattleData):
    """Create a new battle."""
    # game_id = createGame(json.id)
    game_id = str(randrange(0, 1000000))
    pokemon_id = json["pokemon_id"]
    username = json["username"]

    print(
        f"Creating battle (id: {game_id}) for user {username} with client id: {request.sid}"
    )

    # pokemon = Pokemon.load(database, pokemon_id)
    battles[game_id] = Battle(username, pokemon_id)

    emit_joinWaitingRoom(game_id=game_id)


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
