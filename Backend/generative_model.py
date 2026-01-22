from vertexai.preview.generative_models import Image
from typing import Union, Tuple, Any, Optional
from abc import ABC, abstractmethod

class GenerativeModel(ABC):
    @abstractmethod
    def get_gemini_response(
    self, template: str, img: Optional[Image] = None, safety_feedback: bool = False, img_path: Optional[str] = None
) -> Union[str, Tuple[str, Any]]:
        pass