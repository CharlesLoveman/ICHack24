import { useState } from "react";
import { socket } from "../../socket";
import { GiBattleAxe } from "react-icons/gi";
import { PlayerJoinBattleData, Pokemon } from "../../sharedTypes";
import { LongButton } from "../LongButton";
import { LongInput } from "../LongInput";
import styled from "styled-components";

interface JoinRoomInputBoxProps {
  pokemon: Pokemon | null;
}

const JoinRoomInputContainer = styled.div`
  > * {
    margin-top: 1rem;
  }
`;

export default function JoinRoomInputBox({ pokemon }: JoinRoomInputBoxProps) {
  const [code, setCode] = useState<string>("");

  function joinBattle(pokemon: Pokemon | null, code: string) {
    if (pokemon) {
      socket.emit("joinBattle", {
        pokemon_id: pokemon.id,
        game_id: code,
      } as PlayerJoinBattleData);
    }
  }

  return (
    <JoinRoomInputContainer>
      <LongInput
        disabled={!pokemon}
        onChange={(e) => setCode(e.target.value)}
      />
      <LongButton
        disabled={!pokemon}
        color="error"
        startIcon={<GiBattleAxe size="1rem" />}
        endIcon={<GiBattleAxe size="1rem" />}
        onClick={() => joinBattle(pokemon, code)}
      >
        Join Battle
      </LongButton>
    </JoinRoomInputContainer>
  );
}
