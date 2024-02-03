import './App.css';

import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import { Events } from "./components/Events";
import { MyForm } from './components/MyForm';
import PokemonCard from './components/PokemonCard';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
});


export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [pokemonCards, setPokemonCards] = useState([]);
  const [state, setState] = useState({screen: MainScreen, data: {}});

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onCreatePokemonCardEvent(pokemon) {
      setPokemonCards([...pokemonCards, pokemon]);
    }
    
    function onJoinWaitingRoom(data) {
      setState({screen: WaitingRoomScreen, data: data})
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('createPokemonCard', onCreatePokemonCardEvent);
    socket.on('joinWaitingRoom', onJoinWaitingRoom);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('createPokemonCard', onCreatePokemonCardEvent);
      socket.off('joinWaitingRoom', onJoinWaitingRoom);
    };
  }, [pokemonCards, state]);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <ConnectionState isConnected={ isConnected } />
        {s}
        {pokemonCards.map(x => PokemonCard(x))}
        <ConnectionManager />
        <MyForm />
      </div>
    </ThemeProvider>
  );
}