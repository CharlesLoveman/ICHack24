"""Test MongoDB inside Gcloud."""
from pymongo import MongoClient
from dotenv import dotenv_values
import os

config = dotenv_values(".prod" if os.getenv("FLASK_ENV") == "prod" else ".dev")

MONGO_KEY = config["MONGO_KEY"]
MONGO_IP = config["MONGO_IP"]

print(MONGO_KEY)
print(MONGO_IP)

mongodb_client = MongoClient(f"mongodb://ic-hack-admin:{MONGO_KEY}@{MONGO_IP}:27017")

database = mongodb_client["test"]
users = database.users
id = users.insert_one({"name": "test"}).inserted_id
print(id)
