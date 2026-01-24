from typing import TypedDict, NotRequired, List, Any


class PokemonStats(TypedDict):
    hp: float
    attack: float
    defence: float
    special_attack: float
    special_defence: float
    speed: float


class Attack(TypedDict):
    id: str
    name: str
    element: str
    category: NotRequired[str]
    description: NotRequired[str]
    power: NotRequired[float]
    special: NotRequired[bool]
    self_status_id: NotRequired[PokemonStats]
    target_status_id: NotRequired[PokemonStats]


class Pokemon(TypedDict):
    id: str
    name: str
    element: str
    description: NotRequired[str]
    stats: PokemonStats
    attacks: List[Attack]
    image_id: NotRequired[str]
    img_path: NotRequired[str]
    original_img_path: NotRequired[str]


class Player(TypedDict):
    _id: NotRequired[Any]
    username: str
    pokemon_ids: List[str]


class BattleData(TypedDict):
    otherPlayerWaiting: NotRequired[bool]
    thisPlayerWaiting: NotRequired[bool]


class CreateBattleData(TypedDict):
    username: str
    pokemon_id: str


class PlayerJoinBattleData(TypedDict):
    pokemon_id: str
    game_id: str


class BattleHP(TypedDict):
    self_hp: float
    target_hp: float


class OnTurnEndData(TypedDict):
    self_hp: float
    target_hp: float
    self_attack_name: str
    target_attack_name: str


class JoinWaitingRoomData(TypedDict):
    game_id: str


class JoinBattleData(TypedDict):
    self_pokemon: Pokemon
    target_pokemon: Pokemon
    game_id: str


class AttackData(TypedDict):
    attack_id: Pokemon
    game_id: str
