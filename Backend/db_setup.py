import pickle

a = {}

paths = ["pokemon_db.pkl", "attack_db.pkl"]

for path in paths:
    with open(path, "wb") as f:
        pickle.dump(a, f)