import Attack from "./Attack";
import { Stack } from "@mui/material";
import { Pokemon, Attack as IAttack } from "../sharedTypes";

interface PokemonAttacksDisplayProps {
  pokemon: Pokemon;
  onAttack: (attack: IAttack) => void;
  chosenAttack: IAttack | undefined;
}

export default function PokemonAttacksDisplay({
  pokemon,
  onAttack,
  chosenAttack,
}: PokemonAttacksDisplayProps) {
  return (
    <>
      <Stack direction="row" spacing="1rem" margin={2}>
        {pokemon.attacks.map((attack: IAttack, index: number) => (
          <Attack
            attack={attack}
            key={index}
            isChosen={attack === chosenAttack}
            onAttack={onAttack}
            disabled={chosenAttack !== undefined}
          />
        ))}
      </Stack>
    </>
  );
}
