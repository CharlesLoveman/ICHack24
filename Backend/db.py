from typing import Union
from sharedTypes import *
from flask import request as _request, Request
from pymongo.collection import Collection
from pymongo import MongoClient

from .sharedTypes import Pokemon
from .env import DATABASE_HOST

from bson.objectid import ObjectId

from sharedTypes import *


class Request:
    sid: str


request: Request = _request


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
    element: str
    power: int
    special: bool
    self_status_id: str
    target_status_id: str


class DBStats(TypedDict):
    hp: int
    attack: int
    defence: int
    special_attack: int
    special_defence: int
    speed: int


mongodb_client = MongoClient(DATABASE_HOST, 27017)
database = mongodb_client.db


players_collection: Collection[DBPlayer] = database.players
pokemon_collection: Collection[DBPokemon] = database.pokemon
attacks_collection: Collection[DBAttack] = database.attacks
attack_stats_collection: Collection[DBStats] = database.attack_stats


def initialise_user(username: str):
    """Initialise a user using a username."""
    print(f"Attempting to log in user: {username}")
    player = get_player_by_username(username)

    if player is None:
        # Create a new user id
        print(f"User: {username} not found. Creating new user.")
        new_user: Player = {"pokemon_ids": [], "username": username}
        pid = str(players_collection.insert_one(new_user).inserted_id)
    else:
        # Return existing user id
        pid = str(player["_id"])

    print(f"Login successful. pid: {pid}")

    return pid


def get_player_by_username(username: str) -> Union[Player, None]:
    """Return a player object from the database using a username."""
    player = players_collection.find_one({"username": username})

    return player


def get_pokemon_ids_from_player(username: str) -> List[str]:
    """Return a list of Pokemon ids for the given user."""
    # print(f"Attempting to load Pokemon ids for user: {username}")
    player = players_collection.find_one({"username": username})
    if player is not None:
        pokemon_ids = player["pokemon_ids"]
        return pokemon_ids
    else:
        return []


def get_pokemon_from_id(pokemon_id: str) -> Pokemon:
    """Return a Pokemon as a dict."""
    # print(f"Attempting to load data on Pokemon: {pokemon_id}")
    pokemon = pokemon_collection.find_one({"_id": ObjectId(pokemon_id)})
    pokemon["id"] = str(pokemon["_id"])
    pokemon.pop("_id")

    stats_id = pokemon["stats_id"]
    pokemon["stats"] = get_stats_from_id(stats_id)

    attack_ids = pokemon["attack_ids"]
    pokemon["attacks"] = [get_attack_from_id(attack_id) for attack_id in attack_ids]

    return pokemon


def get_stats_from_id(stats_id: str, flag: str = "stats") -> PokemonStats:
    """Return stats as a dict."""
    # print(f"Attempting to load data on {flag}: {stats_id}")
    stats = attack_stats_collection.find_one({"_id": ObjectId(stats_id)})
    stats.pop("_id")

    return stats


def get_attack_from_id(attack_id: str) -> Attack:
    """Return an attack as a dict."""
    # print(f"Attempting to load data on Attack: {attack_id}")
    attack = attacks_collection.find_one({"_id": ObjectId(attack_id)})
    attack["id"] = str(attack["_id"])
    attack.pop("_id")

    self_status_id = attack["self_status_id"]
    attack["self_status_id"] = get_status_from_id(self_status_id)

    target_status_id = attack["target_status_id"]
    attack["target_status_id"] = get_status_from_id(target_status_id)

    return attack


def get_status_from_id(status_id: str) -> PokemonStats:
    """Return a status as a dict."""
    return get_stats_from_id(status_id, flag="status")


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

    str_object_ids = [str(doc["_id"]) for doc in object_ids_docs]

    return [get_pokemon_from_id(object_id) for object_id in str_object_ids]
