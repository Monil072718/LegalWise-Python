import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
import sys

# Load .env
load_dotenv()
url = os.getenv("DATABASE_URL")

# Mask password for printing
safe_url = url
if url and "@" in url:
    parts = url.split("@")
    safe_url = "..." + "@" + parts[1]

print(f"Checking DB connection to: {safe_url}")

if not url:
    print("ERROR: No DATABASE_URL found in env")
    sys.exit(1)

try:
    print("Attempting to create engine...")
    engine = create_engine(url)
    print("Attempting to connect...")
    conn = engine.connect()
    print("SUCCESS: Connected to database!")
    conn.close()
except Exception as e:
    print("FAILURE: Could not connect to database")
    print(e)
    sys.exit(1)
