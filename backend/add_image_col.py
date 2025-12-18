from database import engine, SessionLocal
from sqlalchemy import text

def add_image_column():
    print("Migrating: Adding 'image' column to 'lawyers' table...")
    db = SessionLocal()
    try:
        db.execute(text("ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS image VARCHAR"))
        db.commit()
        print("Success: Column 'image' added.")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_image_column()
