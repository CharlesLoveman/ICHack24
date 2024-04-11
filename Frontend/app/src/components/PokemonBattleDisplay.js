import React from 'react';
import PokemonDisplay from './PokemonDisplay';
import { TbTypography } from 'react-icons/tb';
import { Card, Paper } from '@mui/material';

export default function PokemonBattleDisplay(self_pokemon, target_pokemon, hp1, hp2) {
    var p1x = "300px";
    var p1y = "300px";
    var p2x = "650px";
    var p2y = "200px";

    p1x = "1em";
    p1y = "10em"

    p2x = "1em";
    p2y = "5em";

    var barsx1 = {
        "position": "absolute",
        "top": p1y,
        "left": p1x,
    };

    var barsx2 = {
        "position": "absolute",
        "top": p2y,
        "right": p2x,
    };

    var sxback = {
        "margin-left": "-12em",
        "boxShadow": "none",
    }

    var sxbackouter = {
        "boxShadow": "none",
    }

    var sx1 = {
        "position": "absolute",
        "top": "15em",
        "left": "2em",
        "boxShadow": "none",
        "background": "none"
    };

    var sx2 = {
        "position": "absolute",
        "top": "11em",
        "right": "2em",
        "boxShadow": "none",
        "background": "none"
    };

    // Need to figure out which hp is which
    return (
        <>
            <div>The whole battle!</div>
            <Card sx={sxbackouter}><Card sx={sxback}><img src={process.env.PUBLIC_URL + '/' + "background_temp_leeched.webp"} height="400em"></img></Card></Card>
            <Paper ><div  >{PokemonDisplay(self_pokemon, hp1, sx1, barsx1)}</div></Paper>
            <Paper ><div  >{PokemonDisplay(target_pokemon, hp2, sx2, barsx2)}</div></Paper>



        </>
    );
}