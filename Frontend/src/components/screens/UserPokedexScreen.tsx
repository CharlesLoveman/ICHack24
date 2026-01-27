import { useLoaderData } from "react-router-dom";
import UserPokedex from "../pokedex/UserPokedex";
import { Pokemon } from "../../sharedTypes";

export default function UserPokedexScreen() {
  const loaderData = useLoaderData() as Pokemon[];

  return <>{<UserPokedex pokemons={loaderData}></UserPokedex>}</>;
}
