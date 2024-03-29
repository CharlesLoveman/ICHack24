import sys
from Backend.api import create_pokemon, load_image_from_file

file_path = sys.argv[1]

# Load the image from the file
img_input = load_image_from_file(file_path)

# Create a new pokemon from the image
name, pokedex, stats, img, img_prompt = create_pokemon(img_input, create_image=True, return_prompt=True)

print("Name:", name)
print("Pokedex Entry:")
print(pokedex)
print("Stats:", stats)
print("Prompt:", img_prompt)
img.save("output.jpg")
