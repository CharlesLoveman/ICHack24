from enum import Enum

from flask_socketio import emit

from sharedTypes import (
    JoinBattleData,
    JoinWaitingRoomData,
    LoginAckData,
    NotificationData,
    OnTurnEndData,
    IPokemon,
    PokemonCreatedResponse,
)


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
    notification = "notification"
    loginAck = "loginAck"
    getPokemonCreatedResponse = "getPokemonCreatedResponse"


def emit_joinWaitingRoom(game_id: str, sid: str):
    data: JoinWaitingRoomData = {"game_id": game_id}
    emit(SocketEventsTo.joinWaitingRoom.value, data, to=sid)


def emit_joinBattle(
    self_pokemon: IPokemon, target_pokemon: IPokemon, game_id: str, sid: str
):
    data: JoinBattleData = {
        "self_pokemon": self_pokemon,
        "target_pokemon": target_pokemon,
        "game_id": game_id,
    }
    emit(SocketEventsTo.joinBattle.value, data, to=sid)


def emit_joinBattleFromRoom(
    self_pokemon: IPokemon, target_pokemon: IPokemon, game_id: str, sid: str
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


def emit_onTurnEnd(
    self_hp: float,
    target_hp: float,
    self_attack_name: str,
    target_attack_name: str,
    sid: str,
):
    data: OnTurnEndData = {
        "self_hp": self_hp,
        "target_hp": target_hp,
        "self_attack_name": self_attack_name,
        "target_attack_name": target_attack_name,
    }
    emit(SocketEventsTo.onTurnEnd.value, data, to=sid)


def emit_win(sid: str):
    emit(SocketEventsTo.win.value, to=sid)


def emit_lose(sid: str):
    emit(SocketEventsTo.lose.value, to=sid)


def emit_notification(message: str, severity: str, sid: str):
    data: NotificationData = {"message": message, "severity": severity}
    emit(SocketEventsTo.notification.value, data, to=sid)


def emit_loginAck(username: str, pid: str, sid: str):
    data: LoginAckData = {"pid": pid, "username": username}
    emit(SocketEventsTo.loginAck.value, data, to=sid)


def emit_getPokemonCreatedResponse(succeeded: bool, sid: str):
    data: PokemonCreatedResponse = {"succeeded": succeeded}
    emit(SocketEventsTo.getPokemonCreatedResponse.value, data, to=sid)
