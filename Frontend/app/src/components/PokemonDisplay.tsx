import React from 'react';
import { Card, Paper } from '@mui/material';

export default function PokemonDisplay(pokemon, hp) {
    return (
        <>
            <Card>{"Health: " + hp + "/" + pokemon.stats.hp}</Card>
            <br />
            <br />
            <br />
            <img src={process.env.PUBLIC_URL + '/' + pokemon.image_id} width="100"></img>
        </>
    );
}