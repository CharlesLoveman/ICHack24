import { io, Socket } from "socket.io-client";
import { backendAddress } from "./env";
import {
  AssociateUsernameWithSocketData,
  AttackData,
  CreateBattleData,
  JoinBattleData,
  JoinWaitingRoomData,
  LoginAckData,
  NotificationData,
  OnTurnEndData,
  PlayerJoinBattleData,
} from "./sharedTypes";

export enum SocketEventTo {
  connect = "connect",
  disconnect = "disconnect",
  joinWaitingRoom = "joinWaitingRoom",
  joinBattle = "joinBattle",
  joinBattleFromRoom = "joinBattleFromRoom",
  makeOtherPlayerWait = "makeOtherPlayerWait",
  onWaitOnOtherPlayer = "onWaitOnOtherPlayer",
  onTurnEnd = "onTurnEnd",
  win = "win",
  lose = "lose",
  notification = "notification",
  login = "login",
  loginAck = "loginAck",
}
export interface ClientToServerEvents {
  attack: (data: AttackData) => void;
  joinBattle: (data: PlayerJoinBattleData) => void;
  createBattle: (data: CreateBattleData) => void;
  associateUsernameWithSocket: (data: AssociateUsernameWithSocketData) => void;
  login: (data: AssociateUsernameWithSocketData) => void;
}

export interface ServerToClientEvents {
  connect: () => void;
  disconnect: () => void;
  joinWaitingRoom: (data: JoinWaitingRoomData) => void;
  joinBattle: (data: JoinBattleData) => void;
  joinBattleFromRoom: (data: JoinBattleData) => void;
  makeOtherPlayerWait: () => void;
  onWaitOnOtherPlayer: () => void;
  onTurnEnd: (data: OnTurnEndData) => void;
  win: () => void;
  lose: () => void;
  notification: (data: NotificationData) => void;
  loginAck: (data: LoginAckData) => void;
}

export const socket = io(backendAddress, {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd",
  },
}) as Socket<ServerToClientEvents, ClientToServerEvents>;
