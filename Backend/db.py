from typing import Union, cast
from sharedTypes import *
from pymongo.collection import Collection
from pymongo import MongoClient
from pymongo.cursor import Cursor
from .sharedTypes import IPokemon, AttackCategory
from .env import DATABASE_HOST
from bson.objectid import ObjectId
from .pokemon_constants import stats_keys, fallback_stats, fallback_attack


class _Id(TypedDict):
    _id: ObjectId


class DBPlayer(TypedDict):
    pokemon_ids: List[str]
    username: str


class DBPokemon(TypedDict):
    name: str
    description: str
    element: str
    stats_id: str
    attack_ids: List[str]
    image_id: str
    original_image_id: str


class DBAttack(TypedDict):
    name: str
    description: NotRequired[str]  # TODO: remove; added for db compatibility
    element: str
    power: int
    category: NotRequired[str]  # TODO: remove; added for db compatibility
    self_status_id: str
    target_status_id: str


class DBStats(TypedDict):
    hp: int
    attack: int
    defence: int
    special_attack: int
    special_defence: int
    speed: int


class OptionalDBStats(TypedDict, total=False):
    hp: int
    attack: int
    defence: int
    special_attack: int
    special_defence: int
    speed: int


class DBPlayerWithId(DBPlayer, _Id):
    pass


class DBPokemonWithId(DBPokemon, _Id):
    pass


class DBAttackWithId(DBAttack, _Id):
    pass


class DBStatsWithId(DBStats, _Id):
    pass


class OptionalDBStatsWithId(OptionalDBStats, _Id):
    pass


mongodb_client = MongoClient(DATABASE_HOST, 27017)
database = mongodb_client.db


players_collection: Collection[DBPlayer] = database.players
pokemon_collection: Collection[DBPokemon] = database.pokemon
attacks_collection: Collection[DBAttack] = database.attacks
attack_stats_collection: Collection[OptionalDBStats] = database.attack_stats


def initialise_user(username: str):
    """Initialise a user using a username."""
    print(f"Attempting to log in user: {username}")
    player = get_player_by_username(username)

    if player is None:
        # Create a new user id
        print(f"User: {username} not found. Creating new user.")
        new_user: DBPlayer = {"pokemon_ids": [], "username": username}
        pid = str(players_collection.insert_one(new_user).inserted_id)
    else:
        # Return existing user id
        pid = str(player["_id"])

    print(f"Login successful. pid: {pid}")

    return pid


def get_player_by_username(username: str) -> Union[DBPlayerWithId, None]:
    """Return a player object from the database using a username."""
    player = players_collection.find_one({"username": username})

    if player is None:
        return None
    else:
        return cast(DBPlayerWithId, player)


def get_pokemon_ids_from_player(username: str) -> List[str]:
    """Return a list of Pokemon ids for the given user."""
    # print(f"Attempting to load Pokemon ids for user: {username}")
    player = players_collection.find_one({"username": username})
    if player is not None:
        pokemon_ids = player["pokemon_ids"]
        return pokemon_ids
    else:
        return []


def db_pokemon_to_interface(db_pokemon: DBPokemonWithId):

    stats_id = db_pokemon["stats_id"]
    stats = get_stats_from_id(stats_id)

    attack_ids = db_pokemon["attack_ids"]
    attacks = [get_attack_from_id(attack_id) for attack_id in attack_ids]

    pokemon: IPokemon = {
        "id": str(db_pokemon["_id"]),
        "name": db_pokemon["name"],
        "element": db_pokemon["element"],
        "description": db_pokemon["description"],
        "image_id": db_pokemon["image_id"],
        "original_image_id": db_pokemon["original_image_id"],
        "stats": stats,
        "attacks": attacks,
    }

    return pokemon


def get_pokemon_by_name(name: str) -> IPokemon:
    """Return a Pokemon as a dict."""
    db_pokemon = pokemon_collection.find_one({"name": name})
    if db_pokemon is None:
        raise ValueError(f"Pokemon {name} not found")

    db_pokemon = cast(DBPokemonWithId, db_pokemon)

    return db_pokemon_to_interface(db_pokemon)


