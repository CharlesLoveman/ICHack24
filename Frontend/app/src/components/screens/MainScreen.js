import React, { useContext, useEffect, useState } from 'react';
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

import { useLayoutEffect } from 'react';
import LoginInputBox from '../LoginInputBox.js';
import { GlobalData } from '../../App.js';
import { TbPokeball } from "react-icons/tb";


export default function MainScreen() {

  const { username, setUsername, pokemon, setPokemon } = useContext(GlobalData);
  const [display, setDisplay] = useState("notReady")


  function initialiseUser(username) {
    axios.post(`http://127.0.0.1:5000/InitialiseUser/${username}`)
  }

  function updateAndInitialiseUser(new_username) {
    setUsername(new_username)
    setPokemon("")
    initialiseUser(new_username)
  }

  // initialiseUser()

  function fetchPokemon() {
    var pokemons = axios.get(`http://127.0.0.1:5000/ListPokemon/${username}`);
    if (pokemons) {
      pokemon = pokemons[0];
    }
  }

  useEffect(() => {
    if (pokemon != "") {
      setDisplay("ready")
    }
    else {
      setDisplay("notReady")
    }

  })

  // fetchPokemon()

  function createBattle(pokemon) {

    if (pokemon) {
      socket.emit('createBattle', { username: username, pokemon_id: pokemon.id })
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

  function displayReady() {
    return (<div><TbPokeball /> {pokemon.name} is ready to go! </div>)
  }

  function displayNotReady() {
    return (<div>No Pokemon has been selected. </div>)
  }

  function Display(props) {
    if (props.display == "ready") {
      return displayReady()
    }
    else {
      return displayNotReady()
    }
  }




  return (
    <>
      <Card sx={sx} maxWidth="60%">
        <CardContent >
          <div style={{ textAlign: 'center' }}>Hello Pokemon Trainer {username}, what would you like to do?</div>

          <div style={{ textAlign: 'center' }}>{LoginInputBox(updateAndInitialiseUser, sx)}</div>
          <br />
          <div style={{ textAlign: 'center' }}><Display display={display} /></div>
          <Button sx={sx} fullWidth='true' onClick={() => createBattle(pokemon)} variant='contained' startIcon={<GiBattleGear size="1rem" />} endIcon={<GiBattleGear size="1rem" />} color='error'>Create Battle</Button>
          <br /><br />
          <div style={{ textAlign: 'center' }}>{JoinRoomInputBox(pokemon, sx)}</div>
          <br /><br />
          <Button sx={sx} fullWidth='true' variant='contained' size='large' startIcon={< GiHouse size="1rem" />} endIcon={< GiHouse size="1rem" />}><Link style={{ textDecoration: 'none' }} to={`../PokemonListScreen/${username}`} >View Pokemon</Link></Button>
          <br /><br />
          <Button sx={sx} fullWidth='true' variant='contained' size='large' startIcon={<MdCatchingPokemon size="1rem" />} endIcon={<MdCatchingPokemon size="1rem" />}><Link style={{ textDecoration: 'none' }} to={`../PokemonCaptureScreen/${username}`}>Capture Pokemon!</Link></Button>

        </CardContent>
      </Card >
    </>
  );
}

