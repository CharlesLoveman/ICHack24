from typing import Union, Tuple, List, Dict, Any, Optional

from generative_model import GenerativeModel

"""
A mock which cycles through responses
"""


class MockGenerativeModel(GenerativeModel):
    number_of_responses: int = 2
    current_response: int = 0
    RESPONSE_PATH_PREFIX: str = "mock_responses"

    def __init__(self):
        pass

    def get_response_path(self):
        return f"mock_response_{self.current_response + 1}.txt"

    def get_gemini_response(
        self,
        template: str,
        safety_feedback: bool = False,
        img_path: Optional[str] = None,
    ) -> Union[str, Tuple[str, Any]]:
        with open(self.get_response_path(), "r") as file:
            response = file.read()

        self.current_response += 1

        if self.current_response >= self.number_of_responses:
            self.current_response = 0

        return response
