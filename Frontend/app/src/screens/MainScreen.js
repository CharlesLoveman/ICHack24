import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { socket } from '../socket';

export default function MainScreen() {

  function createBattle() {
    socket.emit('createBattle', {id: 'TEST_ID_REPLACE'})
  }

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Button onClick={createBattle}>Create Battle</Button>
        <Button>View Pokemon</Button>
      </CardContent>
    </Card>
  );
}
