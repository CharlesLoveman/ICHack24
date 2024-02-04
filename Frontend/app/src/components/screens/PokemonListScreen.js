import PokemonList from '../PokemonList.js';
import React from 'react';
import TempAcquireBar from '../TempAcquireBar.js';

export default function PokemonListScreen({ data, setState, sendMessage }) {

    // TODO: Add a bar which exists _only if_ there are new pokemon

    return (
        <>
            {TempAcquireBar()}

            {PokemonList(data.pokemons)}</>
    );

}