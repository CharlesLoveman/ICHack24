from PIL import Image as PILImage
import requests
import io
import os
from dotenv import dotenv_values

config = dotenv_values(".prod" if os.getenv("FLASK_ENV") == "prod" else ".dev")

HF_KEY = config["HF_KEY"]

API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
headers = {"Authorization": f"Bearer {HF_KEY}"}


def generate_image(image_prompt: str) -> PILImage:
    """Generate an image from a prompt.

    Args:
        image_prompt (str): The prompt to use to generate the image.

    Returns:
        img (PIL.Image): The image generated from the prompt.
    """
    payload = {"inputs": image_prompt}
    response = requests.post(API_URL, headers=headers, json=payload)
    image_bytes = response.content

    return PILImage.open(io.BytesIO(image_bytes))


def pixelate_image(img: PILImage) -> PILImage:
    """Pixelate an image.

    Args:
        img (PIL.Image): The image to pixelate.

    Returns:
        img (PIL.Image): The pixelated image.
    """
    raise NotImplementedError
