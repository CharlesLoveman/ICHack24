import React from 'react';
import PokemonDisplay from './PokemonDisplay';

export default function PokemonBattleDisplay(self_pokemon, target_pokemon) {
    return (
        <>
            <div>The whole battle!</div>
            <div>{PokemonDisplay(self_pokemon)}</div>
            <br></br>
            <div>{PokemonDisplay(target_pokemon)}</div>

        </>
    );
}