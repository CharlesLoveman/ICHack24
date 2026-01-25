import styled from "styled-components";
import { Attack } from "../sharedTypes";
import { Title } from "./layout/Title";
import { PokemonMoveCard } from "./PokemonMoveCard";
import { Button } from "@mui/material";
import { ImCross } from "react-icons/im";

const MoveTitle = styled(Title)`
  background-color: aliceblue;
`;

export const RightAlignedContainer = styled.div`
  float: "right";
  right: "0";
  margin-left: "auto";
`;

const PokemonMoveDisplayContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: right;
`;

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
      <PokemonMoveDisplayContainer>
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
      </PokemonMoveDisplayContainer>
      <PokemonMoveCard attack={attack}></PokemonMoveCard>
    </>
  );
}
