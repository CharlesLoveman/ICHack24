import React, { useState } from 'react';

export function JoinRoomInputBox(pokemon) {

    const [code, setCode] = setState();

    function joinBattle(pokemon, code) {
        game_id = code;

        socket.emit('joinBattle', { player_id: document.cookie["player_id"], pokemon_id: pokemon.id, game_id: game_id })
    }

    return (
        <form onSubmit={onSubmit}>
            <input onChange={e => setCode(e.target.value)} />
            <Button type="submit" onClick={() => joinBattle(pokemon, code)}>Create Battle</Button>
        </form>
    );
}