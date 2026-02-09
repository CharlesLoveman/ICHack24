import PokemonDisplay from "./pokedex/PokemonDisplay";
import { IPokemon } from "../sharedTypes";

// Count down the stack of new pokemans etc. (well, do receive it from the backend, and process it)

interface PokemonAcquiredProps {
  pokemon: IPokemon;
}

export default function PokemonAcquired({ pokemon }: PokemonAcquiredProps) {
  return (
    <>
      Wow, you did it! OOOOOOOOOOOOOOOOOOOOOOOH
      {PokemonDisplay(pokemon, 100, true)}
    </>
  );
}
