import { socket, SocketEventTo } from "../socket";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  JoinBattleData,
  JoinWaitingRoomData,
  MoveData,
  OnTurnEndData,
} from "../sharedTypes";
import { BATTLE_RESULT } from "../types";
import { useSocket } from "./useSocket";
import { useGlobalData } from "./useGlobalData";

export function useSetupSocket() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isConnected, setIsConnected] = useState(socket.connected);
  const {
    setNewTurn,
    setBattleData,
    setBattleHP,
    setBattleResult,
    setCurrentBattleMoves,
    setCommentaryFinished,
    commentaryFinished,
    currentBattleMoves,
  } = useGlobalData();
  //const [pokemonCards, setPokemonCards] = useState([]);
  const navigate = useNavigate();
  const baseBattleData = {
    otherPlayerWaiting: false,
    thisPlayerWaiting: false,
  };

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
    if (commentaryFinished) {
      doTurnEndTransition();
      setDoTurnEndTransition(emptyStateFunction);
      console.log(doBattleResultTransition);
      doBattleResultTransition();
      setDoBattleResultTransition(emptyStateFunction);
      setCommentaryFinished(undefined);
    }
  }, [commentaryFinished]);

  useEffect(() => {
    console.log(currentBattleMoves);
  });

  //function onCreatePokemonCardEvent(pokemon) {
  //  setPokemonCards([...pokemonCards, pokemon]);
  //}

  function onJoinWaitingRoom(data: JoinWaitingRoomData) {
    console.log(data);
    navigate(`/WaitingRoomScreen/${data.game_id}`);
  }

  function onJoinBattleFromRoom(data: JoinBattleData) {
    setBattleData(baseBattleData);
    setBattleResult(undefined);
    setBattleHP({
      self_hp: data.self_pokemon.stats.hp,
      target_hp: data.target_pokemon.stats.hp,
    });
    navigate(`/PokemonBattleScreen/${data.game_id}`, {
      state: data,
    });
  }

  function onJoinBattle(data: JoinBattleData) {
    console.log(data);
    setBattleData(baseBattleData);
    setBattleResult(undefined);
    setBattleHP({
      self_hp: data.self_pokemon.stats.hp,
      target_hp: data.target_pokemon.stats.hp,
    });
    navigate(`/PokemonBattleScreen/${data.game_id}`, {
      state: data,
    });
  }

  function onWaitOnOtherPlayer() {
    const battleData = { ...baseBattleData };
    battleData.thisPlayerWaiting = true;
    setBattleData({ ...battleData });
  }

  function onMakeOtherPlayerWait() {
    const battleData = { ...baseBattleData };
    battleData.otherPlayerWaiting = true;
    setBattleData({ ...battleData });
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
      setCurrentBattleMoves(undefined);
    };

    setTimeout(() => {
      setCommentaryFinished(false);
      setDoTurnEndTransition(() => _doTurnEndTransition);
    }, 1000);
  }

  function win() {
    setNewTurn(true);
    setBattleData({ ...baseBattleData });

    const _doBattleResultTransition = () => {
      setBattleResult(BATTLE_RESULT.WIN);
    };
    setDoBattleResultTransition(() => _doBattleResultTransition);
  }

  function lose() {
    setNewTurn(true);
    setBattleData({ ...baseBattleData });

    const _doBattleResultTransition = () => {
      setBattleResult(BATTLE_RESULT.LOSE);
    };
    setDoBattleResultTransition(() => _doBattleResultTransition);
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

  return { isConnected };
}
