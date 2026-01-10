
import sys
import os
from dotenv import load_dotenv

# Add current directory to sys.path so we can import models/database
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models import Admin
from routers.common.auth import verify_password

def check_admin():
    db = SessionLocal()
    try:
        email = "admin@legalwise.com"
        print(f"Checking for admin: {email}")
        user = db.query(Admin).filter(Admin.email == email).first()
        
        if user:
            print(f"✅ User found: {user.email}")
            print(f"ID: {user.id}")
            print(f"Stored Hash: {user.hashed_password[:10]}...")
            
            # Test default password
            test_pass = "admin123"
            user_input_pass = "admin@123"
            
            if verify_password(test_pass, user.hashed_password):
                print(f"✅ Password '{test_pass}' is VALID.")
            else:
                print(f"❌ Password '{test_pass}' is INVALID.")
                
            if verify_password(user_input_pass, user.hashed_password):
                print(f"✅ Password '{user_input_pass}' is VALID.")
            else:
                print(f"❌ Password '{user_input_pass}' is INVALID.")
                
        else:
            print("❌ User NOT found in database.")
            
    except Exception as e:
        print(f"❌ Error querying database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_admin()
