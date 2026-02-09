"""Flask app for the backend."""

from sharedTypes import *

from .server import socketio
from sharedTypes import *
from .socketOn import *


if __name__ == "__main__":
    socketio.run(
        app, port=5000, host="0.0.0.0", use_reloader=False
    )  # Reloader enables hot reload, but in return sometimes runs things multiple times
