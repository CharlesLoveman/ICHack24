import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function WaitingRoomScreen() {
  const params = useParams();

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography>
          QR Code Here
          <FaMagnifyingGlass />
        </Typography>
        <Typography variant="h1" component="div">{params.game_id}</Typography>

      </CardContent>
    </Card>
  );
}
