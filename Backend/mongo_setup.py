from pymongo import MongoClient

mongodb_client = MongoClient("34.89.65.167", 27017)
database = mongodb_client["ic-hack"]
print(database.user.find_one() + "hello")
print("connected")
