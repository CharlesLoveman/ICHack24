import { io, Socket } from "socket.io-client";
import { backendAddress } from "./env";
import {
  AttackData,
  CreateBattleData,
  PlayerJoinBattleData,
} from "./sharedTypes";

interface ClientToServerEvents {
  attack: (data: AttackData) => void;
  joinBattle: (data: PlayerJoinBattleData) => void;
  createBattle: (data: CreateBattleData) => void;
}

export const socket = io(backendAddress, {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd",
  },
}) as Socket<ClientToServerEvents>;
