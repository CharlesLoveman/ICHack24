import { useState, useEffect } from "react";
import PokemonBattleDisplay from "../PokemonBattleDisplay";
import PokemonAttacksDisplay from "../PokemonAttacksDisplay";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { socket } from "../../socket";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { Pokemon, Attack, AttackData } from "../../sharedTypes";
import { BATTLE_RESULT } from "../../types";
import { useGlobalData } from "../../hooks/useGlobalData";

interface BattleLocationState {
  self_pokemon: Pokemon;
  target_pokemon: Pokemon;
  game_id: string;
}

export default function PokemonBattleScreen() {
  const { battleData, newTurn, setNewTurn, battleResult, battleHP } =
    useGlobalData();
  const { state } = useLocation() as { state: BattleLocationState };
  const params = useParams<{ game_id: string }>();
  const [chosenAttack, setChosenAttack] = useState<string | undefined>(
    undefined
  );

  function onAttack(attack: Attack) {
    if (!chosenAttack && params.game_id) {
      setChosenAttack(attack.name);
      socket.emit("attack", {
        attack_id: attack.id,
        game_id: params.game_id,
      } as AttackData);
    }
  }

  useEffect(() => {
    if (newTurn) {
      setNewTurn(false);
      setChosenAttack(undefined);
    }
  }, [newTurn]);

  function showResult() {
    if (battleResult === BATTLE_RESULT.WIN) {
      return (
        <>
          <Typography>You have won through sheer skill!</Typography>
          <Button fullWidth={true} variant="contained" size="large">
            <Link style={{ textDecoration: "none" }} to={`../MainScreen`}>
              Back to the Main Screen
            </Link>
          </Button>
        </>
      );
    } else if (battleResult === BATTLE_RESULT.LOSE) {
      return (
        <>
          <Typography>Your pokemon has fainted and you have lost...</Typography>
          <Button fullWidth={true} variant="contained" size="large">
            <Link style={{ textDecoration: "none" }} to={`../MainScreen`}>
              Back to the Main Screen
            </Link>
          </Button>
        </>
      );
    } else {
      return <></>;
    }
  }

  return (
    <>
      {"self_hp" in (battleHP ?? {}) && (
        <PokemonBattleDisplay
          self_pokemon={state.self_pokemon}
          target_pokemon={state.target_pokemon}
          self_hp={battleHP?.self_hp ?? 0}
          target_hp={battleHP?.target_hp ?? 0}
        />
      )}
      {battleResult === undefined && (
        <PokemonAttacksDisplay
          pokemon={state.self_pokemon}
          onAttack={onAttack}
        />
      )}
      {battleData?.otherPlayerWaiting && (
        <Typography>
          The other player is now waiting for you to make a move.
        </Typography>
      )}
      {battleData?.thisPlayerWaiting && (
        <Typography>
          The other player has not selected a move yet. You are ready to use{" "}
          {chosenAttack}!
        </Typography>
      )}
      {showResult()}
    </>
  );
}
