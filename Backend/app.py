from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
CORS(app, resources={r"/app": {"origins": "*"}})
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_credentials=True, cors_allowed_origins="*")

if __name__ == '__main__':
    socketio.run(app)

@socketio.on('message')
def handle_message(message):
    send(message)

@socketio.on('json')
def handle_json(json):
    send(json, json=True)

@socketio.on('foo')
def handle_my_custom_event(json):
    emit('foo', json)
    #print(json)
    #send('foo')



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
