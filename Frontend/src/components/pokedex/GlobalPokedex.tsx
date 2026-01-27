import PokemonCard from "./PokemonCard";
import { Pokemon } from "../../sharedTypes";
import { Title } from "../layout/Title";
import { ScrollableMain } from "../layout/ScrollableMain";

export default function GlobalPokedex({ pokemons }: { pokemons: Pokemon[] }) {
  function GetPokemonList() {
    return pokemons.map((pokemon: Pokemon, index) => (
      <PokemonCard pokemon={pokemon} key={index} />
    ));
  }

  return (
    <>
      <Title>Global Pokedex</Title>
      <ScrollableMain> {GetPokemonList()}</ScrollableMain>
    </>
  );
}
