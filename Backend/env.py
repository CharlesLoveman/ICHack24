from dotenv import dotenv_values, load_dotenv
import os

dotenv_path = ".prod" if os.getenv("FLASK_ENV") == "prod" else ".dev"
config = dotenv_values(dotenv_path)
load_dotenv(dotenv_path)

PATH_TO_PUBLIC = os.environ.get("PATH_TO_PUBLIC", "../Frontend/public/")
DATABASE_HOST = os.environ.get("DATABASE_HOST", "127.0.0.1")
