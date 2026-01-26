import PokemonDisplay from "../pokedex/PokemonDisplay";
import { Pokemon } from "../../sharedTypes";
import styled from "styled-components";

interface PokemonBattleDisplayProps {
  self_pokemon: Pokemon;
  target_pokemon: Pokemon;
  self_hp: number;
  target_hp: number;
}

const SelfPokemonContainer = styled.div`
  position: fixed;
  float: left;
  bottom: 33%;
  left: 5%;
`;

const TargetPokemoneContainer = styled.div`
  position: fixed;
  float: right;
  top: 20%;
  right: 5%;
`;

export default function PokemonBattleDisplay({
  self_pokemon,
  target_pokemon,
  self_hp: hp1,
  target_hp: hp2,
}: PokemonBattleDisplayProps) {
  return (
    <>
      <SelfPokemonContainer>
        <div>{PokemonDisplay(self_pokemon, hp1, true)}</div>
      </SelfPokemonContainer>
      <TargetPokemoneContainer>
        <div>{PokemonDisplay(target_pokemon, hp2, false)}</div>
      </TargetPokemoneContainer>
    </>
  );
}
