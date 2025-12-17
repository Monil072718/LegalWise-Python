import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from routers.auth import get_password_hash
from models import Admin, Base

load_dotenv()

def setup_admin():
    db_url = os.getenv("DATABASE_URL")
    print(f"Connecting to: {db_url}")
    
    try:
        engine = create_engine(db_url)
        SessionLocal = sessionmaker(bind=engine)
        db = SessionLocal()
        
        # Check connection
        db.execute(text("SELECT 1"))
        print("Connection successful.")

        # Create tables if they don't exist (failsafe)
        Base.metadata.create_all(bind=engine)
        print("Tables ensured.")

        # Check for admin
        admin = db.query(Admin).filter(Admin.email == "admin@legalwise.com").first()
        if not admin:
            print("Admin user missing. Creating default admin...")
            new_admin = Admin(
                id="admin_001",
                email="admin@legalwise.com",
                hashed_password=get_password_hash("admin123"),
                name="System Admin",
                role="admin",
                createdAt="2024-01-01"
            )
            db.add(new_admin)
            db.commit()
            print("Admin user created.")
        else:
            print("Admin user already exists.")
            # Optional: Reset password to be sure
            # admin.hashed_password = get_password_hash("admin123")
            # db.commit()
            # print("Admin password reset to 'admin123'.")
        
        db.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    setup_admin()
