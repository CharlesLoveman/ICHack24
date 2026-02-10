import styled from "styled-components";
import { IAttack } from "../../sharedTypes";
import { Title } from "../layout/Title";
import { PokemonMoveCard } from "../pokedex/PokemonMoveCard";
import { CrossButton } from "../button/CrossButton";

const MoveTitle = styled(Title)`
  background-color: aliceblue;
`;

export function PokemonMoveDisplay({
  attack,
  onClose,
}: {
  attack: IAttack;
  onClose: () => void;
}) {
  return (
    <>
      <MoveTitle color="#208c8e">Move</MoveTitle>
      <CrossButton onClose={onClose}></CrossButton>
      <PokemonMoveCard attack={attack}></PokemonMoveCard>
    </>
  );
}
