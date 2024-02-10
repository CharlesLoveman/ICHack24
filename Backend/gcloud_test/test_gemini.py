"""Test Gemini inside Gcloud."""
import vertexai
from vertexai.preview.generative_models import GenerativeModel

vertexai.init(project="crucial-bucksaw-413121")
model = GenerativeModel("gemini-pro")
vision_model = GenerativeModel("gemini-pro")

response = model.generate_content(["This is a test."])
print(response)
