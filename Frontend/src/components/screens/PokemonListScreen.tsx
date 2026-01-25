import { useLoaderData } from "react-router-dom";
import PokemonList from "../pokedex/PokemonList";
import { Pokemon } from "../../sharedTypes";

export default function PokemonListScreen() {
  const loaderData = useLoaderData() as Pokemon[];
  console.log(loaderData);

  return <>{<PokemonList pokemons={loaderData}></PokemonList>}</>;
}
