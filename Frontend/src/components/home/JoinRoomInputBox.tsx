import { useState } from "react";
import { socket } from "../../socket";
import { GiBattleAxe } from "react-icons/gi";
import { PlayerJoinBattleData, Pokemon } from "../../sharedTypes";
import { LongButton } from "../layout/LongButton";
import { LongInput } from "../layout/LongInput";
import styled from "styled-components";
import { useGlobalData } from "../../hooks/useGlobalData";

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
  const { username } = useGlobalData();

  function joinBattle(pokemon: Pokemon | null, username: string, code: string) {
    if (pokemon) {
      socket.emit("joinBattle", {
        username: username,
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
        onClick={() => (username ? joinBattle(pokemon, username, code) : null)}
      >
        Join Battle
      </LongButton>
    </JoinRoomInputContainer>
  );
}
