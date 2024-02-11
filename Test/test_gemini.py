"""Tests for the Gemini API."""

from Backend.api import *
from Backend.prompt_templates import GEMINI_PROMPT_TEMPLATE
import pytest


@pytest.mark.parametrize("name", ("banana", "bicycle", "flowers"))
def test_get_gemini_response(name):
    img = load_image_from_file(f"TestImages/{name}.jpg")
    response = get_gemini_response(GEMINI_PROMPT_TEMPLATE_WITH_IMAGE, img)


@pytest.mark.parametrize("name", ("banana", "bicycle", "flowers"))
def test_create_pokemon(name):
    img = load_image_from_file(f"TestImages/{name}.jpg")
    name, pokedex, stats = create_pokemon(img)

    assert isinstance(name, str)
    assert isinstance(pokedex, str)
    assert isinstance(stats, dict)


@pytest.mark.parametrize("name", ("banana", "bicycle", "flowers"))
def test_build_pokemon(name):
    img = load_image_from_file(f"TestImages/{name}.jpg")
    pokemon = build_pokemon(img, create_image=True)

    assert isinstance(pokemon, Pokemon)
