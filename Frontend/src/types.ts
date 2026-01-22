import { BattleData, BattleHP, Pokemon } from "./sharedTypes";

export enum POKEMON_HAS_RETURNED {
  WAITING,
  RETURNED,
}

export enum BATTLE_RESULT {
  WIN,
  LOSE,
}

export interface GlobalContextType {
  username?: string;
  setUsername: React.Dispatch<React.SetStateAction<string | undefined>>;
  pokemon: Pokemon | null;
  setPokemon: React.Dispatch<React.SetStateAction<Pokemon | null>>;
  pokemonReturned: POKEMON_HAS_RETURNED;
  setPokemonReturned: React.Dispatch<
    React.SetStateAction<POKEMON_HAS_RETURNED>
  >;
  noNewPokemon: number;
  setNoNewPokemon: React.Dispatch<React.SetStateAction<number>>;
  viewPokemon?: Pokemon;
  setViewPokemon: React.Dispatch<React.SetStateAction<Pokemon | undefined>>;
  battleData?: BattleData;
  setBattleData: React.Dispatch<React.SetStateAction<BattleData | undefined>>;
  newTurn: boolean;
  setNewTurn: React.Dispatch<React.SetStateAction<boolean>>;
  battleResult?: BATTLE_RESULT;
  setBattleResult: React.Dispatch<
    React.SetStateAction<BATTLE_RESULT | undefined>
  >;
  battleHP?: BattleHP;
  setBattleHP: React.Dispatch<React.SetStateAction<BattleHP | undefined>>;
}
