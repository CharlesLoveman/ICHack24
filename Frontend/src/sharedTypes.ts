import { AlertColor } from "@mui/material";

enum AttackCategory {
  physical = "physical",
  special = "special",
  status = "status",
}

export interface PokemonStats {
  id: string;
  hp: number;
  attack: number;
  defence: number;
  special_attack: number;
  special_defence: number;
  speed: number;
  max_hp?: number;
}

export interface OptionalPokemonStats {
  id: string;
  hp?: number;
  attack?: number;
  defence?: number;
  special_attack?: number;
  special_defence?: number;
  speed?: number;
  max_hp?: number;
}

export interface IAttack {
  id: string;
  name: string;
  element: string;
  category: AttackCategory;
  description: string;
  power: number;
  self_status: OptionalPokemonStats;
  target_status: OptionalPokemonStats;
}

export interface IPokemon {
  id: string;
  name: string;
  element: string;
  description: string;
  stats: PokemonStats;
  attacks: IAttack[];
  image_id?: string;
  origina_image_id?: string;
}

export interface BattleData {
  otherPlayerWaiting: boolean;
  thisPlayerWaiting: boolean;
}

export interface CreateBattleData {
  username: string;
  pokemon_id: string;
}

export interface PlayerJoinBattleData {
  username: string;
  pokemon_id: string;
  game_id: string;
}

export interface BattleHP {
  self_hp: number;
  target_hp: number;
}

export interface MoveData {
  self_attack_name: string;
  target_attack_name: string;
}

export type OnTurnEndData = BattleHP & MoveData;

export interface JoinWaitingRoomData {
  game_id: string;
}

export interface JoinBattleData {
  self_pokemon: IPokemon;
  target_pokemon: IPokemon;
  game_id: string;
}

export interface AttackData {
  attack_id: string;
  game_id: string;
}

export interface UsernameData {
  username: string;
}

export interface NotificationData {
  message: string;
  severity: AlertColor;
}

export interface LoginAckData {
  username: string;
  pid: string;
}

export type NetworkBytes = Uint8Array;

export interface CreatePokemonData {
  username: string;
  image_bytes: NetworkBytes;
}

export interface PokemonCreatedResponse {
  succeeded: boolean;
}

export interface PokemonsData {
  pokemons: IPokemon[];
}

export interface OnePokemonData {
  pokemon_id: string;
}
