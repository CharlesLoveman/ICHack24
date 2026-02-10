import { Card, CardHeader } from "@mui/material";
import { IPokemon } from "../../sharedTypes";
import { assetsFolder } from "../../env";
import styled from "styled-components";
import { PokemonTypeContainer } from "./PokemonCard";
import { FilledBar } from "../layout/FilledBar";

const RightPokemonTypeContainer = styled(PokemonTypeContainer)`
  text-align: right;
  align-items: flex-end;
  position: relative;
  float: right;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
`;

interface OnLeftProps {
  $onLeft: boolean;
}

const ImageContainer = styled.div<OnLeftProps>`
  position: relative;
  float: ${(props) => (props.$onLeft ? "left" : "right")};
`;

const PokemonDisplayContainer = styled.div<OnLeftProps>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$onLeft ? "flex-start" : "flex-end")};
`;

export default function PokemonDisplay(
  pokemon: IPokemon,
  hp: number,
  onLeft: boolean,
) {
  const translateStyles = onLeft ? { translate: "-10%" } : { translate: "10%" };

  const maxHp = pokemon.stats.max_hp ?? pokemon.stats.hp;

  const pokemonInfo = (
    <Card
      style={{
        backgroundColor: "#ffffff",
        scale: "80%",
        margin: 0,
        ...translateStyles,
      }}
    >
      <CardHeader
        title={
          <>
            {pokemon.name}
            <RightPokemonTypeContainer>
              {pokemon.element}
            </RightPokemonTypeContainer>
          </>
        }
        style={{ padding: 0, margin: 0 }}
      ></CardHeader>
      {hp + "/" + maxHp}
      <FilledBar hp={hp} maxHp={maxHp}></FilledBar>
    </Card>
  );

  const pokemonImage = (
    <ImageContainer $onLeft={onLeft}>
      <img src={assetsFolder + "/" + pokemon.image_id} width="100"></img>
    </ImageContainer>
  );

  return (
    <PokemonDisplayContainer $onLeft={onLeft}>
      {onLeft ? pokemonImage : pokemonInfo}
      <br />
      {onLeft ? pokemonInfo : pokemonImage}
    </PokemonDisplayContainer>
  );
}
