from dotenv import dotenv_values
import os

config = dotenv_values(".prod" if os.getenv("FLASK_ENV") == "prod" else ".dev")