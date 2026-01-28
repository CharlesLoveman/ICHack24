from .api import GeminiError, build_pokemon
from .pokemon import Pokemon
from .db import (
    players_collection,
)


class CreationError(Exception):
    """Raised when a Pokemon cannot be created."""

    pass


ERRORMON_ID = None  # Run create_errormon.py and set this!


def generate_pokemon(username: str, img_path: str):
    # Generate Pokemon
    print(f"Generating Pokemon for ${username}")
    for i in range(1):
        try:
            pokemon = build_pokemon(img_path)
            pokemon_id = pokemon.save()
            print(f"Pokemon created successfully. id: {pokemon_id}")
            break
        except GeminiError:
            print(f"Error creating Pokemon for: {username}. Attempt: {i}. Retrying...")
        except AttributeError:
            print(
                f"Error parsing Pokemon for: {username}. Attempt: {i}. Retrying..."
            )  # Sometimes the regex fails when parsing attacks
    else:
        try:
            print(
                f"Failed to create Pokemon for: {username}. Returning Errormon instead."
            )
            pokemon = Pokemon.load(ERRORMON_ID)
        except:
            print(f"Failed to load Erromon for: {username}. No Errormon found.")
            raise CreationError("Failed to create Pokemon.")

    print(f"Saving Pokemon: {pokemon_id} to user: {username}")
    players_collection.update_one(
        {"username": username}, {"$push": {"pokemon_ids": pokemon_id}}
    )
