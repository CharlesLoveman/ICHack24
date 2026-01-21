import { Card } from "@mui/material";
import { Pokemon } from "../types";

export default function PokemonDisplay(pokemon: Pokemon, hp: number) {
  return (
    <>
      <Card>{"Health: " + hp + "/" + pokemon.stats.hp}</Card>
      <br />
      <br />
      <br />
      <img
        src={process.env.PUBLIC_URL + "/" + pokemon.image_id}
        width="100"
      ></img>
    </>
  );
}
