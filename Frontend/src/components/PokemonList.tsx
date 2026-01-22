import PokemonCard from "./PokemonCard";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useContext } from "react";
import { GlobalData } from "../App";
import { Pokemon } from "../sharedTypes";
import { GlobalContextType } from "../types";

export default function PokemonList(pokemons: Pokemon[]) {
  const data = useContext(GlobalData) as GlobalContextType;
  const [newPokemonMarkers, setter] = useState<boolean[]>(
    new Array(Object.keys(pokemons).length)
  );

  useEffect(() => {
    const noNewPokemon = data.noNewPokemon.valueOf();
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

  data.setNoNewPokemon(0);

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
    return zipped.map((pokemon_pair: [Pokemon, boolean]) =>
      PokemonCard(...pokemon_pair)
    );
  }

  return (
    <>
      <Button onClick={() => decrementIndex()}> View Above </Button>
      <Button onClick={() => incrementIndex()}> View Below </Button>

      {GetPokemonList()}
    </>
  );
}
