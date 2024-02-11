import PokemonCard from './PokemonCard.js';
import React, { useState } from 'react';
import { Button } from '@mui/material';

export default function PokemonList(pokemons) {

    const [startIndex, setStartIndex] = useState(0)

    function incrementIndex() {
        setStartIndex(startIndex + 1)
    }

    function decrementIndex() {
        setStartIndex(startIndex - 1)
    }

    return (
        <>
            <Button onClick={() => decrementIndex()}> View Above </Button>
            <Button onClick={() => incrementIndex()}> View Below </Button>
            {pokemons.slice(startIndex).map(pokemon => PokemonCard(pokemon))}
        </>
    );

}