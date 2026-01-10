import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

def fix_schema():
    load_dotenv()
    DATABASE_URL = os.getenv("DATABASE_URL")
    if not DATABASE_URL:
        # Fallback to what we saw in logs if env is missing
        print("DATABASE_URL not found in env, trying default...")
        DATABASE_URL = "postgresql://postgres:admin123@localhost:5432/legalwise_db"
        
    print(f"Connecting to: {DATABASE_URL}")
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            conn.execute(text("COMMIT")) # Ensure clean state
            
            print("Checking schema...")
            # Content
            try:
                conn.execute(text("ALTER TABLE articles ADD COLUMN content VARCHAR"))
                print("Added 'content'")
                conn.commit()
            except Exception as e:
                print(f"Content exists or error: {e}")
                conn.rollback()

            # Image
            try:
                conn.execute(text("ALTER TABLE articles ADD COLUMN image VARCHAR"))
                print("Added 'image'")
                conn.commit()
            except Exception as e:
                print(f"Image exists or error: {e}")
                conn.rollback()
                
            # Link
            try:
                conn.execute(text("ALTER TABLE articles ADD COLUMN link VARCHAR"))
                print("Added 'link'")
                conn.commit()
            except Exception as e:
                print(f"Link exists or error: {e}")
                conn.rollback()
                
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    fix_schema()
