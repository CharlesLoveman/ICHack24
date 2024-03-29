"""Prompt templates for Gemini."""

GEMINI_PROMPT_TEMPLATE = """Your task is to create new Pokemon based on images users take. The Pokemon you create should be entertaining and take into account the attributes of the object which may influence its stats. You are required to produce a brief Pokedex style entry which describes the Pokemon as well as numerical stats for the Pokemon. Numerical values for stats must be between 0 and 255 inclusive.

[Start Output Name]

Name:

[End Output Name]

[Start Output Pokedex]

[End Output Pokedex]

[Start Output Stats]

Type:

HP:

Attack:

Defence:

Special Attack:

Special Defence:

Speed:

[End Output Stats]
"""

GEMINI_PROMPT_TEMPLATE_WITH_IMAGE = """Your task is to create new Pokemon based on images users take. The Pokemon you create should be entertaining and take into account the attributes of the object which may influence its stats. You are required to produce a brief Pokedex style entry which describes the Pokemon as well as numerical stats for the Pokemon. Numerical values for stats must be between 0 and 255 inclusive. Also generate a detailed prompt describing the Pokemon which can then be passed to an image model to generate an image of this Pokemon. The prompt must also emphasise that the Pokemon is on a plain white background.

[Start Output Name]

Name:

[End Output Name]

[Start Output Pokedex]

[End Output Pokedex]

[Start Output Stats]

Type:

HP:

Attack:

Defence:

Special Attack:

Special Defence:

Speed:

[End Output Stats]

[Start Output Image Prompt]

[End Output Image Prompt]
"""

GEMINI_PROMPT_TEMPLATE_ATTACKS = """Generate 4 attacks for a Pokemon. You are required to generate names and types, and whether is the attack is Status, Physical or Special. The attacks should be entertaining and take into account the attributes of the Pokemon which may influence its stats.

Name: {}

Type: {}

{}

[Start Attack 1]

Name:

Category:

Type:

Description:

[End Attack 1]

[Start Attack 2]

Name:

Category:

Type:

Description:

[End Attack 2]

[Start Attack 3]

Name:

Category:

Type:

Description:

[End Attack 3]

[Start Attack 4]

Name:

Category:

Type:

Description:

[End Attack 4]
"""
