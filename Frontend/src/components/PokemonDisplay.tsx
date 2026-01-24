import { Card } from "@mui/material";
import { Pokemon } from "../sharedTypes";
import { assetsFolder } from "../env";

export default function PokemonDisplay(pokemon: Pokemon, hp: number) {
  return (
    <>
      <Card>{"Health: " + hp + "/" + pokemon.stats.hp}</Card>
      <br />
      <br />
      <br />
      <img src={assetsFolder + "/" + pokemon.image_id} width="100"></img>
    </>
  );
}
