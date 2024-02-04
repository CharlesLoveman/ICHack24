from pymongo import MongoClient

mongodb_client = MongoClient("10.154.0.13", 27017)
database = mongodb_client["ic-hack"]
print("connected")
