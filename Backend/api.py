"""API for interfacing with the vision pipeline."""

import vertexai
from vertexai.preview.generative_models import GenerativeModel, Image
import re

vertexai.init(project="crucial-bucksaw-413121")
model = GenerativeModel("gemini-pro-vision")

STATS_KEYS = [
    "Type", "HP", "Attack", "Defence", "Special Attack", "Special Defence", "Speed"
]


def load_image_from_file(file_path):
    """Load an image from a file.

    Args:
        file_path (str): The path to the image file.

    Returns:
        img (Image): The image loaded from the file.
    """
    return Image.from_bytes(open(file_path, "rb").read())


def get_gemini_response(template, img, safety_feedback=False):
    """Get a response from the Gemini model.

    Args:
        template (str): The prompt to use to get a response.
        img (PIL.Image): The image to use to get a response.
        safety_feedback (bool): Whether to get safety feedback.

    Returns:
        response (str): The response from the Gemini model.
    """
    response = model.generate_content([img, template])

    if safety_feedback:
        return response.text, response.prompt_feedback
    else:
        return response.text


def create_pokemon(template, img):
    """Create a new pokemon from an image.

    Args:
        prompt (str): The prompt to use to create the pokemon.
        img (Image): The image to use to create the pokemon.

    Returns:
        details (dict): The details of the created pokemon.
    """

    response = get_gemini_response(template, img)

    sections = [
        re.search(
            rf"\[Start Output {key}\](.*)\[End Output {key}\]", response, re.DOTALL
        ).group(1).strip() for key in ["Name", "Pokedex", "Stats"]
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

    return name, pokedex, stats
