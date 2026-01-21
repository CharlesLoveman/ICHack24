import PokemonDisplay from "./PokemonDisplay";
import { Pokemon } from "../types";

// Count down the stack of new pokemans etc. (well, do receive it from the backend, and process it)

interface PokemonAcquiredProps {
  pokemon: Pokemon;
}

export default function PokemonAcquired({ pokemon }: PokemonAcquiredProps) {
  return (
    <>
      Wow, you did it! OOOOOOOOOOOOOOOOOOOOOOOH
      {PokemonDisplay(pokemon, 100)}
    </>
  );
}
