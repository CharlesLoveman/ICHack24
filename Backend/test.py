import vertexai
from vertexai.preview.generative_models import GenerativeModel, Image

vertexai.init(project="crucial-bucksaw-413121")

model = GenerativeModel("gemini-pro")

responce = model.generate_content("This is a test.")

print(responce.text)
