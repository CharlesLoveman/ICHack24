from enum import Enum

from flask_socketio import emit

from Backend.app import Request
from Backend.types import BattleData, BattleHP, JoinBattleData, JoinWaitingRoomData

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

def emit_joinWaitingRoom(data: JoinWaitingRoomData):
    emit(SocketEventsTo.joinWaitingRoom, data)

def emit_joinBattle(data: JoinBattleData, sid: str):
    emit(SocketEventsTo.joinBattle, data, to=sid)

def emit_joinBattleFromRoom(data: JoinBattleData, sid: str):
    emit(SocketEventsTo.joinBattleFromRoom, data, to=sid)

def emit_makeOtherPlayerWait(sid: str):
    emit(SocketEventsTo.makeOtherPlayerWait, to=sid)

def emit_onWaitOnOtherPlayer(sid: str):
    emit(SocketEventsTo.onWaitOnOtherPlayer, to=sid)

def emit_onTurnEnd(data: BattleHP, sid: str):
    emit(SocketEventsTo.onTurnEnd, data, to=sid)

def emit_win(sid: str):
    emit(SocketEventsTo.win, to=sid)

def emit_lose(sid: str):
    emit(SocketEventsTo.lose, to=sid)