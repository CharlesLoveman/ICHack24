import React from 'react';
import { Card, Paper } from '@mui/material';

export default function PokemonDisplay(pokemon, hp, imgsx, barsx) {
    return (
        <>
            <Card sx={barsx}>{"Health: " + hp + "/" + pokemon.stats.hp}</Card>
            <Card sx={imgsx}><img src={process.env.PUBLIC_URL + '/' + pokemon.image_id} width="100"></img></Card>
        </>
    );
}