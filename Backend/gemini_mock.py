from typing import Tuple, Optional

from generative_model import GenerativeModel

"""A mock implementation of the GenerativeModel that cycles through pre-defined responses."""


class MockGenerativeModel(GenerativeModel):
    """A mock for the generative model that cycles through pre-defined text file responses."""

    number_of_responses: int = 2
    current_response: int = 0
    RESPONSE_PATH_PREFIX: str = "mock_responses"

    def __init__(self):
        """Initialise the mock model."""

    def get_response_path(self):
        """Construct the file path for the current mock response.

        Returns:
            str: The file path for the mock response to be read.
        """
        return f"mock_response_{self.current_response + 1}.txt"

    def get_gemini_response(
        self,
        template: str,
        safety_feedback: bool = False,
        img_path: Optional[str] = None,
    ) -> Tuple[str, None]:
        """Get a mock response by reading from a sequence of files.

        This method simulates the behavior of the real generative model by cycling
        through a set of pre-written response files.

        Args:
            template (str): The prompt template (ignored by the mock).
            safety_feedback (bool, optional): Whether to get safety feedback (ignored by the mock).
                Defaults to False.
            img_path (Optional[str], optional): The path to an image (ignored by the mock).
                Defaults to None.

        Returns:
            Tuple[str, None]: A tuple containing the mock response string and None for feedback.
        """
        with open(self.get_response_path(), "r") as file:
            response = file.read()

        self.current_response += 1

        if self.current_response >= self.number_of_responses:
            self.current_response = 0

        return response, None
