from pymongo import MongoClient
import os

MONGO_KEY = os.environ.get("MONGO_KEY")
MONGO_IP = os.environ.get("MONGO_IP")

mongodb_client = MongoClient(f"mongodb://ic-hack-admin:{MONGO_KEY}@{MONGO_IP}:27017")

database = mongodb_client["test"]
users = database.users
id = users.insert_one({"name": "test"}).inserted_id
print(id)
