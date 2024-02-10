import React, { useEffect, useState } from 'react';
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
import Paper from '@mui/material/Paper';

import { socket } from '../../socket';
import { fontFamily } from '@mui/system';
import getWindowStyle from '../../Global.js';
import useWindowStyle from '../../Global.js';

import { useLayoutEffect } from 'react';

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


  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }

  const [width, height] = useWindowSize();
  //var sx = { "font-size": width / 15 };
  var sx = { "font-size": height / 30 };



  return (
    <>
      <Button sx={{ "font-size": width / 30 }}>Register</Button>
      <Card sx={sx} maxWidth="60%">
        <CardContent >
          <div style={{ textAlign: 'center' }}>Hello Pokemon Trainer {player_id}, what would you like to do?</div>
          <Button sx={sx} onClick={() => initialiseUser()}>hi</Button>
          <br />
          <Button sx={sx} fullWidth='true' onClick={() => createBattle(pokemon)} variant='contained' startIcon={<GiBattleGear size="1rem" />} endIcon={<GiBattleGear size="1rem" />} color='error'>Create Battle</Button>
          <br /><br />
          <div style={{ textAlign: 'center' }}>{JoinRoomInputBox(pokemon, sx)}</div>
          <br /><br />
          <Button sx={sx} fullWidth='true' variant='contained' size='large' startIcon={< GiHouse size="1rem" />} endIcon={< GiHouse size="1rem" />}><Link style={{ textDecoration: 'none' }} to={`../PokemonListScreen/${player_id}`} >View Pokemon</Link></Button>
          <br /><br />
          <Button sx={sx} fullWidth='true' variant='contained' size='large' startIcon={<MdCatchingPokemon size="1rem" />} endIcon={<MdCatchingPokemon size="1rem" />}><Link style={{ textDecoration: 'none' }} to={`../PokemonCaptureScreen/${player_id}`}>Capture Pokemon!</Link></Button>
        </CardContent>
      </Card >
    </>
  );
}

