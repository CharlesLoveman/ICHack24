from Backend.types import *
from flask import request as _request, Request
from pymongo.collection import Collection

from pymongo import MongoClient



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


ip = "127.0.0.1"
# Change this back
mongodb_client = MongoClient(ip, 27017)
database = mongodb_client.db


players_collection: Collection[DBPlayer] = database.players
pokemon_collection: Collection[DBPokemon] = database.pokemon
attacks_collection: Collection[DBAttack] = database.attacks
attack_stats_collection: Collection[DBStats] = database.attack_stats