from .errormon import ErrormonException, get_errormon_id
from .api import GeminiError, build_pokemon
from .pokemon import Pokemon
from .db import (
    add_pokemon_to_user,
)


class CreationError(Exception):
    """Raised when a Pokemon cannot be created."""

    pass


def generate_pokemon(username: str, img_path: str):
    """Generate a Pokemon from an image and add it to the user's collection.

    Attempts to create a Pokemon using the generative model. If creation fails,
    it falls back to assigning 'Errormon' to the user.

    Args:
        username (str): The username of the player.
        img_path (str): The path to the image used for generation.

    Raises:
        ErrormonException: If generation fails but Errormon is successfully assigned.
        CreationError: If generation fails and Errormon cannot be assigned.
    """
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
