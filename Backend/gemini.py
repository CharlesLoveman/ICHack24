from google import genai
from Backend.generative_model import GenerativeModel
from Backend.response_recorder import ResponseRecorder
from env import config
from typing import Union, Tuple, List, Dict, Any, Optional
from vertexai.preview.generative_models import Image



PATH_TO_PUBLIC = "../Frontend/app/public/"

RECORD_RESPONSES = True
recorder = ResponseRecorder()

class RealGenerativeModel(GenerativeModel):
    client = genai.Client(api_key=config["GEMINI_API_KEY"])
    MODEL_NAME = "gemini-2.5-flash-lite"
    # MODEL_NAME = "gemini-1.5-flash" # not this
    # MODEL_NAME = "gemini-2.0-flash"
    # MODEL_NAME = "gemini-live-2.5-flash-native-audio"
    # MODEL_NAME = "gemini-2.5-flash-image"


    def get_gemini_response(self,
        template: str, img: Optional[Image] = None, safety_feedback: bool = False, img_path: Optional[str] = None
    ) -> Union[str, Tuple[str, Any]]:
        """Get a response from the Gemini model.

        Args:
            template (str): The prompt to use to get a response.
            img (PIL.Image): The image to use to get a response.
            safety_feedback (bool): Whether to get safety feedback.

        Returns:
            response (str): The response from the Gemini model.
        """
        # img = None
        # template = "Make a pokemon"

        if img is None:
            # response = model.generate_content([template])
            response = self.client.models.generate_content(model=self.MODEL_NAME, contents=[template])
        else:
            # response = vision_model.generate_content([img, template])
            file_path = PATH_TO_PUBLIC + img_path
            img_ref = self.client.files.upload(file=file_path)
            response = self.client.models.generate_content(model=self.MODEL_NAME, contents=list([template, img_ref]))

        if (RECORD_RESPONSES): 
            recorder.record(response.text)
            
        if safety_feedback:
            return response.text, response.prompt_feedback
        else:
            return response.text