import { socket } from "./socket";
import { ConnectionManager } from "./components/ConnectionManager";
import { useNavigate, Outlet } from "react-router-dom";
import { useState, useContext } from "react";
import { GlobalData } from "./App";
import { BattleHP, JoinBattleData, JoinWaitingRoomData } from "./sharedTypes";
import { BATTLE_RESULT, GlobalContextType } from "./types";
import { useSocket } from "./useSocket";

export default function Root() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { setNewTurn, setBattleData, setBattleHP, setBattleResult } =
    useContext(GlobalData) as GlobalContextType;
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

  function onTurnEnd(data: BattleHP) {
    const battleData = { ...baseBattleData };
    setBattleHP({
      self_hp: data.self_hp,
      target_hp: data.target_hp,
    });
    console.log(battleData);
    console.log(baseBattleData);
    setNewTurn(true);
    setBattleData({ ...battleData });
  }

  function win() {
    setNewTurn(true);
    setBattleData({ ...baseBattleData });
    setBattleResult(BATTLE_RESULT.WIN);
  }

  function lose() {
    setNewTurn(true);
    setBattleData({ ...baseBattleData });
    setBattleResult(BATTLE_RESULT.LOSE);
  }
  enum SocketEventTo {
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

  return (
    <>
      <ConnectionManager />
      <div>
        <Outlet />
      </div>
    </>
  );
}
