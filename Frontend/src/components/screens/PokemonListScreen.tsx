import { useLoaderData } from "react-router-dom";
import PokemonList from "../PokemonList";
import NavBar from "../NavBar";
import { Pokemon } from "../../sharedTypes";

export default function PokemonListScreen() {
  const loaderData = useLoaderData() as Pokemon[];
  console.log(loaderData);

  return (
    <>
      {NavBar()}
      {PokemonList(loaderData)}
    </>
  );
}
