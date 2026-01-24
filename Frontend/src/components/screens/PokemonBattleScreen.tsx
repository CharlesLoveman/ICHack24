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
  const [chosenAttack, setChosenAttack] = useState<Attack | undefined>(
    undefined
  );

  function onAttack(attack: Attack) {
    if (!chosenAttack && params.game_id) {
      setChosenAttack(attack);
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
    return battleResult != undefined ? (
      <>
        <Typography>
          {battleResult === BATTLE_RESULT.WIN
            ? "You have won through sheer skill!"
            : "Your pokemon has fainted and you have lost..."}
        </Typography>
        <Link style={{ textDecoration: "none" }} to={`../MainScreen`}>
          <Button fullWidth={true} variant="contained" size="large">
            Back to the Main Screen
          </Button>{" "}
        </Link>
      </>
    ) : (
      <></>
    );
  }

  return (
    <>
      <PokemonBattleDisplay
        self_pokemon={state.self_pokemon}
        target_pokemon={state.target_pokemon}
        self_hp={battleHP?.self_hp ?? 0}
        target_hp={battleHP?.target_hp ?? 0}
      />
      {!battleResult && (
        <>
          <div style={{ textAlign: "center" }}>
            <Typography variant="h4">Select a move</Typography>
          </div>

          <PokemonAttacksDisplay
            pokemon={state.self_pokemon}
            onAttack={onAttack}
            chosenAttack={chosenAttack}
          />
        </>
      )}
      {battleData?.otherPlayerWaiting && (
        <Typography>
          The other player is now waiting for you to make a move.
        </Typography>
      )}
      {battleData?.thisPlayerWaiting && (
        <Typography>
          The other player has not selected a move yet. You are ready to use{" "}
          {chosenAttack?.name}!
        </Typography>
      )}
      {showResult()}
    </>
  );
}
