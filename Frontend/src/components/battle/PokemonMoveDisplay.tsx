import styled from "styled-components";
import { Attack } from "../../sharedTypes";
import { Title } from "../layout/Title";
import { PokemonMoveCard } from "../pokedex/PokemonMoveCard";
import { Button } from "@mui/material";
import { ImCross } from "react-icons/im";
import { RightAlignedContainer } from "../layout/RightAlignedContainer";

const MoveTitle = styled(Title)`
  background-color: aliceblue;
`;

const CrossContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: right;
`;

const CrossButton = ({ onClose }: { onClose: () => void }) => (
  <CrossContainer>
    <RightAlignedContainer>
      <Button
        style={{
          color: "black",
          marginTop: "1rem",
          marginRight: "1rem",
        }}
        variant="text"
        onClick={onClose}
      >
        <ImCross size="2rem" />
      </Button>
    </RightAlignedContainer>
  </CrossContainer>
);

export function PokemonMoveDisplay({
  attack,
  onClose,
}: {
  attack: Attack;
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
