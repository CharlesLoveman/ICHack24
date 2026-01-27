import { socket, SocketEventTo } from "../socket";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  JoinBattleData,
  JoinWaitingRoomData,
  MoveData,
  NotificationData,
  OnTurnEndData,
} from "../sharedTypes";
import { BATTLE_RESULT, BATTLE_STATE } from "../types";
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
    navigate(`/WaitingRoomScreen/${data.game_id}`);
  }

  function onJoinBattleFromRoom(data: JoinBattleData) {
    clearBattleStates(globalData);
    setBattleHP({
      self_hp: data.self_pokemon.stats.hp,
      target_hp: data.target_pokemon.stats.hp,
    });
    setJoinBattleData(data);
    setBattleState(BATTLE_STATE.IDLING);
    navigate(`/PokemonBattleScreen/${data.game_id}`);
  }

  function onJoinBattle(data: JoinBattleData) {
    clearBattleStates(globalData);
    setBattleHP({
      self_hp: data.self_pokemon.stats.hp,
      target_hp: data.target_pokemon.stats.hp,
    });
    setJoinBattleData(data);
    setBattleState(BATTLE_STATE.IDLING);
    navigate(`/PokemonBattleScreen/${data.game_id}`);
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

  function win() {
    setBattleData({ ...baseBattleData });

    const _doBattleResultTransition = () => {
      setBattleResult(BATTLE_RESULT.WIN);
    };
    setDoBattleResultTransition(() => _doBattleResultTransition);
  }

  function lose() {
    setBattleData({ ...baseBattleData });

    const _doBattleResultTransition = () => {
      setBattleResult(BATTLE_RESULT.LOSE);
    };
    setDoBattleResultTransition(() => _doBattleResultTransition);
  }

  function notification(data: NotificationData) {
    setNotifications([...notifications, data]);
  }

  useSocket(SocketEventTo.connect, onConnect);
  useSocket(SocketEventTo.disconnect, onDisconnect);
  useSocket(SocketEventTo.joinWaitingRoom, onJoinWaitingRoom);
  useSocket(SocketEventTo.joinBattle, onJoinBattle);
  useSocket(SocketEventTo.joinBattleFromRoom, onJoinBattleFromRoom);
  useSocket(SocketEventTo.makeOtherPlayerWait, onMakeOtherPlayerWait);
  useSocket(SocketEventTo.onWaitOnOtherPlayer, onWaitOnOtherPlayer);
  useSocket(SocketEventTo.onTurnEnd, onTurnEnd);
  useSocket(SocketEventTo.win, win);
  useSocket(SocketEventTo.lose, lose);
  useSocket(SocketEventTo.notification, notification);

  return { isConnected };
}
