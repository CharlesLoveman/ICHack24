"""Flask app for the backend."""

from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit
from random import randrange
#from pymongo import MongoClient

#mongodb_client = MongoClient("localhost", 27017)
#database = mongodb_client["ICHack"]

app = Flask(__name__)
CORS(app, resources={r"/app": {"origins": '*'}})
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_credentials=True, cors_allowed_origins='*')

if __name__ == '__main__':
    socketio.run(app)

@socketio.on('message')
def handle_message(message):
    send(message)

@socketio.on('json')
def handle_json(json):
    send(json, json=True)

@socketio.on('createPokemon')
def handle_my_custom_event(json):
    emit('createPokemonCard', {"name": "Squirtle", "element": "a bit wet", "description": "best boy 1997", "stats": {"attack": 0}})

@socketio.on('createBattle')
def handle_createBattle(json):
    #game_id = createGame(json.id)
    game_id = randrange(0, 1000000)
    emit('joinWaitingRoom', {"game_id": game_id})



#@app.route("/", methods=["GET"])
#def hello_world():
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
