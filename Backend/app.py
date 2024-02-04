"""Flask app for the backend."""

from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit
from random import randrange

from .pokemon import Battle
from .manage_db import Database, DatabaseWrapper

pokemon_db = Database("pokemon_db.pkl")
attacks_db = Database("attacks_db.pkl")
db = DatabaseWrapper(pokemon=pokemon_db, attacks=attacks_db)

users = {}

app = Flask(__name__)
CORS(app, resources={r"/app": {"origins": "*"}})
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app, cors_credentials=True, cors_allowed_origins="*")

battles = {}

if __name__ == "__main__":
    socketio.run(app)


@socketio.on("message")
def handle_message(message):
    send(message)


@socketio.on("json")
def handle_json(json):
    send(json, json=True)


@socketio.on("createPokemon")
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
    # game_id = createGame(json.id)
    print(request.sid)
    game_id = str(randrange(0, 1000000))
    battles[game_id] = Battle(request.sid, json["pokemon_id"])
    users[request.sid] = request.sid
    emit("joinWaitingRoom", {"game_id": game_id})


@socketio.on("joinBattle")
def handle_joinBattle(json):
    print(request.sid)
    battles[json["game_id"]].add_player(request.sid, json["pokemon_id"])
    emit("joinBattle", {})

@socketio.on("attack")
def handle_attack(json):
    battles[json["game_id"]].handle_event("attack", json, request.sid, database)





# @app.route("/", methods=["GET"])
# def hello_world():
#    members = request.args.getlist("members[]")
#    results = []
#    results.append(
#        {
#            "id": 1,
#            "title": 1,
#            "rating": 1,
#            "image_url": 1,
#        }
#    )
#
#    print("Done!")
#
#    return results
