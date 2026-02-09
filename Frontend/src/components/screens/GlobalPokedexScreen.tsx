import { useLoaderData } from "react-router-dom";
import { IPokemon } from "../../sharedTypes";
import GlobalPokedex from "../pokedex/GlobalPokedex";

export default function GlobalPokedexScreen() {
  const loaderData = useLoaderData() as IPokemon[];

  return <>{<GlobalPokedex pokemons={loaderData}></GlobalPokedex>}</>;
}
