import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

def debug_connection():
    db_url = os.getenv("DATABASE_URL")
    print(f"Loaded DATABASE_URL: {db_url}")
    
    if not db_url:
        print("Using default SQLite (should work fine).")
        return

    if "sqlite" in db_url:
         print("Configured for SQLite.")
         return

    print("Attempting to connect to PostgreSQL...")
    try:
        # Lower timeout to fail fast
        engine = create_engine(db_url, connect_args={'connect_timeout': 5})
        with engine.connect() as conn:
            print("Successfully connected!")
            res = conn.execute(text("SELECT version()"))
            print(f"DB Version: {res.fetchone()[0]}")
    except Exception as e:
        print(f"Connection FAILED: {e}")

if __name__ == "__main__":
    debug_connection()
