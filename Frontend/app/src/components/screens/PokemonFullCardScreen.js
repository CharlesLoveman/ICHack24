import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { GlobalData } from '../../App.js';
import { useContext } from 'react';
import { TbPokeball } from "react-icons/tb";
import { Button } from '@mui/material';
import { useLoaderData } from 'react-router-dom';


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

function MovesDisplay(attacks) {
    return attacks.map(move => MoveDisplay(move))
}

function MoveDisplay(attack) {
    return (<>
        <div>Name: {attack.name} </div><div>Type: {attack.element}</div><br /></>)
}



export default function PokemonFullCardScreen(id) {

    const data = useContext(GlobalData);
    const setPokemon = data.setPokemon
    const loaderData = useLoaderData(); // Depreciate this
    const pokemons = loaderData;
    const pokemon = pokemons[0]

    console.log(pokemons)
    console.log(id)
    console.log(pokemon)



    return (
        <Card sx={{
            minWidth: 275, backgroundColor: "white"
        }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    Name: {pokemon.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Type: {pokemon.element}
                </Typography>
                <Typography variant="h6" component="div">
                    Description
                </Typography>
                <Typography variant="body2">
                    {pokemon.description}
                </Typography>
                <br />
                <Typography variant="h6" component="div">
                    Stats
                </Typography>
                <Typography variant="body2">
                    {StatDisplay(pokemon.stats)}
                </Typography>
                <br />
                <Typography variant="h6" component="div">
                    Moves
                </Typography>
                <Typography variant="body2">
                    {MovesDisplay(pokemon.attacks)}
                </Typography>
                <Button onClick={() => setPokemon(pokemon)}> <TbPokeball /> Select </Button>
            </CardContent>

        </Card >
    );
}
