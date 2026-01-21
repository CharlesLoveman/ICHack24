"""Flask app for the backend."""

from interfaces import *
from flask import Flask, make_response, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit
from random import randrange

from .pokemon import Battle, Pokemon
from .api import GeminiError, build_pokemon, PATH_TO_PUBLIC
from pymongo import MongoClient
from dotenv import dotenv_values
import os
from bson.objectid import ObjectId
import json
import base64

config = dotenv_values(".prod" if os.getenv("FLASK_ENV") == "prod" else ".dev")

ERRORMON_ID = None  # Run create_errormon.py and set this!


ip = "127.0.0.1"
# Change this back
mongodb_client = MongoClient(ip, 27017)
database = mongodb_client["ic-hack"]
users = {}

py_cors_or = "*"
sock_cors_or = "*"

# ip = "http://localhost:3000"
# py_cors_or = f"{ip}"
# sock_cors_or = py_cors_or

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": py_cors_or}})
app.config["SECRET_KEY"] = config["APP_SECRET"]
socketio = SocketIO(app, cors_credentials=True, cors_allowed_origins=py_cors_or)

battles = {}

if __name__ == "__main__":
    socketio.run(app, port=5000, host="0.0.0.0")


class CreationError(Exception):
    """Raised when a Pokemon cannot be created."""

    pass


def bytes_to_json(bytes):
    b64bytes = base64.b64encode(bytes)
    strbytes = b64bytes.decode("utf-8")
    return json.dumps(strbytes)


def get_player_by_username(username):
    """Return a player object from the database using a username."""
    player = database.players.find_one({"username": username})

    return player


def get_pokemon_ids_from_player(username):
    """Return a list of Pokemon ids for the given user."""
    print(f"Attempting to load Pokemon ids for user: {username}")
    player = database.players.find_one({"username": username})
    pokemon_ids = player["pokemon_ids"]

    return pokemon_ids


def get_pokemon_from_id(pokemon_id):
    """Return a Pokemon as a dict."""
    print(f"Attempting to load data on Pokemon: {pokemon_id}")
    pokemon = database.pokemon.find_one({"_id": ObjectId(pokemon_id)})
    pokemon["id"] = str(pokemon["_id"])
    pokemon.pop("_id")

    stats_id = pokemon["stats_id"]
    pokemon["stats"] = get_stats_from_id(stats_id)

    attack_ids = pokemon["attack_ids"]
    pokemon["attacks"] = [get_attack_from_id(attack_id) for attack_id in attack_ids]

    return pokemon


def get_stats_from_id(stats_id, flag="stats"):
    """Return stats as a dict."""
    print(f"Attempting to load data on {flag}: {stats_id}")
    stats = database.attack_stats.find_one({"_id": ObjectId(stats_id)})
    stats.pop("_id")

    return stats


def get_attack_from_id(attack_id):
    """Return an attack as a dict."""
    print(f"Attempting to load data on Attack: {attack_id}")
    attack = database.attacks.find_one({"_id": ObjectId(attack_id)})
    attack["id"] = str(attack["_id"])
    attack.pop("_id")

    self_status_id = attack["self_status_id"]
    attack["self_status_id"] = get_status_from_id(self_status_id)

    target_status_id = attack["target_status_id"]
    attack["target_status_id"] = get_status_from_id(target_status_id)

    return attack


def get_status_from_id(status_id):
    """Return a status as a dict."""
    return get_stats_from_id(status_id, flag="status")


@socketio.on("message")
def handle_message(message):
    send(message)


@socketio.on("json")
def handle_json(json):
    send(json, json=True)


@socketio.on("createPokemon")  # TODO: remove this
def handle_my_custom_event(json):
    emit(
        "createPokemonCard",
        {
            "name": "Squirtle",
            "element": "a bit wet",
            "description": "best boy 1997",
            "stats": {"attack": 0},
        },
    )


