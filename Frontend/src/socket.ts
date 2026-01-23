import { io, Socket } from "socket.io-client";
import { backendAddress } from "./env";
import {
  AttackData,
  CreateBattleData,
  JoinBattleData,
  JoinWaitingRoomData,
  OnTurnEndData,
  PlayerJoinBattleData,
} from "./sharedTypes";

export enum SocketEventTo {
  connect = "connect",
  disconnect = "disconnect",
  // createPokemonCard = "createPokemonCard",
  joinWaitingRoom = "joinWaitingRoom",
  joinBattle = "joinBattle",
  joinBattleFromRoom = "joinBattleFromRoom",
  makeOtherPlayerWait = "makeOtherPlayerWait",
  onWaitOnOtherPlayer = "onWaitOnOtherPlayer",
  onTurnEnd = "onTurnEnd",
  win = "win",
  lose = "lose",
}
export interface ClientToServerEvents {
  attack: (data: AttackData) => void;
  joinBattle: (data: PlayerJoinBattleData) => void;
  createBattle: (data: CreateBattleData) => void;
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
}

export const socket = io(backendAddress, {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd",
  },
}) as Socket<ServerToClientEvents, ClientToServerEvents>;
