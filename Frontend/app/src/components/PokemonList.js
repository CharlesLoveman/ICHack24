import PokemonCard from './PokemonCard.js';
import React from 'react';

export default function PokemonList(pokemons) {
    return (
        <>{pokemons.map(pokemon => PokemonCard(pokemon))}</>
    );

}