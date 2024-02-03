import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function PokemonCard(pokemon) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Who's that pokemon?
        </Typography>
        <Typography variant="h5" component="div">
            Name: {pokemon.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Type: {pokemon.element}
        </Typography>
        <Typography variant="body2">
            Description: {pokemon.description} 
        </Typography>
        <Typography variant="body2">
            Stats: Infinity
        </Typography>
      </CardContent>
    </Card>
  );
}
