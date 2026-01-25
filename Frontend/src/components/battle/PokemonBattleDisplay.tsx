import PokemonDisplay from "../pokedex/PokemonDisplay";
import { Paper } from "@mui/material";
import { Pokemon } from "../../sharedTypes";
import { assetsFolder } from "../../env";
import styled from "styled-components";

interface PokemonBattleDisplayProps {
  self_pokemon: Pokemon;
  target_pokemon: Pokemon;
  self_hp: number;
  target_hp: number;
}

export default function PokemonBattleDisplay({
  self_pokemon,
  target_pokemon,
  self_hp: hp1,
  target_hp: hp2,
}: PokemonBattleDisplayProps) {
  const p1x = "5%";
  const p1y = "50%";
  const p2x = "5%";
  const p2y = "20%";

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

  const ImageContainer = styled.div`
    margin: auto;
    background-color: #356235;
    height: 100%;
    align-items: center;
    align-content: center;
  `;

  return (
    <>
      <ImageContainer>
        <img
          src={assetsFolder + "/" + "background_temp_leeched.webp"}
          height="100%"
          width="100%"
        ></img>
      </ImageContainer>

      <Paper sx={sx1}>
        <div>{PokemonDisplay(self_pokemon, hp1, true)}</div>
      </Paper>
      <Paper sx={sx2}>
        <div>{PokemonDisplay(target_pokemon, hp2, false)}</div>
      </Paper>
    </>
  );
}
