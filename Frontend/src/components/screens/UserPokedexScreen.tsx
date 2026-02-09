import { useLoaderData } from "react-router-dom";
import UserPokedex from "../pokedex/UserPokedex";
import { IPokemon } from "../../sharedTypes";

export default function UserPokedexScreen() {
  const loaderData = useLoaderData() as IPokemon[];

  return <>{<UserPokedex pokemons={loaderData}></UserPokedex>}</>;
}
