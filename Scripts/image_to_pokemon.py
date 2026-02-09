import sys
from PIL import Image
from Backend.api import create_pokemon


def load_image_from_file(file_path: str) -> Image.Image:
    """Load an image from a file.

    Args:
        file_path (str): The path to the image file.

    Returns:
        img (Image): The image loaded from the file.
    """
    return Image.open(file_path)


file_path = sys.argv[1]

# Load the image from the file
img_input = load_image_from_file(file_path)

# Create a new pokemon from the image
name, pokedex, stats, img, img_prompt = create_pokemon(
    img_input, create_image=True, return_prompt=True
)

print("Name:", name)
print("Pokedex Entry:")
print(pokedex)
print("Stats:", stats)
print("Prompt:", img_prompt)
img.save("output.jpg")
