"""API for interfacing with the vision pipeline."""

from Backend.prompt_templates import GEMINI_PROMPT_TEMPLATE, GEMINI_PROMPT_TEMPLATE_WITH_IMAGE
from Backend.image_processing import generate_image, pixelate_image
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


def create_pokemon(img, create_image=False, return_prompt=False):
    """Create a new pokemon from an image.

    Args:
        prompt (str): The prompt to use to create the pokemon.
        img (Image): The image to use to create the pokemon.
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

    response = get_gemini_response(template, img)

    sections = [
        re.search(
            rf"\[Start Output {key}\](.*)\[End Output {key}\]", response, re.DOTALL
        ).group(1).strip() for key in cat_names
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

        if return_prompt:
            return name, pokedex, stats, img, image_prompt
        else:
            return name, pokedex, stats, img

    else:
        return name, pokedex, stats
