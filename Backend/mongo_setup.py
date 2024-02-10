from pymongo import MongoClient

ip = "34.89.65.167"
ip = "127.0.0.1"


mongodb_client = MongoClient(ip, 27017)
database = mongodb_client["ic-hack"]
print(database.test.find_one() + "hello")
print("connected")
