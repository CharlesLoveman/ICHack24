import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardHeader } from "@mui/material";
import { Attack } from "../sharedTypes";
import {
  PokemonNameContainer,
  PokemonTypeContainer,
} from "./pokedex/PokemonCard";
import { DetailsCard } from "./DetailsCard";
import { OptionalPokemonStats, StatDisplay } from "./StatsDisplay";

function statsAreEmpty(stats: OptionalPokemonStats | undefined) {
  return (
    stats === undefined ||
    !(
      stats.attack ||
      stats.defence ||
      stats.hp ||
      stats.special_attack ||
      stats.special_defence ||
      stats.speed
    )
  );
}

function MoveStatDisplay(stats: OptionalPokemonStats | undefined) {
  return (
    <>
      {StatDisplay(stats)}
      {statsAreEmpty(stats) ? <Typography>Nothing</Typography> : <></>}
    </>
  );
}

export function PokemonMoveCard({ attack }: { attack: Attack }) {
  return (
    <DetailsCard>
      <CardHeader
        title={<PokemonNameContainer>{attack.name}</PokemonNameContainer>}
        subheader={
          <PokemonTypeContainer style={{ backgroundColor: "#9c9c9c" }}>
            {attack.element}
          </PokemonTypeContainer>
        }
      ></CardHeader>
      <CardContent>
        <Typography>{attack.description}</Typography>
        <Typography>Power: {attack.power}</Typography>
        {attack.special ? (
          <Typography>Special: {attack.special}</Typography>
        ) : (
          <></>
        )}
        <CardHeader title="Effect on self"></CardHeader>
        <CardContent>
          <Typography>{MoveStatDisplay(attack.self_status_id)}</Typography>
        </CardContent>
        <CardHeader title="Effect on enemy"></CardHeader>
        <CardContent>
          <Typography>{MoveStatDisplay(attack.target_status_id)}</Typography>
        </CardContent>
      </CardContent>
    </DetailsCard>
  );
}
