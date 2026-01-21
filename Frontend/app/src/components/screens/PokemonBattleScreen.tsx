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
import { GlobalContextType, Pokemon, Attack } from "../../types";

interface BattleLocationState {
  self_pokemon: Pokemon;
  target_pokemon: Pokemon;
  game_id: string;
}

export default function PokemonBattleScreen() {
  const data = useContext(GlobalData) as GlobalContextType;
  const battleData = data.battleData;
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
    if (data.newTurn) {
      data.setNewTurn(false);
      setChosenAttack("");
    }
  }, [data.newTurn]);

  function showResult() {
    if (data.battleResult == "win") {
      return (
        <>
          <Typography>You have won through sheer skill!</Typography>
          <Button fullWidth="true" variant="contained" size="large">
            <Link style={{ textDecoration: "none" }} to={`../MainScreen`}>
              Back to the Main Screen
            </Link>
          </Button>
        </>
      );
    } else if (data.battleResult == "lose") {
      return (
        <>
          <Typography>Your pokemon has fainted and you have lost...</Typography>
          <Button fullWidth="true" variant="contained" size="large">
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
      {"self_hp" in data.battleHP &&
        PokemonBattleDisplay(
          state.self_pokemon,
          state.target_pokemon,
          data.battleHP.self_hp,
          data.battleHP.target_hp
        )}
      {data.battleResult == "" &&
        PokemonAttacksDisplay(state.self_pokemon, onAttack)}
      {battleData.otherPlayerWaiting && (
        <Typography>
          The other player is now waiting for you to make a move.
        </Typography>
      )}
      {battleData.thisPlayerWaiting && (
        <Typography>
          The other player has not selected a move yet. You are ready to use{" "}
          {chosenAttack}!
        </Typography>
      )}
      {showResult()}
    </>
  );
}
