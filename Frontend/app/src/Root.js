import styles from './App.css';


import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import { Events } from "./components/Events";
import { MyForm } from './components/MyForm';
import PokemonCard from './components/PokemonCard';
import { useNavigate, Outlet } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import React, { useState, useEffect, useLayoutEffect } from 'react';

export default function Root() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  //const [pokemonCards, setPokemonCards] = useState([]);
  const navigate = useNavigate()
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


    function onJoinWaitingRoom(data) {
      console.log(data)
      navigate(`/WaitingRoomScreen/${data.game_id}`)
    }

    function onJoinBattleFromRoom(data) {
      navigate('/PokemonBattleScreen', {
        state: data
      })
    }

    function onJoinBattle(data) {
      console.log(data)
      navigate('/PokemonBattleScreen', {
        //state: {
        //  self_player: data.self_player, target_player: data.target_player
        //}
        state: data
      })
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    //socket.on('createPokemonCard', onCreatePokemonCardEvent);
    socket.on('joinWaitingRoom', onJoinWaitingRoom);
    socket.on('joinBattle', onJoinBattle);
    socket.on('joinBattleFromRoom', onJoinBattleFromRoom);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      //socket.off('createPokemonCard', onCreatePokemonCardEvent);
      socket.off('joinWaitingRoom', onJoinWaitingRoom);
      socket.off('joinBattle', onJoinBattle);
      socket.off('joinBattleFromRoom', onJoinBattleFromRoom);
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
      <div >
        <Outlet />
      </div >

    </>
  );
}