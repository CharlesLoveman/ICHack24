import './App.css';

import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import { Events } from "./components/Events";
import { MyForm } from './components/MyForm';
import PokemonCard from './components/PokemonCard';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MainScreen from './screens/MainScreen';
import { useNavigate, Outlet } from "react-router-dom";

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

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      //socket.off('createPokemonCard', onCreatePokemonCardEvent);
      socket.off('joinWaitingRoom', onJoinWaitingRoom);
      socket.off('joinBattle', onJoinBattle);
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
      <Outlet />
    </>
  );
}