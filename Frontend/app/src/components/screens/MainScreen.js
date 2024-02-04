import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import JoinRoomInputBox from '../JoinRoomInputBox.js'
import { BrowserRouter as Router, Link } from "react-router-dom";
import axios from 'axios';
import { GiBattleGear } from "react-icons/gi";
import { MdCatchingPokemon } from "react-icons/md";
import { GiHouse } from "react-icons/gi";
import './styles.css';

import { socket } from '../../socket';

 const player_id = String(Math.floor(Math.random() * 1000000))

export default function MainScreen() {

  var pokemon

  function fetchPokemon()
  {
    var pokemons = axios.get(`http://127.0.0.1:5000/ListPokemon/${player_id}`);
    if (pokemons)
    {
      pokemon = pokemons[0];
    }
  }

  fetchPokemon()
      
  function createBattle(pokemon) {

    if (pokemon) {
      socket.emit('createBattle', { player_id: document.cookie["player_id"], pokemon_id: pokemon.id })
    }

  }

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent >
        <Button onClick={() => createBattle(pokemon)} variant='contained' size='large' startIcon={<GiBattleGear />} color='secondary'>Create Battle</Button>
        <br /><br />
        {JoinRoomInputBox(pokemon)}
        <br /><br />
        <Button variant='contained' size='large' startIcon={< GiHouse />}><Link style={{ textDecoration: 'none' }} to="../PokemonListScreen/" >View Pokemon</Link></Button>
        <br /><br />
        <Button variant='contained' size='large' startIcon={<MdCatchingPokemon />}><Link style={{ textDecoration: 'none' }} to="../PokemonCaptureScreen/">Capture Pokemon!</Link></Button>
      </CardContent >
    </Card >
  );
}

