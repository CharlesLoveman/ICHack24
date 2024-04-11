import React from 'react';
import Attack from './Attack.js'
import { Stack, Grid } from '@mui/material';

export default function PokemonAttacksDisplay(pokemon, onAttack) {
    return (
        <>

            <Grid container direction="row" spacing={2}>{pokemon.attacks.map(attack => Attack(attack, onAttack))}</Grid>
        </>
    );

    return (<Stack direction="row" spacing="100px">{pokemon.attacks.map(attack => Attack(attack, onAttack))}</Stack>)
}