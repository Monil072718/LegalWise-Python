from database import SessionLocal
import models
from sqlalchemy import text

def test_db():
    try:
        db = SessionLocal()
        print("Connection successful.")
        
        # Test query
        count = db.query(models.Case).count()
        print(f"Cases count: {count}")
        
        # Test specific query that failed
        active = db.query(models.Case).filter(models.Case.status != 'closed').count()
        print(f"Active cases: {active}")
        
        db.close()
        print("Test complete.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_db()
