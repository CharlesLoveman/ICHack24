import { Card, CardHeader } from "@mui/material";
import { Pokemon } from "../../sharedTypes";
import { assetsFolder } from "../../env";
import styled from "styled-components";
import { darkGrey } from "../../utils/colors";
import { PokemonTypeContainer } from "./PokemonCard";

export default function PokemonDisplay(
  pokemon: Pokemon,
  hp: number,
  onLeft: boolean
) {
  const Bar = styled.div`
    background-color: ${darkGrey};
    height: 0.5rem;
    padding: 0.3rem;
    width: 20rem;
    z-index: 100;
    position: relative;
  `;

  interface HealthProps {
    hp: number;
    maxHp: number;
  }

  const Health = styled.div<HealthProps>`
    background-color: #59b859;
    height: 0.5rem;
    width: ${(props) => (props.hp / props.maxHp) * 20}rem;
    z-index: 100;
    position: relative;
  `;

  const RightPokemonTypeContainer = styled(PokemonTypeContainer)`
    text-align: right;
    align-items: flex-end;
    position: relative;
    float: right;
    margin-top: 0.5rem;
    margin-right: 0.5rem;
  `;

  const ImageContainer = styled.div<{ onLeft: boolean }>`
    position: relative;
    float: ${(props) => (props.onLeft ? "left" : "right")};
  `;

  const pokemonInfo = (
    <Card style={{ backgroundColor: "#ffffff" }}>
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
      {hp + "/" + pokemon.stats.hp}
      <Bar>
        <Health maxHp={pokemon.stats.hp} hp={hp}></Health>
      </Bar>
    </Card>
  );

  const pokemonImage = (
    <ImageContainer onLeft={onLeft}>
      <img src={assetsFolder + "/" + pokemon.image_id} width="100"></img>
    </ImageContainer>
  );

  return (
    <>
      {onLeft ? pokemonImage : pokemonInfo}
      <br />
      <br />
      <br />
      {onLeft ? (
        <>
          <br />
          <br />
          <br />
          <br />
          <br />
        </>
      ) : (
        <></>
      )}
      {onLeft ? pokemonInfo : pokemonImage}
    </>
  );
}
