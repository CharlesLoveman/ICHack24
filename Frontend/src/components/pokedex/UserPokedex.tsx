import PokemonCard from "./PokemonCard";
import { useState, useEffect } from "react";
import { Pokemon } from "../../sharedTypes";
import { useGlobalData } from "../../hooks/useGlobalData";
import { Title } from "../layout/Title";
import { ScrollableMain } from "../layout/ScrollableMain";

export default function UserPokedex({ pokemons }: { pokemons: Pokemon[] }) {
  const { noNewPokemon, setNoNewPokemon } = useGlobalData();
  const [newPokemonMarkers, setter] = useState<boolean[]>(
    new Array(Object.keys(pokemons).length)
  );

  useEffect(() => {
    setter(constructPokemonMarkers(noNewPokemon, newPokemonMarkers));
  }, []);

  function constructPokemonMarkers(
    noNewPokemon: number,
    newPokemonMarkers: boolean[]
  ) {
    newPokemonMarkers = newPokemonMarkers.fill(false);
    for (let i = 0; i < noNewPokemon; i++) {
      newPokemonMarkers[i] = true;
    }
    return newPokemonMarkers;
  }

  setNoNewPokemon(0);

  function GetPokemonList() {
    const zipped = pokemons
      .toReversed()
      .map(
        (pokemon: Pokemon, i: number) =>
          [pokemon, newPokemonMarkers[i]] as [Pokemon, boolean]
      );
    return zipped.map(([pokemon, isNew]: [Pokemon, boolean], index) => (
      <PokemonCard pokemon={pokemon} isNew={isNew} key={index} />
    ));
  }

  return (
    <>
      <Title>Pokedex</Title>
      <ScrollableMain> {GetPokemonList()}</ScrollableMain>
    </>
  );
}
