export interface PokemonStats {
  hp: number;
  attack: number;
  defence: number;
  special_attack: number;
  special_defence: number;
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
  self_status_id?: string;
  target_status_id?: string;
}

export interface CreateBattleData {
  username: string;
  pokemon_id: string;
}

export interface JoinBattleData {
  pokemon_id: string;
  game_id: string;
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
