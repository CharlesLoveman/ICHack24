import PokemonList from '../PokemonList.js';
import React from 'react';
import TempAcquireBar from '../TempAcquireBar.js';
import NavBar from '../NavBar.js';

export default function PokemonListScreen() {

    // TODO: Add a bar which exists _only if_ there are new pokemon

    return (
        <>
            {NavBar()}
            {TempAcquireBar()}

            {PokemonList([])}</>
    );

}