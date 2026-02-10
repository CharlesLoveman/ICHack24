from enum import Enum
import time

from flask_socketio import emit
from socketio import Server

from .server import socketio
from .store import users_to_sockets
from .sharedTypes import (
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
    rejoinBattle = "rejoinBattle"
    getPokemonCreatedAck = "getPokemonCreatedAck"


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
    emit(SocketEventsTo.notification.value, data, to=sid, namespace="/")


def emit_loginAck(username: str, pid: str, sid: str):
    data: LoginAckData = {"pid": pid, "username": username}
    emit(SocketEventsTo.loginAck.value, data, to=sid)


def emit_getPokemonCreatedResponse(succeeded: bool, sid: str):
    data: PokemonCreatedResponse = {"succeeded": succeeded}
    emit(SocketEventsTo.getPokemonCreatedResponse.value, data, to=sid, namespace="/")


def emit_rejoinBattle(
    self_pokemon: IPokemon, target_pokemon: IPokemon, game_id: str, sid: str
):
    data: JoinBattleData = {
        "self_pokemon": self_pokemon,
        "target_pokemon": target_pokemon,
        "game_id": game_id,
    }
    emit(SocketEventsTo.rejoinBattle.value, data, to=sid)


def emit_getPokemonCreatedAck(sid: str):
    emit(SocketEventsTo.getPokemonCreatedAck.value, to=sid, namespace="/")


def emit_notification_with_retries(message: str, severity: str, username: str):
    data: NotificationData = {"message": message, "severity": severity}
    emit_with_retries(SocketEventsTo.notification.value, data, username=username)


def emit_getPokemonCreatedAck_with_retries(username: str):
    emit_with_retries(
        SocketEventsTo.getPokemonCreatedAck.value, data=None, username=username
    )


def emit_with_retries(event, data, username, namespace="/", retries=3, delay=10):
    """
    Attempt to emit to a specific client SID multiple times if not connected.
    """
    attempt = 0
    while attempt < retries:
        attempt += 1
        sid = users_to_sockets[username]
        # Check if client is connected
        server: Server = socketio.server  # type: ignore
        if server.manager.is_connected(sid, "/"):
            emit(event, data, to=sid, namespace=namespace)
            print(f"Sent {event} to {sid} on attempt {attempt}")
            return True
        else:
            print(
                f"Client {sid} not connected. Retry {attempt}/{retries} in {delay}s..."
            )
            time.sleep(delay)
    print(f"Failed to send {event} to {username} after {retries} attempts")
    return False
