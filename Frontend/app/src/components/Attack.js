import React from 'react';
import { socket } from '../socket';
import Button from '@mui/material/Button';
import { Paper, Grid } from '@mui/material';

export default function Attack(attack, onAttack) {




    return (
        <Grid item xs={6}>
            <Paper>
                <div>{attack.name}</div>
                <div>{attack.element}</div>
                <div>{attack.special ? "Special" : "Physical"}</div>
                <div>{"Power: " + attack.power}</div>
                <div> {Object.keys(attack.self_status_id).map((key, value) => { <div>{key} : {value}</div> })}</div>
                <Button onClick={() => onAttack(attack)}>Attack!</Button>
            </Paper>
        </Grid >
    );
}