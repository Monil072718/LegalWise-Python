from database import engine, SessionLocal
import models
from sqlalchemy import text

def verify_data():
    print("--- DATA VERIFICATION ---")
    print(f"1. App Connection String: {engine.url}")
    
    db = SessionLocal()
    try:
        # Check database name
        db_name = db.execute(text("SELECT current_database()")).scalar()
        print(f"2. Actual Connected Database: {db_name}")
        
        # Check lawyers
        lawyers = db.query(models.Lawyer).all()
        print(f"3. Lawyer Count in DB: {len(lawyers)}")
        
        if lawyers:
            print("4. Sample Data:")
            for l in lawyers:
                print(f"   - ID: {l.id}, Name: {l.name}, Email: {l.email}")
        else:
            print("4. No lawyers found in this database.")
            
    except Exception as e:
        print(f"ERROR: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_data()
