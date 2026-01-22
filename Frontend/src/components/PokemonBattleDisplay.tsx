import PokemonDisplay from "./PokemonDisplay";
import { Paper } from "@mui/material";
import { Pokemon } from "../sharedTypes";
import { publicFolder } from "../env";

export default function PokemonBattleDisplay(
  self_pokemon: Pokemon,
  target_pokemon: Pokemon,
  hp1: number,
  hp2: number
) {
  const p1x = "300px";
  const p1y = "300px";
  const p2x = "650px";
  const p2y = "200px";

  const sx1 = {
    position: "absolute",
    top: p1y,
    left: p1x,
    boxShadow: "none",
    background: "none",
  };

  const sx2 = {
    position: "absolute",
    top: p2y,
    left: p2x,
    boxShadow: "none",
    background: "none",
  };

  // Need to figure out which hp is which

  return (
    <>
      <div>The whole battle!</div>
      <img
        src={publicFolder + "/" + "background_temp_leeched.webp"}
        height="50%"
      ></img>
      <Paper sx={sx1}>
        <div>{PokemonDisplay(self_pokemon, hp1)}</div>
      </Paper>
      <Paper sx={sx2}>
        <div>{PokemonDisplay(target_pokemon, hp2)}</div>
      </Paper>
    </>
  );
}
