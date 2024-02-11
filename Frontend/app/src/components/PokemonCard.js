import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { GlobalData } from '../App.js';
import { useContext } from 'react';
import { TbPokeball } from "react-icons/tb";
import { Button } from '@mui/material';

function StatDisplay(stats) {
  return (<>
    <div>HP: {stats.hp}</div>
    <div>Attack: {stats.attack}</div>
    <div>Sp. Attack: {stats.special_attack}</div>
    <div>Defence: {stats.defence}</div>
    <div>Sp. Defence: {stats.special_defence}</div>
    <div>Speed: {stats.speed}</div>
  </>

  )
}



export default function PokemonCard(pokemon) {

  const { username, setUsername, current_pokemon, setPokemon } = useContext(GlobalData);


  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Who's that pokemon?
        </Typography>
        <Typography variant="h5" component="div">
          Name: {pokemon.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Type: {pokemon.element}
        </Typography>
        <Typography variant="body2">
          Description: {pokemon.description}
        </Typography>
        <Typography variant="body2">
          {StatDisplay(pokemon.stats)}
        </Typography>
        <Button onClick={() => setPokemon(pokemon)}> <TbPokeball /> Select this Pokemon</Button>
      </CardContent>

    </Card>
  );
}
