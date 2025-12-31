import os
from dotenv import load_dotenv
from sqlalchemy.engine.url import make_url

load_dotenv()
url_str = os.getenv("DATABASE_URL")

if not url_str:
    print("DATABASE_URL is not set")
else:
    try:
        url = make_url(url_str)
        print(f"Drivername: {url.drivername}")
        print(f"Host: {url.host}")
        print(f"Port: {url.port}")
        print(f"Database: {url.database}")
        print(f"Username: {url.username}")
    except Exception as e:
        print(f"Error parsing URL: {e}")
