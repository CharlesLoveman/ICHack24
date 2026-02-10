import os
from sharedTypes import *
from flask import Flask
from flask_cors import CORS

from env import FLASK_SECRET_KEY, PATH_TO_PUBLIC, POKEMON_FOLDER

from flask_socketio import SocketIO


py_cors_or = "*"

if not os.path.exists(PATH_TO_PUBLIC + POKEMON_FOLDER):
    os.makedirs(PATH_TO_PUBLIC + POKEMON_FOLDER)
    print(f"Path {PATH_TO_PUBLIC + POKEMON_FOLDER} created successfully!")


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": py_cors_or}})
app.config["SECRET_KEY"] = (
    FLASK_SECRET_KEY  # This is required to access some sort of Flask debug thing
)

socketio = SocketIO(
    app,
    cors_credentials=True,
    cors_allowed_origins=py_cors_or,
)
