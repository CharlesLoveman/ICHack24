import React from 'react';
import { socket } from '../socket';
import Button from '@mui/material/Button';

export default function Attack(attack) {

    function onAttack() {

        socket.emit("attack", attack.id)
    }


    return (
        <>
            <div>{attack.name}</div>
            <div>{attack.element}</div>
            <div>{attack.power}</div>
            <div>{attack.special}</div>
            <div>Display stauses</div>
            <Button onClick={() => onAttack()}>Attack!</Button>
        </>
    );
}