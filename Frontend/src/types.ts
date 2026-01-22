import { BattleData, BattleHP, Pokemon } from "./sharedTypes";

export interface GlobalContextType {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  pokemon: Pokemon | null;
  setPokemon: React.Dispatch<React.SetStateAction<Pokemon | null>>;
  pokemonReturned: string;
  setPokemonReturned: React.Dispatch<React.SetStateAction<string>>;
  noNewPokemon: number;
  setNoNewPokemon: React.Dispatch<React.SetStateAction<number>>;
  viewPokemon: Pokemon | {};
  setViewPokemon: React.Dispatch<React.SetStateAction<Pokemon | {}>>;
  battleData: BattleData;
  setBattleData: React.Dispatch<React.SetStateAction<BattleData>>;
  newTurn: boolean;
  setNewTurn: React.Dispatch<React.SetStateAction<boolean>>;
  battleResult: string;
  setBattleResult: React.Dispatch<React.SetStateAction<string>>;
  battleHP: BattleHP | {};
  setBattleHP: React.Dispatch<React.SetStateAction<BattleHP | {}>>;
}
