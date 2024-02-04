import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import JoinRoomInputBox from '../JoinRoomInputBox.js'
import { BrowserRouter as Router, Link } from "react-router-dom";
import { GiBattleAxe } from "react-icons/gi";
import { MdCatchingPokemon } from "react-icons/md";
import './styles.css';

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
        <Button onClick={() => createBattle(pokemon)} variant='contained' size='large' startIcon={<GiBattleAxe />}>Create Battle</Button>
        <br />
        {JoinRoomInputBox(pokemon)}
        <br />
        <Button variant='contained' size='large' startIcon={<GiBattleAxe />}><Link style={{ textDecoration: 'none' }} to="../PokemonListScreen/" >View Pokemon</Link></Button>
        <br />
        <Button variant='contained' size='large' startIcon={<MdCatchingPokemon />}><Link style={{ textDecoration: 'none' }} to="../PokemonCaptureScreen/">Capture Pokemon!</Link></Button>
      </CardContent >
    </Card >
  );
}

