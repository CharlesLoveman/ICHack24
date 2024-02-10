import json

init_pokemon_dict = {}
init_pokemon_dict["id"] = "12"
init_pokemon_dict["pokemon"] = {}
init_pokemon_list = json.dumps(init_pokemon_dict)
print(init_pokemon_list)
