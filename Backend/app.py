"""Flask app for the backend."""

from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit
from random import randrange

from pokemon import Battle, Pokemon
from pymongo import MongoClient

from api import build_pokemon, load_image_from_file

mongodb_client = MongoClient("localhost", 27017)
database = mongodb_client["ICHack"]
users = {}

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
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
    emit("joinBattle", {"self_pokemon": battles[json["game_id"]].p2, "target_pokemon": battles[json["game_id"]].p1}, to=request.sid)
    emit("joinBattleFromRoom", {"self_pokemon": battles[json["game_id"]].p1, "target_pokemon": battles[json["game_id"]].p2}, to=battles[json["game_id"]].player1)

@socketio.on("attack")
def handle_attack(json):
    battles[json["game_id"]].handle_event("attack", json, request.sid, database)


@app.route("/ListPokemon/<player>", methods=["GET"])
def ListPokemon(player):
    player = database.player.find_one({"id": player})
    return [Pokemon.load(database, id) for id in player.pokemon]
    

@app.route("/CreatePokemon/<player_id>", methods=["POST"])
def CreatePokemon(player_id):
    player = database.players.find_one({"id": player_id})
    img = request.files["img"]
    file = open("imgFile", 'wb')
    img.save(file)
    file.close()
    img_input = load_image_from_file("imgFile")
    pokemon = build_pokemon(img_input, create_image=True)
    player.pokemon = player.pokemon.append(pokemon)
    database.players.update_one({"id": player_id}, player)
    return {}
