import { Typography } from "@mui/material";

export interface OptionalPokemonStats {
  hp?: number;
  attack?: number;
  defence?: number;
  special_attack?: number;
  special_defence?: number;
  speed?: number;
}

export function StatDisplay(stats: OptionalPokemonStats | undefined) {
  if (stats) {
    return (
      <>
        {stats.hp ? <Typography>HP: {stats.hp}</Typography> : <></>}
        {stats.attack ? <Typography>Attack: {stats.attack}</Typography> : <></>}
        {stats.special_attack ? (
          <Typography>Sp. Attack: {stats.special_attack}</Typography>
        ) : (
          <></>
        )}
        {stats.defence ? (
          <Typography>Defence: {stats.defence}</Typography>
        ) : (
          <></>
        )}
        {stats.special_defence ? (
          <Typography>Sp. Defence: {stats.special_defence}</Typography>
        ) : (
          <></>
        )}
        {stats.speed ? <Typography>Speed: {stats.speed}</Typography> : <></>}
      </>
    );
  } else {
    return <></>;
  }
}
