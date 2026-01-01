import sys
import os

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import database
import models
from routers.common.auth import get_password_hash
import uuid
from datetime import datetime

def reset_admin():
    db = database.SessionLocal()
    admin_email = "admin@legalwise.com"
    
    print(f"Checking for admin: {admin_email}")
    admin = db.query(models.Admin).filter(models.Admin.email == admin_email).first()
    
    if admin:
        print(f"Found admin ID: {admin.id}")
        print("Resetting password to 'admin123'...")
        admin.hashed_password = get_password_hash("admin123")
        db.commit()
        print("Password reset successful.")
    else:
        print("Admin user not found. Creating default admin...")
        new_admin = models.Admin(
            id=str(uuid.uuid4()),
            email=admin_email,
            hashed_password=get_password_hash("admin123"),
            name="Super Admin",
            role="admin",
            createdAt=datetime.now().strftime("%Y-%m-%d")
        )
        db.add(new_admin)
        db.commit()
        print("Default admin created successfully.")
    
    db.close()

if __name__ == "__main__":
    reset_admin()
