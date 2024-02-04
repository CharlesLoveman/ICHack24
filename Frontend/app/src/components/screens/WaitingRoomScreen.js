import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function WaitingRoomScreen() {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography>
          Put a QR Code here \\
          Put some numbers/ a 6-digit code here \\
          Waiting Foreveeeer
        </Typography>
      </CardContent>
    </Card>
  );
}
