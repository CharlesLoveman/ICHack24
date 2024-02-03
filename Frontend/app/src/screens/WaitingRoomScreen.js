import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function WaitingRoomScreen() {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography>
          Waiting Foreveeeer
        </Typography>
      </CardContent>
    </Card>
  );
}
