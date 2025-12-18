import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv

load_dotenv(".env")
DATABASE_URL = os.getenv("DATABASE_URL")

# Extract connection text
if not DATABASE_URL:
    print("DATABASE_URL not found")
    exit(1)

# Handle localhost resolution issue by forcing 127.0.0.1 if needed
if "localhost" in DATABASE_URL:
    print("Replacing localhost with 127.0.0.1 in connection string...")
    DATABASE_URL = DATABASE_URL.replace("localhost", "127.0.0.1")

# Parse URL to get user, password, etc.
# Creating a new DB requires connecting to 'postgres' db first
from urllib.parse import urlparse
result = urlparse(DATABASE_URL)
username = result.username
password = result.password
database = result.path[1:]
hostname = result.hostname
port = result.port

print(f"Connecting to postgres system db at {hostname}:{port}...")

try:
    con = psycopg2.connect(
        dbname='postgres', 
        user=username, 
        host=hostname, 
        password=password,
        port=port
    )
    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = con.cursor()
    
    # Check if db exists
    cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{database}'")
    exists = cursor.fetchone()
    if not exists:
        print(f"Database {database} does not exist. Creating...")
        cursor.execute(f"CREATE DATABASE {database}")
        print(f"Database {database} created successfully.")
    else:
        print(f"Database {database} already exists.")
        
    cursor.close()
    con.close()
    
except Exception as e:
    print(f"Error: {e}")
