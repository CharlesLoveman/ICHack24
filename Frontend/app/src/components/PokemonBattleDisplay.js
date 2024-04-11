import React from 'react';
import PokemonDisplay from './PokemonDisplay';
import { TbTypography } from 'react-icons/tb';
import { Card, Paper } from '@mui/material';

export default function PokemonBattleDisplay(self_pokemon, target_pokemon, hp1, hp2) {
    var p1x = "300px";
    var p1y = "300px";
    var p2x = "650px";
    var p2y = "200px";

    var sx1 = {
        "position": "absolute",
        "top": p1y,
        "left": p1x,
        "boxShadow": "none",
        "background": "none"
    };

    var sx2 = {
        "position": "absolute",
        "top": p2y,
        "left": p2x,
        "boxShadow": "none",
        "background": "none"
    };

    // Need to figure out which hp is which

    return (
        <>
            <div>The whole battle!</div>
            <img src={process.env.PUBLIC_URL + '/' + "background_temp_leeched.webp"} height="50%"></img>
            <Paper sx={sx1}><div  >{PokemonDisplay(self_pokemon, hp1)}</div></Paper>
            <Paper sx={sx2}><div  >{PokemonDisplay(target_pokemon, hp2)}</div></Paper>



        </>
    );
}