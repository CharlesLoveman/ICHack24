import sys
from Backend.api import create_pokemon, load_image_from_file
from Backend.prompt_templates import GEMINI_PROMPT_TEMPLATE

file_path = sys.argv[1]

# Load the image from the file
img = load_image_from_file(file_path)

# Create a new pokemon from the image
name, pokedex, stats = create_pokemon(GEMINI_PROMPT_TEMPLATE, img)

print("Name:", name)
print("Pokedex Entry:")
print(pokedex)
print("Stats:", stats)
