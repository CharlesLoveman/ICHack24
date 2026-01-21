from typing import TypedDict, NotRequired, List


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


class BattleData(TypedDict):
    otherPlayerWaiting: NotRequired[bool]
    thisPlayerWaiting: NotRequired[bool]


class BattleHP(TypedDict):
    self_hp: float
    target_hp: float


class GlobalContextType(TypedDict):
    class ViewPokemon_1(TypedDict):
        pass
    class SetViewPokemon_1(TypedDict):
        pass
    class BattleHP_1(TypedDict):
        pass
    class SetBattleHP_1(TypedDict):
        pass
    username: str
    setUsername: 'React.Dispatch[React.SetStateAction[str]]'
    pokemon: Pokemon|None
    setPokemon: 'React.Dispatch[React.SetStateAction[Pokemon|None]]'
    backend_address: str
    pokemonReturned: str
    setPokemonReturned: 'React.Dispatch[React.SetStateAction[str]]'
    noNewPokemon: float
    setNoNewPokemon: 'React.Dispatch[React.SetStateAction[float]]'
    viewPokemon: Pokemon|ViewPokemon_1
    setViewPokemon: 'React.Dispatch[React.SetStateAction[Pokemon|SetViewPokemon_1]]'
    battleData: BattleData
    setBattleData: 'React.Dispatch[React.SetStateAction[BattleData]]'
    newTurn: bool
    setNewTurn: 'React.Dispatch[React.SetStateAction[bool]]'
    battleResult: str
    setBattleResult: 'React.Dispatch[React.SetStateAction[str]]'
    battleHP: BattleHP|BattleHP_1
    setBattleHP: 'React.Dispatch[React.SetStateAction[BattleHP|SetBattleHP_1]]'