def get_pokemon_from_id(pokemon_id: str) -> IPokemon:
    """Return a Pokemon as a dict."""
    # print(f"Attempting to load data on Pokemon: {pokemon_id}")
    db_pokemon = pokemon_collection.find_one({"_id": ObjectId(pokemon_id)})
    if db_pokemon is None:
        raise ValueError(f"Pokemon {pokemon_id} not found")

    # print(f"Attempting to load data on Pokemon: {db_pokemon['name']}")
    db_pokemon = cast(DBPokemonWithId, db_pokemon)

    return db_pokemon_to_interface(db_pokemon)


def get_optional_stats_from_id(stats_id: str) -> OptionalPokemonStats:
    """Return stats as a dict."""
    db_stats = attack_stats_collection.find_one({"_id": ObjectId(stats_id)})
    if db_stats is None:
        # raise ValueError(f"Stats {stats_id} not found")
        print(f"Stats {stats_id} not found")
        return fallback_stats

    db_stats = cast(OptionalDBStatsWithId, db_stats)

    stats: OptionalPokemonStats = {}

    stats["id"] = str(db_stats["_id"])

    if "hp" in db_stats:
        stats["hp"] = db_stats["hp"]
    if "attack" in db_stats:
        stats["attack"] = db_stats["attack"]
    if "defence" in db_stats:
        stats["defence"] = db_stats["defence"]
    if "special_attack" in db_stats:
        stats["special_attack"] = db_stats["special_attack"]
    if "special_defence" in db_stats:
        stats["special_defence"] = db_stats["special_defence"]
    if "speed" in db_stats:
        stats["speed"] = db_stats["speed"]

    return stats


def get_stats_from_id(stats_id: str) -> PokemonStats:
    """Return (non-optional) stats as a dict."""

    optional_stats = get_optional_stats_from_id(stats_id=stats_id)

    if True in [key not in optional_stats.keys() for key in stats_keys]:
        raise ValueError(f"These stats don't contain all the values.")

    return cast(PokemonStats, optional_stats)


def get_attack_from_id(attack_id: str) -> IAttack:
    """Return an attack as a dict."""
    # print(f"Attempting to load data on Attack: {attack_id}")
    db_attack = attacks_collection.find_one({"_id": ObjectId(attack_id)})
    if db_attack is None:
        # raise ValueError(f"Attack {attack_id} not found")
        print(f"Attack {attack_id} not found")
        return fallback_attack
    db_attack = cast(DBAttackWithId, db_attack)

    self_status_id = db_attack["self_status_id"]
    self_status = get_status_from_id(self_status_id)

    target_status_id = db_attack["target_status_id"]
    target_status = get_status_from_id(target_status_id)

    attack: IAttack = {
        "id": str(db_attack["_id"]),
        "name": db_attack["name"],
        "description": db_attack["description"] if "description" in db_attack else "",
        "element": db_attack["element"],
        "power": db_attack["power"],
        "category": (db_attack["category"] if "category" in db_attack else "physical"),
        "self_status": self_status,
        "target_status": target_status,
    }
    return attack


def get_status_from_id(status_id: str) -> OptionalPokemonStats:
    """Return a status as a dict."""
    return get_optional_stats_from_id(status_id)


def get_pokemons_from_user(username: str):
    """
        Return a list of Pokemon stats as a JSON object.

    Args:
        username (str): the username

    Returns:
        pokemon_list (json): a list of Pokemon as a JSON object
    """
    print(f"Generating Pokemon list for user: {username}")

    pokemon_ids = get_pokemon_ids_from_player(username)
    pokemon_list = [get_pokemon_from_id(pokemon_id) for pokemon_id in pokemon_ids]

    return pokemon_list


def get_all_pokemons():
    object_ids_docs = pokemon_collection.find({}, {"_id": 1})
    object_ids_docs = cast(Cursor[DBPokemonWithId], object_ids_docs)

    str_object_ids = [str(doc["_id"]) for doc in object_ids_docs]

    return [get_pokemon_from_id(object_id) for object_id in str_object_ids]


def add_pokemon_to_user(username: str, pokemon_id: str):
    print(f"Saving Pokemon: {pokemon_id} to user: {username}")
    """Add a Pokemon to a user."""
    players_collection.update_one(
        {"username": username}, {"$push": {"pokemon_ids": pokemon_id}}
    )
