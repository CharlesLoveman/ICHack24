""""""

from Backend.pokemon import Pokemon, generate_attack
from pymongo import MongoClient
from PIL import Image as PILImage

# MongoDB setup
ip = "127.0.0.1"
mongodb_client = MongoClient(ip, 27017)
db = mongodb_client["ic-hack"]

# Setup values
stats = {
    "hp": 1,
    "attack": 1,
    "defence": 1,
    "special_attack": 1,
    "special_defence": 1,
    "speed": 1,
}

glitch_attack = generate_attack("Glitch Cannon", "Ghost", "physical")
bsod_attack = generate_attack("Blue Screen of Doom", "Electric", "special")
null_attack = generate_attack("Null Pointer Exception", "Dark", "status")
segfault_attack = generate_attack("Segmentation Fault", "Psychic", "special")

attacks = [glitch_attack, bsod_attack, null_attack, segfault_attack]
image = PILImage.open("../TestImages/errormon.jpg")

# Create the Pokemon
pokemon = Pokemon(
    "Errormon",
    "The Error Pokemon! Something must have gone wrong. Errormon is said to "
    "be the result of a corrupted Pokemon transfer gone wrong. Its glitching "
    "abilities make it a formidable opponent, but also prone to unpredictable "
    "behavior. Trainers who capture Errormon often find themselves dealing "
    "with a mischievous and unreliable companion.",
    "Bug",
    stats,
    attacks,
    image,
)

# Save the Pokemon
print(f"Errormon id: {pokemon.save(db)}")
