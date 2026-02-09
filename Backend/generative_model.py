from typing import Union, Tuple, Any, Optional
from abc import ABC, abstractmethod


class GenerativeModel(ABC):
    @abstractmethod
    def get_gemini_response(
        self,
        template: str,
        safety_feedback: bool = False,
        img_path: Optional[str] = None,
    ) -> Tuple[str, Optional[Any]]:
        pass
