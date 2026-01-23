import { useState } from "react";
import { socket } from "../socket";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import { GiBattleAxe } from "react-icons/gi";
import { PlayerJoinBattleData, Pokemon } from "../sharedTypes";
import { SxProps, Theme } from "@mui/material";

export default function JoinRoomInputBox(
  pokemon: Pokemon | null,
  sx: SxProps<Theme>
) {
  const [code, setCode] = useState<string>("");

  function joinBattle(pokemon: Pokemon | null, code: string) {
    if (pokemon) {
      const game_id = code;

      socket.emit("joinBattle", {
        pokemon_id: pokemon.id,
        game_id: game_id,
      } as PlayerJoinBattleData);
    }
  }

  return (
    <>
      <Button
        disabled={!pokemon}
        sx={sx}
        fullWidth={true}
        color="error"
        startIcon={<GiBattleAxe size="1rem" />}
        endIcon={<GiBattleAxe size="1rem" />}
        variant="contained"
        size="large"
        type="submit"
        onClick={() => joinBattle(pokemon, code)}
      >
        Join Battle
      </Button>
      <br />
      <Input onChange={(e) => setCode(e.target.value)} />
    </>
  );
}
