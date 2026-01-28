import PokemonCard from "./PokemonCard";
import { Pokemon } from "../../sharedTypes";
import { Title } from "../layout/Title";
import { ScrollableMain } from "../layout/ScrollableMain";
import { useState } from "react";

export default function GlobalPokedex({ pokemons }: { pokemons: Pokemon[] }) {
  const [temporaryFrontendDeletedPokemonIds, setter] = useState<string[]>([]);

  function onDelete(id: string) {
    setter([...temporaryFrontendDeletedPokemonIds, id]);
  }

  function GetPokemonList() {
    return pokemons
      .filter(
        (pokemon) => !temporaryFrontendDeletedPokemonIds.includes(pokemon.id)
      )
      .map((pokemon: Pokemon, index) => (
        <PokemonCard
          pokemon={pokemon}
          key={index}
          canDelete={true}
          onDelete={onDelete}
          canSelect={false}
          canAddToUser={true}
        />
      ));
  }

  return (
    <>
      <Title>Global Pokedex</Title>
      <ScrollableMain> {GetPokemonList()}</ScrollableMain>
    </>
  );
}
