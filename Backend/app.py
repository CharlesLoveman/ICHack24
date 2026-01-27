"""Flask app for the backend."""

from typing import List, Dict
from sharedTypes import *
from flask import Flask, jsonify, Response
from flask_cors import CORS

from env import FLASK_SECRET_KEY

from .pokemon import Battle, Pokemon
from .db import (
    get_pokemon_from_id,
    get_pokemon_ids_from_player,
)
from flask_socketio import SocketIO
import json
import base64

from sharedTypes import *

battles: Dict[str, Battle] = {}


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

socketio = SocketIO(
    app,
    cors_credentials=True,
    cors_allowed_origins=py_cors_or,
    max_http_buffer_size=1000000000,
)

from .socketOn import *


if __name__ == "__main__":
    socketio.run(app, port=5000, host="0.0.0.0")


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
