import { socket } from "./socket";
import { ConnectionManager } from "./components/ConnectionManager";
import { useNavigate, Outlet } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { GlobalData } from "./App";
import { Pokemon } from "./sharedTypes";
import { BATTLE_RESULT, GlobalContextType } from "./types";

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

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    //function onCreatePokemonCardEvent(pokemon) {
    //  setPokemonCards([...pokemonCards, pokemon]);
    //}

    function onJoinWaitingRoom(data: { game_id: string }) {
      console.log(data);
      navigate(`/WaitingRoomScreen/${data.game_id}`);
    }

    function onJoinBattleFromRoom(data: {
      self_pokemon: Pokemon;
      target_pokemon: Pokemon;
      game_id: string;
    }) {
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

    function onJoinBattle(data: {
      self_pokemon: Pokemon;
      target_pokemon: Pokemon;
      game_id: string;
    }) {
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

    function onTurnEnd(data: { self_hp: number; target_hp: number }) {
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

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    //socket.on('createPokemonCard', onCreatePokemonCardEvent);
    socket.on("joinWaitingRoom", onJoinWaitingRoom);
    socket.on("joinBattle", onJoinBattle);
    socket.on("joinBattleFromRoom", onJoinBattleFromRoom);
    socket.on("makeOtherPlayerWait", onMakeOtherPlayerWait);
    socket.on("onWaitOnOtherPlayer", onWaitOnOtherPlayer);
    socket.on("onTurnEnd", onTurnEnd);
    socket.on("win", win);
    socket.on("lose", lose);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      //socket.off('createPokemonCard', onCreatePokemonCardEvent);
      socket.off("joinWaitingRoom", onJoinWaitingRoom);
      socket.off("joinBattle", onJoinBattle);
      socket.off("joinBattleFromRoom", onJoinBattleFromRoom);
      socket.off("makeOtherPlayerWait", onMakeOtherPlayerWait);
      socket.off("onWaitOnOtherPlayer", onWaitOnOtherPlayer);
      socket.off("onTurnEnd", onTurnEnd);
    };
  }, []);

  //<div className="App">
  //    <ConnectionState isConnected={ isConnected } />
  //    {state.screen(state.data, setState, sendMessage)}
  //    <ConnectionManager />
  //    <MyForm />
  //  </div>

  return (
    <>
      <ConnectionManager />
      <div>
        <Outlet />
      </div>
    </>
  );
}
