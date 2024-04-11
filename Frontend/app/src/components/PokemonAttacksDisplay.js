import React from 'react';
import Attack from './Attack.js'
import { Stack } from '@mui/material';

export default function PokemonAttacksDisplay(pokemon, onAttack) {
    return (
        <>
            <Stack direction="row" spacing="100px">{pokemon.attacks.map(attack => Attack(attack, onAttack))}</Stack>

        </>
    );
}