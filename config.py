import os
from dotenv import load_dotenv
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECTS_DIR = os.path.join(BASE_DIR, "projects")
os.makedirs(PROJECTS_DIR, exist_ok=True)

SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///" + os.path.join(BASE_DIR, "app.db"))
OPENAI_API_KEY = os.getenv("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",)
