from .db import get_pokemon_by_name
from .sharedTypes import PokemonStats
from .env import POKEMON_FOLDER
from .attack import generate_attack
from .pokemon import Pokemon


class ErrormonException(Exception):
    pass


def get_errormon_id():
    try:
        errormon = get_pokemon_by_name("Errormon")
        print(f"Errormon found with id {errormon["id"]}")
        return errormon["id"]
    except:
        print("Errormon not found; attempting to create.")
        return create_errormon()


def create_errormon():
    stats: PokemonStats = {
        "id": "--",
        "hp": 1,
        "attack": 1,
        "defence": 1,
        "special_attack": 1,
        "special_defence": 1,
        "speed": 1,
    }

    glitch_attack = generate_attack("Glitch Cannon", "Ghost", "physical", "")
    bsod_attack = generate_attack("Blue Screen of Doom", "Electric", "special", "")
    null_attack = generate_attack("Null Pointer Exception", "Dark", "status", "")
    segfault_attack = generate_attack("Segmentation Fault", "Psychic", "special", "")

    attacks = [glitch_attack, bsod_attack, null_attack, segfault_attack]
    image_id = f"{POKEMON_FOLDER}/../protected/errormon.jpg"

    pokemon = Pokemon(
        name="Errormon",
        description="""
        The Error Pokemon! Something must have gone wrong. Errormon is said to 
        be the result of a corrupted Pokemon transfer gone wrong. Its glitching 
        abilities make it a formidable opponent, but also prone to unpredictable 
        behavior. Trainers who capture Errormon often find themselves dealing 
        with a mischievous and unreliable companion.
                      """,
        element="Bug",
        stats=stats,
        attacks=attacks,
        image_id=image_id,
        original_image_id=image_id,
    )

    return pokemon.save()
