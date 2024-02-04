import React, { useState } from 'react';
import { socket } from '../socket';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import { GiBattleAxe } from "react-icons/gi";

export default function JoinRoomInputBox(pokemon) {

    const [code, setCode] = useState();

    function joinBattle(pokemon, code) {
        if (pokemon) {
            var game_id = code;

            socket.emit('joinBattle', { player_id: document.cookie["player_id"], pokemon_id: pokemon.id, game_id: game_id })
        }

    }

    return (<>
        <Button startIcon={<GiBattleAxe />} variant='contained' size='large' type="submit" onClick={() => joinBattle(pokemon, code)}>Join Battle</Button><br />
        <Input onChange={e => setCode(e.target.value)} />
    </>


    );
}