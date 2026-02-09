"""API for interfacing with the vision pipeline."""

from .env import POKEMON_FOLDER
from .internal_types import (
    ExtendedPokemonStats,
    OptionalExtendedPokemonStats,
)
from gemini import RealGenerativeModel
from gemini_mock import MockGenerativeModel
from .prompt_templates import (
    GEMINI_PROMPT_TEMPLATE,
    GEMINI_PROMPT_TEMPLATE_WITH_IMAGE,
    GEMINI_PROMPT_TEMPLATE_ATTACKS,
)
from .image_processing import generate_image
from .pokemon import Pokemon
from .attack import Attack, generate_attack

import re
from typing import Tuple, List, cast
from env import PATH_TO_PUBLIC, USE_REAL_MODEL


if USE_REAL_MODEL == "True":
    new_model = RealGenerativeModel()
else:
    new_model = MockGenerativeModel()


STATS_KEYS = [
    "Type",
    "HP",
    "Attack",
    "Defence",
    "Special Attack",
    "Special Defence",
    "Speed",
]


class GeminiError(Exception):
    """Raised when an error occurs with the Gemini API."""

    pass


def create_pokemon(
    img_path: str, create_image: bool = False, return_prompt: bool = False
) -> Tuple[str, str, ExtendedPokemonStats, str | None, str | None]:
    """Create a new pokemon from an image.

    Args:
        prompt (str): The prompt to use to create the pokemon.
        img_path (str): The path to the image to use to create the pokemon.
        create_image (bool): Whether to create an image of the pokemon.
        return_prompt (bool): Whether to return the prompt.

    Returns:
        details (dict): The details of the created pokemon.
    """
    if create_image:
        template = GEMINI_PROMPT_TEMPLATE_WITH_IMAGE
        cat_names = ["Name", "Pokedex", "Stats", "Image Prompt"]
    else:
        template = GEMINI_PROMPT_TEMPLATE
        cat_names = ["Name", "Pokedex", "Stats"]
    response, feedback = new_model.get_gemini_response(template, img_path=img_path)
    sections: list[str] = []

    for key in cat_names:

        match = re.search(
            rf"\[Start Output {key}\](.*)\[End Output {key}\]", response, re.DOTALL
        )
        if match:
            sections.append(match.group(1).strip())
    name = None

    # Extract the name
    name_match = re.search(r"Name:(.*)", sections[0])
    if name_match:
        name = name_match.group(1).strip()
    name = cast(str, name)  # Asserting that the name exists

    # Extract the pokedex entry
    pokedex_description = cast(str, sections[1])
    # Extract the stats
    optional_stats: OptionalExtendedPokemonStats = {}
    for key in STATS_KEYS:
        value = None
        match_value = re.search(rf"{key}:(.*)", sections[2])
        if match_value:
            value = match_value.group(1).strip()

        corrected_key = key.lower().replace(" ", "_")

        if value:
            if key == "Type":
                optional_stats[corrected_key] = value
            else:
                optional_stats[corrected_key] = int(value)
    stats = cast(
        ExtendedPokemonStats, optional_stats
    )  # Assert that every single stat has been filled
    if create_image:
        # Extract the image prompt
        image_prompt = sections[3]

        raise NotImplementedError("Image creation hasn't been implemented yet")

        # Generate the image
        img = generate_image(image_prompt)
        img_name = hash(img)
        img_path = f"{POKEMON_FOLDER}/{img_name}.jpg"

        img.save(PATH_TO_PUBLIC + img_path)

        if return_prompt:
            return name, pokedex_description, stats, img_path, image_prompt
        else:
            return name, pokedex_description, stats, img_path, None

    else:
        return name, pokedex_description, stats, None, None


def create_attacks(name: str, pokedex: str, element: str) -> List[Attack]:
    """Create attacks for a pokemon.

    Args:
        name (str): The name of the pokemon.
        pokedex (str): The pokedex entry of the pokemon.
        element (str): The element of the pokemon.

    Returns:
        attacks (list): The attacks for the pokemon.
    """

    prompt = GEMINI_PROMPT_TEMPLATE_ATTACKS.format(name, pokedex, element)
    response, feedback = new_model.get_gemini_response(prompt)

    # Extract the attack names, categories and types
    attack_responses = []
    for key in range(1, 5):
        match = re.search(
            rf"\[Start Attack {key}\](.*)\[End Attack {key}\]", response, re.DOTALL
        )
        if match is not None:
            attack_responses.append(match.group(1).strip())

    attacks = []

    for attack in attack_responses:
        attack_name = None
        category = None
        attack_element = None
        description = None

        name_match = re.search(r"Name:(.*)", attack)
        if name_match:
            attack_name = name_match.group(1).strip()

        category_match = re.search(r"Category:(.*)", attack)
        if category_match:
            category = category_match.group(1).strip().lower()

        element_match = re.search(r"Type:(.*)", attack)
        if element_match:
            element = element_match.group(1).strip().capitalize()
            attack_element = element.split("/")[0]

        description_match = re.search(r"Description:(.*)", attack)
        if description_match:
            description = description_match.group(1)

        # This casting is dangerous, but we do so to be lenient, and because generate_attack handles the types well enough
        attacks.append(
            generate_attack(
                cast(str, attack_name),
                cast(str, attack_element),
                cast(str, category),
                cast(str, description),
            )
        )

    return attacks


def build_pokemon(original_img_path: str, create_image=False) -> Pokemon:
    """Build a pokemon from its details.

    Args:
        img_path (str): The path to the image of the pokemon.
        create_image (bool): Whether to create an image of the pokemon.

    Returns:
        pokemon (Pokemon): The pokemon built from its details.
    """

    img_path = original_img_path
    new_img_path = None

    if create_image:
        name, pokedex, stats, new_img_path, _ = create_pokemon(img_path, create_image)
    else:
        name, pokedex, stats, _, _ = create_pokemon(img_path, create_image)

    element: str = stats["type"]
    stats.pop("type")

    attacks = create_attacks(name, pokedex, element)
    try:
        element = element.split("/")[0].capitalize()
    except:
        raise GeminiError("Gemini API returned an invalid response.")

    if new_img_path:
        img_path = new_img_path

    return Pokemon(name, pokedex, element, stats, attacks, img_path, original_img_path)
