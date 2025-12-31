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
    print(f"Attempting to connect to target DB...")
    engine = create_engine(url)
    conn = engine.connect()
    print("SUCCESS: Connected to target database!")
    conn.close()
except Exception as e:
    with open("backend/db_error.log", "w") as f:
        f.write(f"FAILURE: Could not connect to target database.\n")
        f.write(f"Error Type: {type(e).__name__}\n")
        f.write(f"Error Details: {e}\n")
    
    print(f"FAILURE: Could not connect to target database. See backend/db_error.log")
    
    # Try connecting to default 'postgres' db to see if server is up
    try:
        if "postgresql" in url:
            from sqlalchemy.engine.url import make_url
            u = make_url(url)
            # Construct default url
            default_url = u.set(database="postgres")
            print(f"\nAttempting to connect to default 'postgres' DB at {u.host}:{u.port}...")
            engine_def = create_engine(default_url)
            conn_def = engine_def.connect()
            print("SUCCESS: Connected to 'postgres' system database!")
            print("This means the server is running, but your specific database might not exist.")
            conn_def.close()
    except Exception as e2:
        print(f"FAILURE: Could not connect to 'postgres' system database either.")
        print(f"Error Details: {e2}")
        
    sys.exit(1)