@socketio.on("createBattle")
def handle_createBattle(json):
    """Create a new battle."""
    # game_id = createGame(json.id)
    game_id = str(randrange(0, 1000000))
    pokemon_id = json["pokemon_id"]

    print(f"Creating battle (id: {game_id}) for client id: {request.sid}")

    # pokemon = Pokemon.load(database, pokemon_id)
    battles[game_id] = Battle(request.sid, pokemon_id, database)
    users[request.sid] = request.sid

    emit("joinWaitingRoom", {"game_id": game_id})


@socketio.on("joinBattle")
def handle_joinBattle(json):
    """Join a new player to a battle."""
    game_id = json["game_id"]
    pokemon_id = json["pokemon_id"]

    print(f"Client id: {request.sid} joining battle: {game_id}")

    battle = battles[game_id]
    battle.add_player(request.sid, pokemon_id)

    emit(
        "joinBattle",
        {
            "self_pokemon": get_pokemon_from_id(battle.p2_id),
            "target_pokemon": get_pokemon_from_id(battle.p1_id),
            "game_id": game_id,
        },
        to=request.sid,
    )
    emit(
        "joinBattleFromRoom",
        {
            "self_pokemon": get_pokemon_from_id(battle.p1_id),
            "target_pokemon": get_pokemon_from_id(battle.p2_id),
            "game_id": game_id,
        },
        to=battle.u1,
    )


@socketio.on("attack")
def handle_attack(json):
    battles[json["game_id"]].handle_event("attack", json, request.sid, database)


@app.route("/InitialiseUser/<username>", methods=["POST"])
def InitialiseUser(username):
    """Initialise a user using a username."""
    print(f"Attempting to log in user: {username}")
    player = get_player_by_username(username)

    if player is None:
        # Create a new user id
        print(f"User: {username} not found. Creating new user.")
        new_user = {"pokemon_ids": [], "username": username}
        pid = str(database.players.insert_one(new_user).inserted_id)
    else:
        # Return existing user id
        pid = str(player["_id"])

    print(f"Login successful. pid: {pid}")

    resp = jsonify(success=True)
    resp = make_response(resp)
    resp.set_cookie("pid", pid)

    return resp


@app.route("/ListPokemon/<username>", methods=["GET"])
def ListPokemon(username):
    """Return a list of Pokemon stats as a JSON object.

    Args:
        username (str): the username

    Returns:
        pokemon_list (json): a list of Pokemon as a JSON object
    """
    print(f"Generating Pokemon list for user: {username}")

    pokemon_ids = get_pokemon_ids_from_player(username)
    pokemon_list = [get_pokemon_from_id(pokemon_id) for pokemon_id in pokemon_ids]

    return pokemon_list


@app.route("/CreatePokemon/<username>", methods=["POST"])
def CreatePokemon(username):
    """Create a new Pokemon."""
    print(f"Creating new Pokemon for: {username}")

    # Load image
    img_raw = request.files["img"].read()
    img_name = hash(img_raw)
    img_path = (
        f"images/pokemon/uploaded_images/{img_name}.jpg"  # Path from the public folder
    )
    with open(PATH_TO_PUBLIC + img_path, "wb") as file:
        file.write(img_raw)
    # TODO: Add a new try, catch. Send to frontend, and make an error there.

    # Generate Pokemon
    print("Generating Pokemon.")
    for i in range(3):
        try:
            pokemon = build_pokemon(img_path)
            pokemon_id = pokemon.save(database)
            print(f"Pokemon created successfully. id: {pokemon_id}")
            break
        except GeminiError:
            print(f"Error creating Pokemon for: {username}. Attempt: {i}. Retrying...")
        except AttributeError:
            print(
                f"Error parsing Pokemon for: {username}. Attempt: {i}. Retrying..."
            )  # Sometimes the regex fails when parsing attacks
    else:
        try:
            print(
                f"Failed to create Pokemon for: {username}. Returning Errormon instead."
            )
            pokemon = Pokemon.load(database, ERRORMON_ID)
        except:
            print(f"Failed to load Erromon for: {username}. No Errormon found.")
            raise CreationError("Failed to create Pokemon.")

    print(f"Saving Pokemon: {pokemon_id} to user: {username}")
    database.players.update_one(
        {"username": username}, {"$push": {"pokemon_ids": pokemon_id}}
    )

    resp = jsonify(success=True)

    return resp
