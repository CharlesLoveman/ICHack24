import React, { useState, useContext, useEffect } from "react";
import PokemonBattleDisplay from "../PokemonBattleDisplay";
import PokemonAttacksDisplay from "../PokemonAttacksDisplay";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { socket } from "../../socket";
import { GlobalData } from "../../App";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { Pokemon, Attack } from "../../sharedTypes";
import { BATTLE_RESULT, GlobalContextType } from "../../types";

interface BattleLocationState {
  self_pokemon: Pokemon;
  target_pokemon: Pokemon;
  game_id: string;
}

export default function PokemonBattleScreen() {
  const { battleData, newTurn, setNewTurn, battleResult, battleHP } =
    useContext(GlobalData) as GlobalContextType;
  const { state } = useLocation() as { state: BattleLocationState };
  const params = useParams();
  const [chosenAttack, setChosenAttack] = useState("");

  function onAttack(attack: Attack) {
    if (chosenAttack == "") {
      setChosenAttack(attack.name);
      const attack_id = attack.id;
      socket.emit("attack", { attack_id: attack_id, game_id: params.game_id });
    }
  }

  useEffect(() => {
    if (newTurn) {
      setNewTurn(false);
      setChosenAttack("");
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
      {"self_hp" in (battleHP ?? {}) &&
        PokemonBattleDisplay(
          state.self_pokemon,
          state.target_pokemon,
          battleHP?.self_hp ?? 0,
          battleHP?.target_hp ?? 0
        )}
      {battleResult === undefined &&
        PokemonAttacksDisplay(state.self_pokemon, onAttack)}
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
