"""Flask app for the backend."""

from flask import Flask, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def hello_world():
    members = request.args.getlist("members[]")
    results = []
    results.append(
        {
            "id": 1,
            "title": 1,
            "rating": 1,
            "image_url": 1,
        }
    )

    print("Done!")

    return results
