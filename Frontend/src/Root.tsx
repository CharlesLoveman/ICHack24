import { socket } from "./socket";
import { ConnectionManager } from "./components/ConnectionManager";
import { useNavigate, Outlet } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { GlobalData } from "./App";
import { Pokemon } from "./sharedTypes";
import { GlobalContextType } from "./types";

export default function Root() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const globalData = useContext(GlobalData) as GlobalContextType;
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
      globalData.setBattleData(baseBattleData);
      globalData.setBattleResult("");
      globalData.setBattleHP({
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
      globalData.setBattleData(baseBattleData);
      globalData.setBattleResult("");
      globalData.setBattleHP({
        self_hp: data.self_pokemon.stats.hp,
        target_hp: data.target_pokemon.stats.hp,
      });
      navigate(`/PokemonBattleScreen/${data.game_id}`, {
        state: data,
      });
    }

    function onWaitOnOtherPlayer(data: any) {
      const battleData = { ...baseBattleData };
      battleData.thisPlayerWaiting = true;
      globalData.setBattleData({ ...battleData });
    }

    function onMakeOtherPlayerWait(data: any) {
      const battleData = { ...baseBattleData };
      battleData.otherPlayerWaiting = true;
      globalData.setBattleData({ ...battleData });
    }

    function onTurnEnd(data: { self_hp: number; target_hp: number }) {
      const battleData = { ...baseBattleData };
      globalData.setBattleHP({
        self_hp: data.self_hp,
        target_hp: data.target_hp,
      });
      console.log(battleData);
      console.log(baseBattleData);
      globalData.setNewTurn(true);
      globalData.setBattleData({ ...battleData });
    }

    function win(data: any) {
      globalData.setNewTurn(true);
      globalData.setBattleData({ ...baseBattleData });
      globalData.setBattleResult("win");
    }

    function lose(data: any) {
      globalData.setNewTurn(true);
      globalData.setBattleData({ ...baseBattleData });
      globalData.setBattleResult("lose");
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
