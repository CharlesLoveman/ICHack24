import './App.css';

import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import { Events } from "./components/Events";
import { MyForm } from './components/MyForm';
import PokemonCard from './components/PokemonCard';
import PokemonList from './components/PokemonList';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
});


export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [pokemonCards, setPokemonCards] = useState([]);

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

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('createPokemonCard', onCreatePokemonCardEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('createPokemonCard', onCreatePokemonCardEvent);
    };
  }, [pokemonCards]);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <ConnectionState isConnected={isConnected} />
        {pokemonCards.map(x => PokemonCard(x))}
        {PokemonList(pokemonCards)}
        <ConnectionManager />

        <MyForm />
      </div>
    </ThemeProvider>
  );
}