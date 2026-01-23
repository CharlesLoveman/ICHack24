from enum import Enum

from flask_socketio import emit

from Backend.sharedTypes import BattleHP, JoinBattleData, JoinWaitingRoomData, Pokemon


class SocketEventsTo(Enum):
    connect = "connect"
    disconnect = "disconnect"
    joinWaitingRoom = "joinWaitingRoom"
    joinBattle = "joinBattle"
    joinBattleFromRoom = "joinBattleFromRoom"
    makeOtherPlayerWait = "makeOtherPlayerWait"
    onWaitOnOtherPlayer = "onWaitOnOtherPlayer"
    onTurnEnd = "onTurnEnd"
    win = "win"
    lose = "lose"


def emit_joinWaitingRoom(game_id: str):
    data: JoinWaitingRoomData = {"game_id": game_id}
    emit(SocketEventsTo.joinWaitingRoom.value, data)


def emit_joinBattle(
    self_pokemon: Pokemon, target_pokemon: Pokemon, game_id: str, sid: str
):
    data: JoinBattleData = {
        "self_pokemon": self_pokemon,
        "target_pokemon": target_pokemon,
        "game_id": game_id,
    }
    emit(SocketEventsTo.joinBattle.value, data, to=sid)


def emit_joinBattleFromRoom(
    self_pokemon: Pokemon, target_pokemon: Pokemon, game_id: str, sid: str
):
    data: JoinBattleData = {
        "self_pokemon": self_pokemon,
        "target_pokemon": target_pokemon,
        "game_id": game_id,
    }
    emit(SocketEventsTo.joinBattleFromRoom.value, data, to=sid)


def emit_makeOtherPlayerWait(sid: str):
    emit(SocketEventsTo.makeOtherPlayerWait.value, to=sid)


def emit_onWaitOnOtherPlayer(sid: str):
    emit(SocketEventsTo.onWaitOnOtherPlayer.value, to=sid)


def emit_onTurnEnd(self_hp: float, target_hp: float, sid: str):
    data: BattleHP = {"self_hp": self_hp, "target_hp": target_hp}
    emit(SocketEventsTo.onTurnEnd.value, data, to=sid)


def emit_win(sid: str):
    emit(SocketEventsTo.win.value, to=sid)


def emit_lose(sid: str):
    emit(SocketEventsTo.lose.value, to=sid)
