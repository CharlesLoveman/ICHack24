import PokemonList from '../PokemonList.js';
import React from 'react';
import TempAcquireBar from '../TempAcquireBar.js';
import NavBar from '../NavBar.js';
import { useLoaderData } from 'react-router-dom';

export default function PokemonListScreen() {


    const data = useLoaderData()
    console.log(data)

    return (
        <>
            {NavBar()}
            {TempAcquireBar()}

            //{PokemonList(data)}</>
    );

}