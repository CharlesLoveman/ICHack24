import { createContext, useState } from "react";

import { Pokemon, BattleData, BattleHP, MoveData } from "../sharedTypes";
import {
  BATTLE_RESULT,
  GlobalContextType,
  POKEMON_HAS_RETURNED,
} from "../types";

const GlobalData = createContext<GlobalContextType | null>(null);

export { GlobalData };

export function useSetupGlobalData() {
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [pokemonReturned, setPokemonReturned] = useState<POKEMON_HAS_RETURNED>(
    POKEMON_HAS_RETURNED.RETURNED
  );
  const [noNewPokemon, setNoNewPokemon] = useState<number>(0);
  const [viewPokemon, setViewPokemon] = useState<Pokemon | undefined>(
    undefined
  );
  const [battleData, setBattleData] = useState<BattleData | undefined>(
    undefined
  );
  const [newTurn, setNewTurn] = useState<boolean>(false);
  const [battleResult, setBattleResult] = useState<BATTLE_RESULT | undefined>(
    undefined
  );
  const [battleHP, setBattleHP] = useState<BattleHP | undefined>(undefined);
  const [currentBattleMoves, setCurrentBattleMoves] = useState<
    MoveData | undefined
  >(undefined);
  const [commentaryFinished, setCommentaryFinished] = useState<
    boolean | undefined
  >(undefined);

  return {
    username,
    setUsername,
    pokemon,
    setPokemon,
    pokemonReturned,
    setPokemonReturned,
    noNewPokemon,
    setNoNewPokemon,
    viewPokemon,
    setViewPokemon,
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
  };
}
