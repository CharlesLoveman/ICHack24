from google import genai
from generative_model import GenerativeModel
from google.genai.types import GenerateContentResponsePromptFeedback
from response_recorder import ResponseRecorder
from env import GEMINI_API_KEY, PATH_TO_PUBLIC
from typing import Tuple, Optional


RECORD_RESPONSES = True
recorder = ResponseRecorder()


class RealGenerativeModel(GenerativeModel):
    """A concrete implementation of GenerativeModel using Google's Gemini API."""

    client = genai.Client(api_key=GEMINI_API_KEY)
    MODEL_NAME = "gemma-3-27b-it"
    # MODEL_NAME = "gemini-2.5-flash-lite"
    # MODEL_NAME = "gemini-1.5-flash"
    # MODEL_NAME = "gemini-2.0-flash"
    # MODEL_NAME = "gemini-live-2.5-flash-native-audio"
    # MODEL_NAME = "gemini-2.5-flash-image"

    def get_gemini_response(
        self,
        template: str,
        safety_feedback: bool = False,
        img_path: Optional[str] = None,
    ) -> Tuple[str, Optional[GenerateContentResponsePromptFeedback]]:
        """Get a response from the Gemini model.

        Args:
            template (str): The prompt template to use to get a response.
            safety_feedback (bool, optional): Whether to return safety feedback. Defaults to False.
            img_path (Optional[str], optional): The path to the image file to include in the prompt.
                Defaults to None.

        Returns:
            Tuple[str, Optional[GenerateContentResponsePromptFeedback]]: A tuple containing:
                - The text response from the model.
                - The prompt feedback object if safety_feedback is True, else None.

        Raises:
            Exception: If the model returns no text response.
        """

        if img_path is None:
            response = self.client.models.generate_content(
                model=self.MODEL_NAME, contents=[template]
            )
        else:
            file_path = PATH_TO_PUBLIC + img_path
            img_ref = self.client.files.upload(file=file_path)
            response = self.client.models.generate_content(
                model=self.MODEL_NAME, contents=list([template, img_ref])
            )

        if response.text:
            if RECORD_RESPONSES:
                recorder.record(response.text)

            if safety_feedback:
                return response.text, response.prompt_feedback
            else:
                return response.text, None
        else:
            raise Exception("No response text from Gemini model.")
