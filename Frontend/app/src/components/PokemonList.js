import PokemonCard from './PokemonCard.js';
import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { useContext } from 'react';
import { GlobalData } from '../App.js';
import { componentDidMount } from 'react';

export default function PokemonList(pokemons) {

    const data = useContext(GlobalData)
    const [newPokemonMarkers, setter] = useState(new Array(Object.keys(pokemons).length))

    useEffect(() => {
        const noNewPokemon = data.noNewPokemon.valueOf();
        setter(constructPokemonMarkers(noNewPokemon, newPokemonMarkers))
        console.log(noNewPokemon)
        console.log(newPokemonMarkers)
        console.log("hi")
    }, [])


    function constructPokemonMarkers(noNewPokemon, newPokemonMarkers) {
        newPokemonMarkers = newPokemonMarkers.fill(false)
        for (let i = 0; i < noNewPokemon; i++) {
            newPokemonMarkers[i] = true;
        }
        return newPokemonMarkers
    }




    data.setNoNewPokemon(0);

    const [startIndex, setStartIndex] = useState(0)

    function incrementIndex() {
        setStartIndex(startIndex + 1)
    }

    function decrementIndex() {
        setStartIndex(startIndex - 1)
    }

    function GetPokemonList() {
        let sliced_pokemons = pokemons.toReversed().slice(startIndex) // Reverse modifies in place, and this does not work at all
        let sliced_markers = newPokemonMarkers.slice(startIndex)
        let zipped = sliced_pokemons.map((pokemon, i) => [pokemon, sliced_markers[i]])
        return zipped.map(pokemon_pair => PokemonCard(...pokemon_pair))
    }

    return (
        <>
            <Button onClick={() => decrementIndex()}> View Above </Button>
            <Button onClick={() => incrementIndex()}> View Below </Button>

            {GetPokemonList()}
        </>
    );

}