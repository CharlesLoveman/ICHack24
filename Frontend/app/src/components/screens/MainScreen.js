import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import JoinRoomInputBox from '../JoinRoomInputBox.js'
import { BrowserRouter as Router, Link } from "react-router-dom";

import { socket } from '../../socket';

export default function MainScreen() {

  function createBattle(pokemon) {

    if (pokemon) {
      socket.emit('createBattle', { player_id: document.cookie["player_id"], pokemon_id: pokemon.id })
    }

  }

  const [pokemon, setPokemon] = useState();
  function createBattle(pokemon) {

    if (pokemon) {
      socket.emit('createBattle', { player_id: document.cookie["player_id"], pokemon_id: pokemon.id })
    }

  }

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Button onClick={() => createBattle(pokemon)}>Create Battle</Button>
        <br />
        {JoinRoomInputBox(pokemon)}
        <br />
        <Button><Link style={{ textDecoration: 'none' }} to="../PokemonListScreen/">View Pokemon</Link></Button>
        <br />
        <Button><Link style={{ textDecoration: 'none' }} to="../PokemonCaptureScreen/">Capture Pokemon!</Link></Button>

      </CardContent >
    </Card >
  );
}
