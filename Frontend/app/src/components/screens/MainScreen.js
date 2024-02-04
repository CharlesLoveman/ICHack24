import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import JoinRoomInputBox from '../JoinRoomInputBox.js'

import { socket } from '../../socket';

export default function MainScreen() {

  function createBattle(pokemon) {

    socket.emit('createBattle', { player_id: document.cookie["player_id"], pokemon_id: pokemon.id })
  }

  const [pokemon, setPokemon] = useState();

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Button onClick={() => createBattle(pokemon)}>Create Battle</Button>
        {JoinRoomInputBox(pokemon)}
        <Link to="PokemonListScreen/">View Pokemon</Link>
        <Link to="PokemonCaptureScreen/">Capture Pokemon!</Link>

      </CardContent>
    </Card>
  );
}
