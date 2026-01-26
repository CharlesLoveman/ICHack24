import {
  BattleData,
  BattleHP,
  JoinBattleData,
  MoveData,
  Pokemon,
} from "./sharedTypes";

export enum POKEMON_HAS_RETURNED {
  WAITING,
  RETURNED,
}

export enum BATTLE_RESULT {
  WIN,
  LOSE,
}

export interface GlobalStates {
  username?: string;
  pokemon: Pokemon | null;
  pokemonReturned: POKEMON_HAS_RETURNED;
  noNewPokemon: number;
  battleData: BattleData;
  newTurn: boolean;
  battleResult?: BATTLE_RESULT;
  battleHP?: BattleHP;
  currentBattleMoves: MoveData | undefined;
  commentaryFinished?: boolean;
  joinBattleData?: JoinBattleData;
}

export interface GlobalSetters {
  setUsername: React.Dispatch<React.SetStateAction<string | undefined>>;
  setPokemon: React.Dispatch<React.SetStateAction<Pokemon | null>>;
  setPokemonReturned: React.Dispatch<
    React.SetStateAction<POKEMON_HAS_RETURNED>
  >;
  setNoNewPokemon: React.Dispatch<React.SetStateAction<number>>;
  setBattleData: React.Dispatch<React.SetStateAction<BattleData>>;
  setNewTurn: React.Dispatch<React.SetStateAction<boolean>>;
  setBattleResult: React.Dispatch<
    React.SetStateAction<BATTLE_RESULT | undefined>
  >;
  setBattleHP: React.Dispatch<React.SetStateAction<BattleHP | undefined>>;
  setCurrentBattleMoves: React.Dispatch<
    React.SetStateAction<MoveData | undefined>
  >;
  setCommentaryFinished: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >;
  setJoinBattleData: React.Dispatch<
    React.SetStateAction<JoinBattleData | undefined>
  >;
}

export type GlobalContextType = GlobalStates & GlobalSetters;

// export interface GlobalContextType {
//   username?: string;
//   setUsername: React.Dispatch<React.SetStateAction<string | undefined>>;
//   pokemon: Pokemon | null;
//   setPokemon: React.Dispatch<React.SetStateAction<Pokemon | null>>;
//   pokemonReturned: POKEMON_HAS_RETURNED;
//   setPokemonReturned: React.Dispatch<
//     React.SetStateAction<POKEMON_HAS_RETURNED>
//   >;
//   noNewPokemon: number;
//   setNoNewPokemon: React.Dispatch<React.SetStateAction<number>>;
//   viewPokemon?: Pokemon;
//   setViewPokemon: React.Dispatch<React.SetStateAction<Pokemon | undefined>>;
//   battleData?: BattleData;
//   setBattleData: React.Dispatch<React.SetStateAction<BattleData | undefined>>;
//   newTurn: boolean;
//   setNewTurn: React.Dispatch<React.SetStateAction<boolean>>;
//   battleResult?: BATTLE_RESULT;
//   setBattleResult: React.Dispatch<
//     React.SetStateAction<BATTLE_RESULT | undefined>
//   >;
//   battleHP?: BattleHP;
//   setBattleHP: React.Dispatch<React.SetStateAction<BattleHP | undefined>>;
//   currentBattleMoves: MoveData | undefined;
//   setCurrentBattleMoves: React.Dispatch<
//     React.SetStateAction<MoveData | undefined>
//   >;
//   commentaryFinished?: boolean;
//   setCommentaryFinished: React.Dispatch<
//     React.SetStateAction<boolean | undefined>
//   >;
//   joinBattleData?: JoinBattleData;
//   setJoinBattleData: React.Dispatch<
//     React.SetStateAction<JoinBattleData | undefined>
//   >;
// }
