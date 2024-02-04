import React from 'react';

export default function Attack(attack) {
    return (
        <>
            <div>{attack.name}</div>
            <div>{attack.element}</div>
            <div>{attack.power}</div>
            <div>{attack.special}</div>
            <div>Display stauses</div>
        </>
    );
}