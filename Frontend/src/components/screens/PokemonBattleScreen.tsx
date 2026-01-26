import { useState, useEffect } from "react";
import PokemonBattleDisplay from "../battle/PokemonBattleDisplay";
import PokemonAttacksDisplay from "../battle/PokemonAttacksDisplay";
import { useParams } from "react-router-dom";
import { socket } from "../../socket";

import { Attack, AttackData } from "../../sharedTypes";
import { BATTLE_RESULT, BATTLE_STATE } from "../../types";
import { useGlobalData } from "../../hooks/useGlobalData";
import BattleCommentary from "../battle/BattleCommentary";
import { Title } from "../layout/Title";
import { ScrollableMain } from "../layout/ScrollableMain";
import styled from "styled-components";
import { assetsFolder } from "../../env";
import { FightButton } from "../battle/FightButton";
import { ReturnToHomeButton } from "../battle/ReturnToHomeButton";

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
    joinBattleData,
    battleData,
    newTurn,
    setNewTurn,
    battleResult,
    battleHP,
    currentBattleMoves,
    setCurrentBattleMoves,
    battleState,
    setBattleState,
  } = useGlobalData();
  const params = useParams<{ game_id: string }>();
  const [chosenAttack, setChosenAttack] = useState<Attack | undefined>(
    undefined
  );

  const [isChoosingMove, setIsChoosingMove] = useState(false);

  const { self_pokemon: selfPokemon, target_pokemon: targetPokemon } =
    joinBattleData ?? {};

  const getResultText = (battleResult: BATTLE_RESULT) => {
    switch (battleResult) {
      case BATTLE_RESULT.WIN:
        return "You have won through sheer skill!";
      case BATTLE_RESULT.LOSE:
        return "Your pokemon has fainted and you have lost...";
      default:
        return "There ought to be a result..";
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
    if (battleState === BATTLE_STATE.RESOLVING_ATTACKS) {
      setIsChoosingMove(false);
    }
  }, [battleState]);

  useEffect(() => {
    if (newTurn) {
      setNewTurn(false);
      setChosenAttack(undefined);
      setBattleState(BATTLE_STATE.IDLING);
      setCurrentBattleMoves(undefined);
    }
  }, [newTurn]);

  let preMoveCommentary = `What will ${joinBattleData?.self_pokemon.name} do? `;
  if (battleData?.otherPlayerWaiting)
    preMoveCommentary += `The other player is now waiting for you to make a move. `;
  if (battleData?.thisPlayerWaiting)
    preMoveCommentary = `The other player has not selected a move yet. You are ready to use ${chosenAttack?.name}! `;

  return !(selfPokemon && targetPokemon) ? (
    <></>
  ) : (
    <>
      <Title>
        Battle {battleState === BATTLE_STATE.RESOLVING_ATTACKS ? "YES" : "NO"}
      </Title>
      {!isChoosingMove ? (
        <PokemonBattleScreenContainer
          path={assetsFolder + "/" + "background_temp_leeched.webp"}
        >
          <ScrollableMain>
            <PokemonBattleDisplay
              self_pokemon={selfPokemon}
              target_pokemon={targetPokemon}
              self_hp={battleHP?.self_hp ?? 0}
              target_hp={battleHP?.target_hp ?? 0}
            />
          </ScrollableMain>
          <PokemonActionArea>
            {battleState === BATTLE_STATE.IDLING ? (
              <>
                {battleResult === undefined ? (
                  <>
                    <BattleCommentary texts={[preMoveCommentary]} />
                  </>
                ) : (
                  <>
                    <BattleCommentary
                      texts={[getResultText(battleResult)]}
                    ></BattleCommentary>
                  </>
                )}
              </>
            ) : (
              <BattleCommentary
                texts={[...texts]}
                onCommentaryEnd={() => {
                  setBattleState(BATTLE_STATE.IDLING);
                }}
                hideArrowOnLast={false}
              />
            )}
          </PokemonActionArea>
        </PokemonBattleScreenContainer>
      ) : (
        <ScrollableMain>
          <PokemonAttacksDisplay
            pokemon={selfPokemon}
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
          disabled={battleState === BATTLE_STATE.RESOLVING_ATTACKS}
        ></FightButton>
      )}
    </>
  );
}
