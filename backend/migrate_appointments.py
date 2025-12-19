from database import SessionLocal, engine
from sqlalchemy import text

def add_columns():
    db = SessionLocal()
    try:
        # Add lawyerId column
        db.execute(text("ALTER TABLE appointments ADD COLUMN lawyerId VARCHAR"))
        print("Added lawyerId column")
    except Exception as e:
        print(f"lawyerId column might already exist or error: {e}")

    try:
        # Add clientId column
        db.execute(text("ALTER TABLE appointments ADD COLUMN clientId VARCHAR"))
        print("Added clientId column")
    except Exception as e:
        print(f"clientId column might already exist or error: {e}")
        
    db.commit()
    db.close()

if __name__ == "__main__":
    add_columns()
