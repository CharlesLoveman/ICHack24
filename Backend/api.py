"""API for interfacing with the vision pipeline."""

import vertexai
from vertexai.preview.generative_models import GenerativeModel, Image

vertexai.init(project="crucial-bucksaw-413121")
model = GenerativeModel("gemini-pro-vision")


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
        return response


def create_pokemon(prompt, img):
    """Create a new pokemon from an image.

    Args:
        prompt (str): The prompt to use to create the pokemon.
        img (Image): The image to use to create the pokemon.

    Returns:
        details (dict): The details of the created pokemon.
    """

    return NotImplementedError
