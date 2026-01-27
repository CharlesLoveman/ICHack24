"""Flask app for the backend."""

from typing import List, Dict
from sharedTypes import *
from flask import Flask, make_response, jsonify, Response
from flask_cors import CORS

from env import FLASK_SECRET_KEY

from .pokemon import Battle, Pokemon
from .api import GeminiError, build_pokemon, PATH_TO_PUBLIC
from .db import (
    get_player_by_username,
    get_pokemon_from_id,
    get_pokemon_ids_from_player,
    players_collection,
    request,
)
from flask_socketio import SocketIO
import json
import base64

from sharedTypes import *

battles: Dict[str, Battle] = {}

ERRORMON_ID = None  # Run create_errormon.py and set this!

py_cors_or = "*"
sock_cors_or = "*"

# ip = "http://localhost:3000"
# py_cors_or = f"{ip}"
# sock_cors_or = py_cors_or


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": py_cors_or}})
app.config["SECRET_KEY"] = (
    FLASK_SECRET_KEY  # This is required to access some sort of Flask debug thing
)

socketio = SocketIO(app, cors_credentials=True, cors_allowed_origins=py_cors_or)

from .socketOn import *


if __name__ == "__main__":
    socketio.run(app, port=5000, host="0.0.0.0")


class CreationError(Exception):
    """Raised when a Pokemon cannot be created."""

    pass


def bytes_to_json(bytes: bytes) -> str:
    b64bytes = base64.b64encode(bytes)
    strbytes = b64bytes.decode("utf-8")
    return json.dumps(strbytes)


@app.route("/ListPokemon/<username>", methods=["GET"])
def ListPokemon(username: str) -> List[Pokemon]:
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
def CreatePokemon(username: str) -> Response:
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
            pokemon_id = pokemon.save()
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
            pokemon = Pokemon.load(ERRORMON_ID)
        except:
            print(f"Failed to load Erromon for: {username}. No Errormon found.")
            raise CreationError("Failed to create Pokemon.")

    print(f"Saving Pokemon: {pokemon_id} to user: {username}")
    players_collection.update_one(
        {"username": username}, {"$push": {"pokemon_ids": pokemon_id}}
    )

    resp = jsonify(success=True)

    return resp
