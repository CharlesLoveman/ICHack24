export interface PokemonStats {
  hp: number;
  attack: number;
  defence: number;
  "special attack": number;
  "special defence": number;
  speed: number;
}

export interface Attack {
  id: string;
  name: string;
  element: string;
  category?: string;
  description?: string;
  power?: number;
  special?: boolean;
  self_status_id?: any;
  target_status_id?: any;
}

export interface Pokemon {
  id: string;
  name: string;
  element: string;
  description?: string;
  stats: PokemonStats;
  attacks: Attack[];
  image_id?: string;
  img_path?: string;
  original_img_path?: string;
}

export interface BattleData {
  otherPlayerWaiting?: boolean;
  thisPlayerWaiting?: boolean;
}

export interface BattleHP {
  self_hp: number;
  target_hp: number;
}

export interface GlobalContextType {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  pokemon: Pokemon | null;
  setPokemon: React.Dispatch<React.SetStateAction<Pokemon | null>>;
  backend_address: string;
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
