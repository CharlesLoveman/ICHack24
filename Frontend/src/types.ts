import {
  BattleData,
  BattleHP,
  JoinBattleData,
  MoveData,
  NotificationData,
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

export enum BATTLE_STATE {
  IDLING,
  RESOLVING_ATTACKS,
  FINISHED,
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
  joinBattleData?: JoinBattleData;
  battleState?: BATTLE_STATE;
  notifications: NotificationData[];
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
  setJoinBattleData: React.Dispatch<
    React.SetStateAction<JoinBattleData | undefined>
  >;
  setBattleState: React.Dispatch<
    React.SetStateAction<BATTLE_STATE | undefined>
  >;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationData[]>>;
  addNotification: (notification: NotificationData) => void;
}

export type GlobalContextType = GlobalStates & GlobalSetters;
