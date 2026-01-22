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
    self_status_id: NotRequired[str]
    target_status_id: NotRequired[str]


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

class JoinBattleData(TypedDict):
    pokemon_id: str
    game_id: str

class BattleHP(TypedDict):
    self_hp: float
    target_hp: float