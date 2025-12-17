import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

# Read directly from env to see what's current
DB_URL = os.getenv("DATABASE_URL")

def check_connection():
    print(f"Checking connection to: {DB_URL}")
    if not DB_URL:
        print("Error: DATABASE_URL not found in environment.")
        return

    try:
        engine = create_engine(DB_URL)
        with engine.connect() as conn:
            print("Successfully connected!")
            result = conn.execute(text("SELECT count(*) FROM lawyers"))
            print(f"Lawyer count: {result.fetchone()[0]}")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    check_connection()
