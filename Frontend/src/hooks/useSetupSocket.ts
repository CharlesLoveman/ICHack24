import { socket, SocketEventsTo } from "../socket";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  JoinBattleData,
  JoinWaitingRoomData,
  LoginAckData,
  MoveData,
  NotificationData,
  OnTurnEndData,
  PokemonCreatedResponse,
} from "../sharedTypes";
import { BATTLE_RESULT, BATTLE_STATE, POKEMON_HAS_RETURNED } from "../types";
import { useSocket } from "./useSocket";
import { useGlobalData } from "./useGlobalData";
import { baseBattleData, clearBattleStates } from "./useSetupGlobalData";

export function useSetupSocket() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isConnected, setIsConnected] = useState(socket.connected);
  const globalData = useGlobalData();
  const {
    setNewTurn,
    setBattleData,
    setBattleHP,
    setBattleResult,
    setCurrentBattleMoves,
    setJoinBattleData,
    username,
    battleState,
    setBattleState,
    notifications,
    setNotifications,
    setUsername,
    setPokemonReturned,
    setNoNewPokemon,
    noNewPokemon,
  } = globalData;

  const navigate = useNavigate();

  function onConnect() {
    setIsConnected(true);
  }

  function onDisconnect() {
    setIsConnected(false);
  }

  const emptyStateFunction = () => () => {};

  /** Because useState and setState can take in functional setters, we need to add an extra level so the actual stored value is a function */
  const [doTurnEndTransition, setDoTurnEndTransition] =
    useState<() => void>(emptyStateFunction);
  const [doBattleResultTransition, setDoBattleResultTransition] =
    useState<() => void>(emptyStateFunction);

  useEffect(() => {
    if (battleState === BATTLE_STATE.IDLING) {
      doTurnEndTransition();
      setDoTurnEndTransition(emptyStateFunction);
      doBattleResultTransition();
      setDoBattleResultTransition(emptyStateFunction);
    }
  }, [battleState]);

  useEffect(() => {
    if (username !== undefined && isConnected) {
      socket.emit("associateUsernameWithSocket", { username });
    }
  }, [username, isConnected]);

  function onJoinWaitingRoom(data: JoinWaitingRoomData) {
    navigate(`/waiting-room/${data.game_id}`);
  }

  function onJoinBattleFromRoom(data: JoinBattleData) {
    clearBattleStates(globalData);
    setBattleHP({
      self_hp: data.self_pokemon.stats.hp,
      target_hp: data.target_pokemon.stats.hp,
    });
    setJoinBattleData(data);
    setBattleState(BATTLE_STATE.IDLING);
    navigate(`/battle/${data.game_id}`);
  }

  function onJoinBattle(data: JoinBattleData) {
    clearBattleStates(globalData);
    setBattleHP({
      self_hp: data.self_pokemon.stats.hp,
      target_hp: data.target_pokemon.stats.hp,
    });
    setJoinBattleData(data);
    setBattleState(BATTLE_STATE.IDLING);
    navigate(`/battle/${data.game_id}`);
  }

  function onWaitOnOtherPlayer() {
    setBattleData({ ...baseBattleData, thisPlayerWaiting: true });
  }

  function onMakeOtherPlayerWait() {
    setBattleData({ ...baseBattleData, otherPlayerWaiting: true });
  }

  function onTurnEnd(data: OnTurnEndData) {
    const moves: MoveData = {
      self_attack_name: data.self_attack_name,
      target_attack_name: data.target_attack_name,
    };
    setCurrentBattleMoves(moves);
    setBattleData({ ...baseBattleData });

    const _doTurnEndTransition = () => {
      setBattleHP({
        self_hp: data.self_hp,
        target_hp: data.target_hp,
      });
      setNewTurn(true);
    };

    setBattleState(BATTLE_STATE.RESOLVING_ATTACKS);
    setDoTurnEndTransition(() => _doTurnEndTransition);
  }

  function onWin() {
    setBattleData({ ...baseBattleData });

    const _doBattleResultTransition = () => {
      setBattleResult(BATTLE_RESULT.WIN);
    };
    setDoBattleResultTransition(() => _doBattleResultTransition);
  }

  function onLose() {
    setBattleData({ ...baseBattleData });

    const _doBattleResultTransition = () => {
      setBattleResult(BATTLE_RESULT.LOSE);
    };
    setDoBattleResultTransition(() => _doBattleResultTransition);
  }

  function onNotification(data: NotificationData) {
    setNotifications([...notifications, data]);
  }

  function onLoginAck(data: LoginAckData) {
    // Plausible TODO: use the pid in the frontend and backend as a unique id
    // For now, we assume usernames are unique, plus let you log in as the same user again
    console.log(data.pid);
    setUsername(data.username);
  }

  function onGetPokemonCreatedResponse(data: PokemonCreatedResponse) {
    setPokemonReturned(POKEMON_HAS_RETURNED.RETURNED);

    if (data.succeeded) {
      setNoNewPokemon(noNewPokemon + 1);
    }
  }

  useSocket(SocketEventsTo.connect, onConnect);
  useSocket(SocketEventsTo.disconnect, onDisconnect);
  useSocket(SocketEventsTo.joinWaitingRoom, onJoinWaitingRoom);
  useSocket(SocketEventsTo.joinBattle, onJoinBattle);
  useSocket(SocketEventsTo.joinBattleFromRoom, onJoinBattleFromRoom);
  useSocket(SocketEventsTo.makeOtherPlayerWait, onMakeOtherPlayerWait);
  useSocket(SocketEventsTo.onWaitOnOtherPlayer, onWaitOnOtherPlayer);
  useSocket(SocketEventsTo.onTurnEnd, onTurnEnd);
  useSocket(SocketEventsTo.win, onWin);
  useSocket(SocketEventsTo.lose, onLose);
  useSocket(SocketEventsTo.notification, onNotification);
  useSocket(SocketEventsTo.loginAck, onLoginAck);
  useSocket(
    SocketEventsTo.getPokemonCreatedResponse,
    onGetPokemonCreatedResponse
  );

  return { isConnected };
}
