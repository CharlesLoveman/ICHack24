from typing import TypedDict, NotRequired, List

from enum import Enum


class AttackCategory(Enum):
    physical = "physical"
    special = "special"
    status = "status"


class PokemonStats(TypedDict, total=True):
    id: str
    hp: int
    attack: int
    defence: int
    special_attack: int
    special_defence: int
    speed: int
    max_hp: NotRequired[int]


class OptionalPokemonStats(TypedDict, total=False):
    id: str
    hp: int
    attack: int
    defence: int
    special_attack: int
    special_defence: int
    speed: int
    max_hp: NotRequired[int]


class IAttack(TypedDict):
    id: str
    name: str
    element: str
    category: str
    description: str
    power: int
    self_status: OptionalPokemonStats
    target_status: OptionalPokemonStats


class IPokemon(TypedDict):
    id: str
    name: str
    element: str
    description: str
    stats: PokemonStats
    attacks: List[IAttack]
    image_id: str
    original_image_id: str


class BattleData(TypedDict):
    otherPlayerWaiting: NotRequired[bool]
    thisPlayerWaiting: NotRequired[bool]


class CreateBattleData(TypedDict):
    username: str
    pokemon_id: str


class PlayerJoinBattleData(TypedDict):
    username: str
    pokemon_id: str
    game_id: str


class BattleHP(TypedDict):
    self_hp: float
    target_hp: float


class MoveData(TypedDict):
    self_attack_name: str
    target_attack_name: str


class OnTurnEndData(MoveData, BattleHP):
    pass


class JoinWaitingRoomData(TypedDict):
    game_id: str


class JoinBattleData(TypedDict):
    self_pokemon: IPokemon
    target_pokemon: IPokemon
    game_id: str


class AttackData(TypedDict):
    attack_id: str
    game_id: str


class UsernameData(TypedDict):
    username: str


class NotificationData(TypedDict):
    message: str
    severity: str


class LoginAckData(TypedDict):
    username: str
    pid: str


type NetworkBytes = List[int]


class CreatePokemonData(TypedDict):
    username: str
    image_bytes: NetworkBytes


class PokemonCreatedResponse(TypedDict):
    succeeded: bool


class PokemonsData(TypedDict):
    pokemons: List[IPokemon]


class OnePokemonData(TypedDict):
    pokemon_id: str
