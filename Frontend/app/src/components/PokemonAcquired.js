import React from 'react';
import PokemonDisplay from './PokemonDisplay';

// Count down the stack of new pokemans etc. (well, do receive it from the backend, and process it)

export default function PokemonAcquired(data) {
    return (
        <>Wow, you did it! OOOOOOOOOOOOOOOOOOOOOOOH
            {PokemonDisplay(data.pokemon)}
        </>
    );

} 