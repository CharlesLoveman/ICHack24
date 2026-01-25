import Button from "@mui/material/Button";
import { Attack as IAttack } from "../../sharedTypes";
import { Typography } from "@mui/material";
import { PokemonTypeContainer } from "../pokedex/PokemonCard";
import styled from "styled-components";
import { AiFillInfoCircle } from "react-icons/ai";

interface AttackProps {
  attack: IAttack;
  onAttack: (attack: IAttack) => void;
  isChosen: boolean;
  disabled: boolean;
  onClickInfo: () => void;
}

const AttackButton = styled(Button)`
  max-height: 12rem;
  overflow: clip;
  width: 100%;
  height: 100%;
`;

const AttackButtonText = styled.div`
  margin: auto;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const InfoButton = styled(Button)`
  min-width: 0;
  position: absolute;
  top: 2.5rem;
  right: 0;
  z-index: 100;
`;

export default function Attack({
  attack,
  onAttack,
  isChosen,
  disabled,
  onClickInfo,
}: AttackProps) {
  return (
    <>
      <InfoButton
        color="secondary"
        style={{ minWidth: 0 }}
        onClick={() => {
          onClickInfo();
        }}
      >
        <AiFillInfoCircle size="1.5rem" />
      </InfoButton>
      <AttackButton
        color={isChosen ? "secondary" : "primary"}
        onClick={() => onAttack(attack)}
        disabled={!isChosen && disabled}
      >
        <AttackButtonText>
          <Typography variant="h6">{attack.name}</Typography>
          <PokemonTypeContainer style={{ color: "black" }}>
            {attack.element}
          </PokemonTypeContainer>
          <div>{attack.special ? "Special" : "Physical"}</div>
          <div>{"Power: " + attack.power}</div>
        </AttackButtonText>
      </AttackButton>
    </>
  );
}
