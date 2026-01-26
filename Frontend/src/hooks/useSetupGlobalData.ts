import { createContext, useState } from "react";

import {
  Pokemon,
  BattleData,
  BattleHP,
  MoveData,
  JoinBattleData,
} from "../sharedTypes";
import {
  BATTLE_RESULT,
  GlobalContextType,
  GlobalStates,
  POKEMON_HAS_RETURNED,
} from "../types";

const GlobalData = createContext<GlobalContextType | null>(null);

export { GlobalData };

export function getStates(data: GlobalContextType) {
  return data as GlobalStates;
}

export function clearBattleStates(data: GlobalContextType) {
  data.setBattleData(baseBattleData);
  data.setBattleResult(undefined);
  data.setBattleHP(undefined);
  data.setCurrentBattleMoves(undefined);
  data.setCommentaryFinished(undefined);
  data.setJoinBattleData(undefined);
  data.setNewTurn(false);
}

export const baseBattleData = {
  otherPlayerWaiting: false,
  thisPlayerWaiting: false,
} as BattleData;

export function useSetupGlobalData(initialOverrides: GlobalStates) {
  const [username, setUsername] = useState<string | undefined>(
    initialOverrides.username ?? undefined
  );
  const [pokemon, setPokemon] = useState<Pokemon | null>(
    initialOverrides.pokemon ?? null
  );
  const [pokemonReturned, setPokemonReturned] = useState<POKEMON_HAS_RETURNED>(
    initialOverrides.pokemonReturned ?? POKEMON_HAS_RETURNED.RETURNED
  );
  const [noNewPokemon, setNoNewPokemon] = useState<number>(
    initialOverrides.noNewPokemon ?? 0
  );
  const [battleData, setBattleData] = useState<BattleData>(
    initialOverrides.battleData ?? baseBattleData
  );
  const [newTurn, setNewTurn] = useState<boolean>(
    initialOverrides.newTurn ?? false
  );
  const [battleResult, setBattleResult] = useState<BATTLE_RESULT | undefined>(
    initialOverrides.battleResult ?? undefined
  );
  const [battleHP, setBattleHP] = useState<BattleHP | undefined>(
    initialOverrides.battleHP ?? undefined
  );
  const [currentBattleMoves, setCurrentBattleMoves] = useState<
    MoveData | undefined
  >(initialOverrides.currentBattleMoves ?? undefined);
  const [commentaryFinished, setCommentaryFinished] = useState<
    boolean | undefined
  >(initialOverrides.commentaryFinished ?? undefined);
  const [joinBattleData, setJoinBattleData] = useState<
    JoinBattleData | undefined
  >(initialOverrides.joinBattleData ?? undefined);

  return {
    username,
    setUsername,
    pokemon,
    setPokemon,
    pokemonReturned,
    setPokemonReturned,
    noNewPokemon,
    setNoNewPokemon,
    battleData,
    setBattleData,
    newTurn,
    setNewTurn,
    battleResult,
    setBattleResult,
    battleHP,
    setBattleHP,
    currentBattleMoves,
    setCurrentBattleMoves,
    commentaryFinished,
    setCommentaryFinished,
    joinBattleData,
    setJoinBattleData,
  };
}
