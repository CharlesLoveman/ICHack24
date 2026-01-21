import Attack from "./Attack";
import { Stack } from "@mui/material";
import { Pokemon, Attack as IAttack } from "../types";

export default function PokemonAttacksDisplay(
  pokemon: Pokemon,
  onAttack: (attack: IAttack) => void
) {
  return (
    <>
      <Stack direction="row" spacing="100px">
        {pokemon.attacks.map((attack: IAttack) => Attack(attack, onAttack))}
      </Stack>
    </>
  );
}
