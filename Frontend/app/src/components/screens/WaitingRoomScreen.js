import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';

export default function WaitingRoomScreen() {
  params = useParams()

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography>
          {params.game_id}
        </Typography>
      </CardContent>
    </Card>
  );
}
