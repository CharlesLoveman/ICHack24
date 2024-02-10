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
import { fontFamily } from '@mui/system';

const player_id = String(Math.floor(Math.random() * 1000000))

export default function MainScreen() {

  var pokemon

  function initialiseUser() {
    axios.post(`http://127.0.0.1:5000/InitialiseUser/${player_id}`)
  }

  // initialiseUser()

  function fetchPokemon() {
    var pokemons = axios.get(`http://127.0.0.1:5000/ListPokemon/${player_id}`);
    if (pokemons) {
      pokemon = pokemons[0];
    }
  }

  // fetchPokemon()

  function createBattle(pokemon) {

    if (pokemon) {
      socket.emit('createBattle', { player_id: document.cookie["player_id"], pokemon_id: pokemon.id })
    }

  }

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent >
        <div style={{ textAlign: 'center' }}>Hello Pokemon Trainer {player_id}, what would you like to do?</div>
        <Button onClick={() => initialiseUser()}>hi</Button>
        <br />
        <Button fullWidth='true' onClick={() => createBattle(pokemon)} variant='contained' startIcon={<GiBattleGear size="1rem" />} endIcon={<GiBattleGear size="1rem" />} color='error'>Create Battle</Button>
        <br /><br />
        <div style={{ textAlign: 'center' }}>{JoinRoomInputBox(pokemon)}</div>
        <br /><br />
        <Button fullWidth='true' variant='contained' size='large' startIcon={< GiHouse size="1rem" />} endIcon={< GiHouse size="1rem" />}><Link style={{ textDecoration: 'none' }} to={`../PokemonListScreen/${player_id}`} >View Pokemon</Link></Button>
        <br /><br />
        <Button fullWidth='true' variant='contained' size='large' startIcon={<MdCatchingPokemon size="1rem" />} endIcon={<MdCatchingPokemon size="1rem" />}><Link style={{ textDecoration: 'none' }} to={`../PokemonCaptureScreen/${player_id}`}>Capture Pokemon!</Link></Button>
      </CardContent >
    </Card >
  );
}

