import React from 'react';
import PokemonBattleDisplay from '../PokemonBattleDisplay';
import PokemonAttacksDisplay from '../PokemonAttacksDisplay';

export default function PokemonBattleScreen(data) {

    return (
        <>{PokemonBattleDisplay(data.self_pokemon, data.target_pokemon)}
            {PokemonAttacksDisplay(data.self_pokemon)}
        </>
    );

} 