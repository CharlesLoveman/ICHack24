import { useState, useEffect } from "react";
import PokemonBattleDisplay from "../battle/PokemonBattleDisplay";
import PokemonAttacksDisplay from "../battle/PokemonAttacksDisplay";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { socket } from "../../socket";

import { Pokemon, Attack, AttackData } from "../../sharedTypes";
import { BATTLE_RESULT } from "../../types";
import { useGlobalData } from "../../hooks/useGlobalData";
import BattleCommentary from "../battle/BattleCommentary";
import { Title } from "../layout/Title";
import { ScrollableMain } from "../layout/ScrollableMain";
import styled from "styled-components";
import { assetsFolder } from "../../env";
import { FightButton } from "../battle/FightButton";
import { ReturnToHomeButton } from "../battle/ReturnToHomeButton";

interface BattleLocationState {
  self_pokemon: Pokemon;
  target_pokemon: Pokemon;
  game_id: string;
}
interface ImageContainerProps {
  path: string;
}

const PokemonBattleScreenContainer = styled.div<ImageContainerProps>`
  background: ${(props) =>
    `url("${props.path}") no-repeat fixed center center`};
  background-size: cover;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PokemonActionArea = styled.div`
  width: 100%;
`;

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

  const [isChoosingMove, setIsChoosingMove] = useState(false);

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
    if (!commentaryFinished) {
      setIsChoosingMove(true);
    }
  }, [commentaryFinished]);

  useEffect(() => {
    if (newTurn) {
      setNewTurn(false);
      setChosenAttack(undefined);
      setCommentaryFinished(undefined);
      setCurrentBattleMoves(undefined);
    }
  }, [newTurn]);

  let preMoveCommentary = `What will ${state.self_pokemon.name} do? `;
  if (battleData?.otherPlayerWaiting)
    preMoveCommentary += `The other player is now waiting for you to make a move. `;
  if (battleData?.thisPlayerWaiting)
    preMoveCommentary = `The other player has not selected a move yet. You are ready to use ${chosenAttack?.name}! `;

  return (
    <>
      <Title>Battle</Title>
      {!isChoosingMove ? (
        <PokemonBattleScreenContainer
          path={assetsFolder + "/" + "background_temp_leeched.webp"}
        >
          <ScrollableMain>
            <PokemonBattleDisplay
              self_pokemon={state.self_pokemon}
              target_pokemon={state.target_pokemon}
              self_hp={battleHP?.self_hp ?? 0}
              target_hp={battleHP?.target_hp ?? 0}
            />
          </ScrollableMain>
          <PokemonActionArea>
            {commentaryFinished || commentaryFinished === undefined ? (
              <>
                {battleResult === undefined ? (
                  <BattleCommentary texts={[preMoveCommentary]} />
                ) : (
                  <BattleCommentary
                    texts={[getResultText(battleResult)]}
                  ></BattleCommentary>
                )}
              </>
            ) : (
              <BattleCommentary texts={texts} />
            )}
          </PokemonActionArea>
        </PokemonBattleScreenContainer>
      ) : (
        <ScrollableMain>
          <PokemonAttacksDisplay
            pokemon={state.self_pokemon}
            onAttack={onAttack}
            chosenAttack={chosenAttack}
          />
        </ScrollableMain>
      )}
      {battleResult !== undefined ? (
        <ReturnToHomeButton></ReturnToHomeButton>
      ) : (
        <FightButton
          isChoosingMove={isChoosingMove}
          setIsChoosingMove={setIsChoosingMove}
        ></FightButton>
      )}
    </>
  );
}
