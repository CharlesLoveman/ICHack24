def a():
    import json

    init_pokemon_dict = {}
    init_pokemon_dict["id"] = "12"
    init_pokemon_dict["pokemon"] = {}
    init_pokemon_list = json.dumps(init_pokemon_dict)
    print(init_pokemon_list)


def b():
    from api import load_image_from_file, get_gemini_response, GEMINI_PROMPT_TEMPLATE_WITH_IMAGE

    img = load_image_from_file(f"TestImages/{"banana"}.jpg")
    response = get_gemini_response(GEMINI_PROMPT_TEMPLATE_WITH_IMAGE, img)
    print(response)


def c():
    from api import build_pokemon
    from api import load_image_from_file
    img = load_image_from_file(f"TestImages/{"banana"}.jpg")
    return build_pokemon(img)

def d():
    from pymongo import MongoClient
    from bson.objectid import ObjectId
    ip = "127.0.0.1"
    # Change this back
    mongodb_client = MongoClient(ip, 27017)
    database = mongodb_client["ic-hack"]
    #pid = '65c7e3dd1b5e57515fc0cb60'
    #_id = ObjectId(pid)
    #player = database.player.find_one({"_id": _id})
    player = database.player.find_one({"username":"852428"})
    print(player)

    for poke in player["pokemon"]:
        print(poke)
        print("a")

def e(pokemon):
    from pymongo import MongoClient
    ip = "127.0.0.1"
    # Change this back
    mongodb_client = MongoClient(ip, 27017)
    database = mongodb_client["ic-hack"]
    # pokemon = """Pokemon('Bananab', 'Bananab, the Banana Pokemon\n\nA Grass/Fairy type Pokemon that evolves from Oddish when exposed to a Leaf Stone. Bananab is a mischievous Pokemon that loves to play pranks on its friends. It is also very protective of its loved ones and will not hesitate to defend them against any threat.', 'Grass', {'hp': 65, 'attack': 65, 'defence': 90, 'special_attack': 135, 'special defence': 90, 'speed': 100}, [Attack('Banana Barrage', 'Grass', 6, False, {}, {}), Attack('Fairy Wind', 'Fairy', 55, True, {}, {}), Attack("Prankster's Play", 'Grass', 0, False, {'hp': 38}, {'special defence': 60}), Attack('Banana Blitz', 'Grass', 255, False, {}, {})], <vertexai.generative_models._generative_models.Image object at 0x0000024083E60170>)"""
    pokemon_list = []
    pokemon_list = pokemon_list.append(pokemon)
    username = "852428"
    database.player.update_one(
        {"username": username}, {"$set": {"pokemon": pokemon_list}}
    )

def f():
    from pokemon import Pokemon, Attack
    json_stats = """{"hp": 65, "attack": 65, "defence": 90, "special_attack": 135, "special defence":  6, "speed":100}"""
    from json import loads
    stats = loads(json_stats)
    a = Attack("a","Grass")
    attacks = [a,a,a,a]
    image = "unknown"

    p = Pokemon("Errormon!", "The Banana Pokemon", "Grass", stats, attacks, image)
    return p


def g():
    from jsonpickle import encode

    poke = f()

    e(encode(poke))
    print("hi") 


def h():
    from pymongo import MongoClient
    ip = "127.0.0.1"
    # Change this back
    print("hey")
    mongodb_client = MongoClient(ip, 27017)
    database = mongodb_client["ic-hack"]
    username = "115856"
    player = database.player.find_one({"username": username})
    pokemon_list = player["pokemon"]
    pokemon = f()
    if pokemon_list is None:
        pokemon_list = []
        print(pokemon_list)
    pokemon_list.append(pokemon)
    print(pokemon_list)
    database.player.update_one(
        {"username": username}, {"$set": {"pokemon": pokemon_list}}
    )

h()
