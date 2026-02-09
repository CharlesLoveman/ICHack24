from .errormon import ErrormonException, get_errormon_id
from .api import GeminiError, build_pokemon
from .pokemon import Pokemon
from .db import (
    add_pokemon_to_user,
    players_collection,
)


class CreationError(Exception):
    """Raised when a Pokemon cannot be created."""

    pass


def generate_pokemon(username: str, img_path: str):
    # Generate Pokemon
    print(f"Generating Pokemon for {username}")
    pokemon_id: str | None = None
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
        except Exception as e:
            print(e)
    else:
        try:
            print(
                f"Failed to create Pokemon for: {username}. Returning Errormon instead."
            )
            pokemon = Pokemon.load(get_errormon_id())
            pokemon_id = pokemon.id
            add_pokemon_to_user(username, pokemon_id)
            raise ErrormonException()
        except ErrormonException:
            raise ErrormonException()
        except:
            print(f"Failed to load Erromon for: {username}. No Errormon found.")
            raise CreationError("Failed to create Pokemon.")

    if pokemon_id:
        add_pokemon_to_user(username, pokemon_id)
