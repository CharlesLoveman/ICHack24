import React from 'react';
import Attack from './Attack.js'

export default function PokemonAttacksDisplay(pokemon) {
    return (
        <>
            {pokemon.attacks.map(attack => Attack(attack))}
        </>
    );
}