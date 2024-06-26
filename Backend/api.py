"""API for interfacing with the vision pipeline."""

from .prompt_templates import (
    GEMINI_PROMPT_TEMPLATE,
    GEMINI_PROMPT_TEMPLATE_WITH_IMAGE,
    GEMINI_PROMPT_TEMPLATE_ATTACKS,
)
from .image_processing import generate_image, pixelate_image
from .pokemon import Pokemon, generate_attack
import vertexai
from vertexai.preview.generative_models import GenerativeModel, Image
import re


vertexai.init(project="crucial-bucksaw-413121")
model = GenerativeModel("gemini-pro")
vision_model = GenerativeModel("gemini-pro-vision")

STATS_KEYS = [
    "Type",
    "HP",
    "Attack",
    "Defence",
    "Special Attack",
    "Special Defence",
    "Speed",
]
PATH_TO_PUBLIC = "../Frontend/app/public/"


class GeminiError(Exception):
    """Raised when an error occurs with the Gemini API."""

    pass


def load_image_from_file(file_path):
    """Load an image from a file.

    Args:
        file_path (str): The path to the image file.

    Returns:
        img (Image): The image loaded from the file.
    """
    return Image.from_bytes(open(file_path, "rb").read())


def get_gemini_response(template, img=None, safety_feedback=False):
    """Get a response from the Gemini model.

    Args:
        template (str): The prompt to use to get a response.
        img (PIL.Image): The image to use to get a response.
        safety_feedback (bool): Whether to get safety feedback.

    Returns:
        response (str): The response from the Gemini model.
    """
    if img is None:
        response = model.generate_content([template])
    else:
        response = vision_model.generate_content([img, template])

    if safety_feedback:
        return response.text, response.prompt_feedback
    else:
        return response.text


def create_pokemon(img_path, create_image=False, return_prompt=False):
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

    img = load_image_from_file(PATH_TO_PUBLIC + img_path)

    response = get_gemini_response(template, img)

    sections = [
        re.search(
            rf"\[Start Output {key}\](.*)\[End Output {key}\]", response, re.DOTALL
        )
        .group(1)
        .strip()
        for key in cat_names
    ]

    # Extract the name
    name = re.search(r"Name:(.*)", sections[0]).group(1).strip()

    # Extract the pokedex entry
    pokedex = sections[1]

    # Extract the stats
    stats = dict()
    for key in STATS_KEYS:
        value = re.search(rf"{key}:(.*)", sections[2]).group(1).strip()

        if key == "Type":
            stats[key.lower()] = value
        else:
            stats[key.lower()] = int(value)

    if create_image:
        # Extract the image prompt
        image_prompt = sections[3]

        # Generate the image
        img = generate_image(image_prompt)
        img_name = hash(img)
        img_path = f"images/pokemon/uploaded_images/{img_name}.jpg"

        img.save(PATH_TO_PUBLIC + img_path)

        if return_prompt:
            return name, pokedex, stats, img_path, image_prompt
        else:
            return name, pokedex, stats, img_path

    else:
        return name, pokedex, stats


def create_attacks(name, pokedex, element):
    """Create attacks for a pokemon.

    Args:
        name (str): The name of the pokemon.
        pokedex (str): The pokedex entry of the pokemon.
        element (str): The element of the pokemon.

    Returns:
        attacks (list): The attacks for the pokemon.
    """

    prompt = GEMINI_PROMPT_TEMPLATE_ATTACKS.format(name, pokedex, element)
    response = get_gemini_response(prompt)

    # Extract the attack names, categories and types
    attack_responses = [
        re.search(
            rf"\[Start Attack {key}\](.*)\[End Attack {key}\]", response, re.DOTALL
        )
        .group(1)
        .strip()
        for key in range(1, 5)
    ]

    attacks = []
    for attack in attack_responses:
        name = re.search(r"Name:(.*)", attack).group(1).strip()
        category = re.search(r"Category:(.*)", attack).group(1).strip().lower()
        element = re.search(r"Type:(.*)", attack).group(1).strip().capitalize()
        element = element.split("/")[0]

        attacks.append(generate_attack(name, element, category))

    return attacks


def build_pokemon(original_img_path, create_image=False):
    """Build a pokemon from its details.

    Args:
        img_path (str): The path to the image of the pokemon.
        create_image (bool): Whether to create an image of the pokemon.

    Returns:
        pokemon (Pokemon): The pokemon built from its details.
    """

    img_path = original_img_path

    if create_image:
        name, pokedex, stats, img_path = create_pokemon(img_path, create_image)
    else:
        name, pokedex, stats = create_pokemon(img_path, create_image)

    element = stats.pop("type")

    attacks = create_attacks(name, pokedex, element)
    try:
        element = element.split("/")[0].capitalize()
    except:
        raise GeminiError("Gemini API returned an invalid response.")

    return Pokemon(name, pokedex, element, stats, attacks, img_path, original_img_path)
