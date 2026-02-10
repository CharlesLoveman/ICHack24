import { io, Socket } from "socket.io-client";
import { backendAddress } from "./env";
import {
  UsernameData,
  AttackData,
  CreateBattleData,
  CreatePokemonData,
  JoinBattleData,
  JoinWaitingRoomData,
  LoginAckData,
  NotificationData,
  OnePokemonData,
  OnTurnEndData,
  PlayerJoinBattleData,
  IPokemon,
  PokemonCreatedResponse,
  PokemonsData,
} from "./sharedTypes";

export enum SocketEventsTo {
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
  getPokemonCreatedResponse = "getPokemonCreatedResponse",
  rejoinBattle = "rejoinBattle",
  getPokemonCreatedAck = "getPokemonCreatedAck",
}
export interface ClientToServerEvents {
  attack: (data: AttackData) => void;
  joinBattle: (data: PlayerJoinBattleData) => void;
  createBattle: (data: CreateBattleData) => void;
  associateUsernameWithSocket: (data: UsernameData) => void;
  login: (data: UsernameData) => void;
  createPokemon: (data: CreatePokemonData) => void;
  requestUserPokemons: (
    data: UsernameData,
    ack: (data: PokemonsData) => void,
  ) => void;
  requestAllPokemons: (ack: (data: PokemonsData) => void) => void;
  requestOnePokemon: (
    data: OnePokemonData,
    ack: (data: IPokemon) => void,
  ) => void;
  deletePokemon: (
    data: OnePokemonData,
    ack: (succeeded: boolean) => void,
  ) => void;
  addPokemonToUser: (
    data: CreateBattleData,
    ack: (succeeded: boolean) => void,
  ) => void;
  requestCreationUpdate: (data: UsernameData) => void;
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
  getPokemonCreatedResponse: (data: PokemonCreatedResponse) => void;
  rejoinBattle: (data: JoinBattleData) => void;
  getPokemonCreatedAck: () => void;
}

export const socket = io(backendAddress, {
  withCredentials: true,
}) as Socket<ServerToClientEvents, ClientToServerEvents>;
