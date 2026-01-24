from Backend.app import socketio, battles, users
from Backend.socketEmit import (
    emit_joinBattle,
    emit_joinBattleFromRoom,
    emit_joinWaitingRoom,
)
from Backend.sharedTypes import *
from random import randrange

from .pokemon import Battle, BattleEvent
from .db import (
    get_pokemon_from_id,
    request,
)

from Backend.sharedTypes import *


@socketio.on("createBattle")
def handle_createBattle(json: CreateBattleData):
    """Create a new battle."""
    # game_id = createGame(json.id)
    game_id = str(randrange(0, 1000000))
    pokemon_id = json["pokemon_id"]

    print(f"Creating battle (id: {game_id}) for client id: {request.sid}")

    # pokemon = Pokemon.load(database, pokemon_id)
    battles[game_id] = Battle(request.sid, pokemon_id)
    users[request.sid] = request.sid

    emit_joinWaitingRoom(game_id=game_id)


@socketio.on("joinBattle")
def handle_joinBattle(json: JoinBattleData):
    """Join a new player to a battle."""
    game_id = json["game_id"]
    pokemon_id = json["pokemon_id"]

    print(f"Client id: {request.sid} joining battle: {game_id}")
    if game_id in battles:
        battle = battles[game_id]
    else:
        return

    battle.add_player(request.sid, pokemon_id)

    emit_joinBattle(
        self_pokemon=get_pokemon_from_id(battle.p2_id),
        target_pokemon=get_pokemon_from_id(battle.p1_id),
        game_id=game_id,
        sid=battle.u2,
    )

    emit_joinBattleFromRoom(
        self_pokemon=get_pokemon_from_id(battle.p1_id),
        target_pokemon=get_pokemon_from_id(battle.p2_id),
        game_id=game_id,
        sid=battle.u1,
    )


@socketio.on("attack")
def handle_attack(json: AttackData):
    battles[json["game_id"]].handle_event(BattleEvent.attack, json, request.sid)
