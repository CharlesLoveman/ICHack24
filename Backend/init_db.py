from pymongo import MongoClient
from pokemon import Pokemon, Attack

mongodb_client = MongoClient("localhost", 27017)
database = mongodb_client["ICHack"]
print("connected")

pokemon = Pokemon(
    "Togepi",
    "Based pokemon",
    "Normal",
    {"hp": 100, "attack": 101, "defense": 102, "special_attack": 103, "special_defense": 104, "speed": 105},
    [Attack("HyperBeam1", "Dragon", 100, True, {"hp": 100, "attack": 101, "defense": 102, "special_attack": 103, "special_defense": 104, "speed": 105}, {"hp": -100, "attack": -101, "defense": -102, "special_attack": -103, "special_defense": -104, "speed": -105}),
     Attack("HyperBeam2", "Dragon", 100, True, {"hp": 100, "attack": 101, "defense": 102, "special_attack": 103, "special_defense": 104, "speed": 105}, {"hp": -100, "attack": -101, "defense": -102, "special_attack": -103, "special_defense": -104, "speed": -105}),
     Attack("HyperBeam3", "Dragon", 100, True, {"hp": 100, "attack": 101, "defense": 102, "special_attack": 103, "special_defense": 104, "speed": 105}, {"hp": -100, "attack": -101, "defense": -102, "special_attack": -103, "special_defense": -104, "speed": -105}),
     Attack("HyperBeam4", "Dragon", 100, True, {"hp": 100, "attack": 101, "defense": 102, "special_attack": 103, "special_defense": 104, "speed": 105}, {"hp": -100, "attack": -101, "defense": -102, "special_attack": -103, "special_defense": -104, "speed": -105})],
    "img"
    )

id = pokemon.save(database)

pokemon2 = Pokemon.load(database, id)
print(pokemon2)