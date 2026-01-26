from dotenv import load_dotenv
import os

dotenv_path = ".prod" if os.getenv("FLASK_ENV") == "prod" else ".dev"
load_dotenv(dotenv_path)


PATH_TO_PUBLIC = os.environ.get("PATH_TO_PUBLIC", "../Frontend/public/")
DATABASE_HOST = os.environ.get("DATABASE_HOST", "127.0.0.1")
FLASK_SECRET_KEY = os.environ.get("FLASK_SECRET_KEY", "abcd")
USE_REAL_MODEL = os.environ.get("USE_REAL_MODEL", "False")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", None)

if GEMINI_API_KEY is None:
    print("GEMINI_API_KEY not set.")
