import { Card } from "@mui/material";
import { Pokemon } from "../sharedTypes";
import { publicFolder } from "../env";

export default function PokemonDisplay(pokemon: Pokemon, hp: number) {
  return (
    <>
      <Card>{"Health: " + hp + "/" + pokemon.stats.hp}</Card>
      <br />
      <br />
      <br />
      <img src={publicFolder + "/" + pokemon.image_id} width="100"></img>
    </>
  );
}
