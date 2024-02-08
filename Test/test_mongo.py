from pymongo import MongoClient
import os

MONGO_KEY = os.environ.get("MONGO_KEY")

mongodb_client = MongoClient(f"mongodb://ic-hack-admin:{MONGO_KEY}@10.154.0.13:27017")

database = mongodb_client["test"]
users = database.users
id = users.insert_one({"name": "test"}).inserted_id
print(id)
