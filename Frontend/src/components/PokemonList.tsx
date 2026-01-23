import PokemonCard from "./PokemonCard";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Pokemon } from "../sharedTypes";
import { useGlobalData } from "../hooks/useGlobalData";

export default function PokemonList({ pokemons }: { pokemons: Pokemon[] }) {
  const { noNewPokemon, setNoNewPokemon } = useGlobalData();
  const [newPokemonMarkers, setter] = useState<boolean[]>(
    new Array(Object.keys(pokemons).length)
  );

  useEffect(() => {
    setter(constructPokemonMarkers(noNewPokemon, newPokemonMarkers));
    console.log(noNewPokemon);
    console.log(newPokemonMarkers);
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

  const [startIndex, setStartIndex] = useState(0);

  function incrementIndex() {
    setStartIndex(startIndex + 1);
  }

  function decrementIndex() {
    setStartIndex(startIndex - 1);
  }

  function GetPokemonList() {
    const sliced_pokemons = pokemons.toReversed().slice(startIndex);
    const sliced_markers = newPokemonMarkers.slice(startIndex);
    const zipped = sliced_pokemons.map(
      (pokemon: Pokemon, i: number) =>
        [pokemon, sliced_markers[i]] as [Pokemon, boolean]
    );
    return zipped.map(([pokemon, isNew]: [Pokemon, boolean], index) => (
      <PokemonCard pokemon={pokemon} isNew={isNew} key={index} />
    ));
  }

  return (
    <>
      <Button variant="contained" onClick={() => decrementIndex()}>
        {" "}
        View Above{" "}
      </Button>
      <Button variant="contained" onClick={() => incrementIndex()}>
        {" "}
        View Below{" "}
      </Button>

      {GetPokemonList()}
    </>
  );
}
