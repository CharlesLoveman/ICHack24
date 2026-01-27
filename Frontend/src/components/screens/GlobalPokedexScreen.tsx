import { useLoaderData } from "react-router-dom";
import { Pokemon } from "../../sharedTypes";
import GlobalPokedex from "../pokedex/GlobalPokedex";

export default function GlobalPokedexScreen() {
  const loaderData = useLoaderData() as Pokemon[];

  return <>{<GlobalPokedex pokemons={loaderData}></GlobalPokedex>}</>;
}
