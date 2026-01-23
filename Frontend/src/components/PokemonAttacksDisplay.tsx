import Attack from "./Attack";
import { Stack } from "@mui/material";
import { Pokemon, Attack as IAttack } from "../sharedTypes";

interface PokemonAttacksDisplayProps {
  pokemon: Pokemon;
  onAttack: (attack: IAttack) => void;
}

export default function PokemonAttacksDisplay({
  pokemon,
  onAttack,
}: PokemonAttacksDisplayProps) {
  return (
    <>
      <Stack direction="row" spacing="100px">
        {pokemon.attacks.map((attack: IAttack, index: number) => (
          <Attack attack={attack} key={index} onAttack={onAttack} />
        ))}
      </Stack>
    </>
  );
}
