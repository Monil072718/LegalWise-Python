from database import SessionLocal
from models import Client
from routers.auth import get_password_hash
import uuid
from datetime import datetime

def seed_client():
    db = SessionLocal()
    email = "client@legalwise.com"
    password = "client123"
    
    # Check if exists
    existing = db.query(Client).filter(Client.email == email).first()
    if existing:
        print(f"Test user already exists: {email}")
        # Update password just in case
        existing.hashed_password = get_password_hash(password)
        db.commit()
        print(f"Password reset to: {password}")
        return

    new_client = Client(
        id=str(uuid.uuid4()),
        name="Test Client",
        email=email,
        hashed_password=get_password_hash(password),
        role="client",
        status="active",
        createdAt=datetime.now().strftime("%Y-%m-%d"),
        avatar=""
    )
    
    db.add(new_client)
    db.commit()
    print(f"Created test user: {email} / {password}")
    db.close()

if __name__ == "__main__":
    seed_client()
