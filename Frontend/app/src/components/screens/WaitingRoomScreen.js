import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function WaitingRoomScreen(game_id) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography>
          Put a QR Code here \\
          Put some numbers/ a 6-digit code here \\
          <FaMagnifyingGlass />
          <h1>{game_id}</h1>
          Waiting Foreveeeer
        </Typography>
      </CardContent>
    </Card>
  );
}
