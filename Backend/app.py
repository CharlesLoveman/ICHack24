"""Flask app for the backend."""

import os
from typing import Dict
from sharedTypes import *
from flask import Flask
from flask_cors import CORS

from env import FLASK_SECRET_KEY, PATH_TO_PUBLIC, POKEMON_FOLDER

from .battle import Battle
from flask_socketio import SocketIO

from sharedTypes import *

battles: Dict[str, Battle] = {}


py_cors_or = "*"
sock_cors_or = "*"

# ip = "http://localhost:3000"
# py_cors_or = f"{ip}"
# sock_cors_or = py_cors_or

if not os.path.exists(PATH_TO_PUBLIC + POKEMON_FOLDER):
    os.makedirs(PATH_TO_PUBLIC + POKEMON_FOLDER)
    print(f"Path {PATH_TO_PUBLIC + POKEMON_FOLDER} created successfully!")
else:
    print("hi")


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
