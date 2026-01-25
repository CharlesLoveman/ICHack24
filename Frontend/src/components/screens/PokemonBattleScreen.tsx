import { useState, useEffect } from "react";
import PokemonBattleDisplay from "../battle/PokemonBattleDisplay";
import PokemonAttacksDisplay from "../battle/PokemonAttacksDisplay";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { socket } from "../../socket";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { Pokemon, Attack, AttackData } from "../../sharedTypes";
import { BATTLE_RESULT } from "../../types";
import { useGlobalData } from "../../hooks/useGlobalData";
import BattleCommentary from "../BattleCommentary";
import { Title } from "../layout/Title";
import { FooterContainer } from "../layout/FooterContainer";
import { LongButton } from "../LongButton";
import { ScrollableMain } from "../layout/ScrollableMain";
import { PokemonMoveDisplay } from "../PokemonMoveDisplay";

interface BattleLocationState {
  self_pokemon: Pokemon;
  target_pokemon: Pokemon;
  game_id: string;
}

function SwitchView({
  setShowBattle,
}: {
  setShowBattle: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const switchView = () => {
    setShowBattle((showBattle: boolean) => !showBattle);
  };

  return (
    <FooterContainer>
      <LongButton onClick={switchView} noMaxWidth={true} color="warning">
        Switch View
      </LongButton>
    </FooterContainer>
  );
}

export default function PokemonBattleScreen() {
  const {
    battleData,
    newTurn,
    setNewTurn,
    battleResult,
    battleHP,
    commentaryFinished,
    currentBattleMoves,
    setCommentaryFinished,
    setCurrentBattleMoves,
  } = useGlobalData();
  const { state } = useLocation() as { state: BattleLocationState };
  const params = useParams<{ game_id: string }>();
  const [chosenAttack, setChosenAttack] = useState<Attack | undefined>(
    undefined
  );

  const [showBattle, setShowBattle] = useState(true);

  const getResultText = (battleResult: BATTLE_RESULT) => {
    switch (battleResult) {
      case BATTLE_RESULT.WIN:
        return "You have won through sheer skill!";
      case BATTLE_RESULT.LOSE:
        return "Your pokemon has fainted and you have lost...";
    }
  };

  const texts = [
    `${currentBattleMoves?.target_attack_name} was used. It was unfortunately super effective.`,
    `You used ${currentBattleMoves?.self_attack_name}. It was far more effective, probably.`,
  ];

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
      setCommentaryFinished(undefined);
      setCurrentBattleMoves(undefined);
    }
  }, [newTurn]);

  function showResult() {
    return battleResult != undefined ? (
      <>
        <BattleCommentary
          texts={[getResultText(battleResult)]}
        ></BattleCommentary>
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
      <ScrollableMain>
        <Title>Battle</Title>
        {showBattle ? (
          <PokemonBattleDisplay
            self_pokemon={state.self_pokemon}
            target_pokemon={state.target_pokemon}
            self_hp={battleHP?.self_hp ?? 0}
            target_hp={battleHP?.target_hp ?? 0}
          />
        ) : (
          <>
            {commentaryFinished || commentaryFinished === undefined ? (
              <>
                {battleResult === undefined && (
                  <>
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
                    The other player has not selected a move yet. You are ready
                    to use {chosenAttack?.name}!
                  </Typography>
                )}
                {showResult()}
              </>
            ) : (
              <BattleCommentary texts={texts} />
            )}
          </>
        )}
      </ScrollableMain>
      <SwitchView setShowBattle={setShowBattle}></SwitchView>
    </>
  );
}
