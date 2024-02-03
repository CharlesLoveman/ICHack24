"""Tests for the Gemini API."""

from Backend.api import *
from Backend.prompt_templates import GEMINI_PROMPT_TEMPLATE
import pytest


@pytest.mark.parametrize("name", ("banana", "bicycle", "flowers"))
def test_get_gemini_response(name):
    img = load_image_from_file(f"TestImages/{name}.jpg")
    response = get_gemini_response(GEMINI_PROMPT_TEMPLATE, img)


@pytest.mark.parametrize("name", ("banana", "bicycle", "flowers"))
def test_create_pokemon(name):
    img = load_image_from_file(f"TestImages/{name}.jpg")
    name, pokedex, stats = create_pokemon(GEMINI_PROMPT_TEMPLATE, img)

    assert isinstance(name, str)
    assert isinstance(pokedex, str)
    assert isinstance(stats, dict)
