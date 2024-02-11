"""Flask app for the backend."""

from flask import Flask, make_response, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit
from random import randrange

from .pokemon import Battle, Pokemon
from .api import build_pokemon
from pymongo import MongoClient
from dotenv import dotenv_values
import os
from bson.objectid import ObjectId
from api import load_image_from_file
import jsonpickle

config = dotenv_values(".prod" if os.getenv("FLASK_ENV") == "prod" else ".dev")

print(config["MONGO_KEY"])
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
    socketio.run(app)


def get_player_by_cookie():
    pid = request.cookies.get("pid")
    _id = ObjectId(pid)
    player = database.player.find_one({"_id": _id})
    return player


def get_player_by_username(username):
    player = database.player.find_one({"username": username})
    return player


def get_pokemon_from_player(player):
    pokemon_list = jsonpickle.decode(player["pokemon"])
    return pokemon_list


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
    emit(
        "joinBattle",
        {
            "self_pokemon": battles[json["game_id"]].p2,
            "target_pokemon": battles[json["game_id"]].p1,
        },
        to=request.sid,
    )
    emit(
        "joinBattleFromRoom",
        {
            "self_pokemon": battles[json["game_id"]].p1,
            "target_pokemon": battles[json["game_id"]].p2,
        },
        to=battles[json["game_id"]].player1,
    )


@socketio.on("attack")
def handle_attack(json):
    battles[json["game_id"]].handle_event("attack", json, request.sid, database)


@app.route("/InitialiseUser/<username>", methods=["POST"])
def InitialiseUser(username):
    id = username  # Change this
    # init_pokemon_json = jsonify(init_pokemon_dict)
    # print(init_pokemon_json)
    player = get_player_by_username(username)
    if player is None:
        init_pokemon_dict = {"pokemon": jsonpickle.encode([]), "username": username}
        id = str(database.player.insert_one(init_pokemon_dict).inserted_id)
    resp = jsonify(success=True)
    resp = make_response(resp)
    resp.set_cookie("pid", id)
    return resp


@app.route("/ListPokemon/<player>", methods=["GET"])
def ListPokemon(player):
    player = get_player_by_username(player)
    pokemon_list = get_pokemon_from_player(player)

    return jsonpickle.encode(pokemon_list)
    # Change this later so you load from the pokemon table/ collection
    return [
        {
            "name": "Squirtle",
            "element": "a bit wet",
            "description": "best boy 1997",
            "stats": {"attack": 0},
        }
    ]


@app.route("/CreatePokemon/<player_id>", methods=["POST"])
def CreatePokemon(player_id):
    print("abcd")
    print(player_id)
    player = get_player_by_username(player_id)  # Because cookies don't work for now.
    # print("Player: " + str(player))
    print("abcd")
    img_raw = request.files["img"].read()
    print("abcd")
    img_name = hash(img_raw)
    print("abcd")
    img_path = f"{img_name}.jpg"
    with open(img_path, "wb") as file:
        file.write(img_raw)
    print("abcd")
    img = load_image_from_file(img_path)
    print("abcd")
    pokemon = build_pokemon(img)
    print("abcd")
    pokemon_list = jsonpickle.decode(player["pokemon"])
    pokemon_list.append(pokemon)
    database.player.update_one(
        {"username": player_id}, {"$set": {"pokemon": jsonpickle.encode(pokemon_list)}}
    )
    print("abcd")
    print(pokemon)
    resp = jsonify(success=True)
    return resp
