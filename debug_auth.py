from backend import database, models
from backend.routers.auth import pwd_context, verify_password

def check():
    try:
        # Check hashing
        h = pwd_context.hash("test")
        print(f"Hash generated: {h}")
        v = pwd_context.verify("test", h)
        print(f"Verification: {v}")
    except Exception as e:
        print(f"Hashing failed: {e}")

    # Check DB
    db = database.SessionLocal()
    admin = db.query(models.Admin).filter(models.Admin.email == "admin@legalwise.com").first()
    if admin:
        print(f"Admin found: {admin.email}")
        print(f"Stored hash: '{admin.hashed_password}'")
        try:
             vp = verify_password("admin123", admin.hashed_password)
             print(f"Admin password verify: {vp}")
        except Exception as e:
             print(f"Admin verify failed: {e}")
    else:
        print("Admin not found")
    db.close()

if __name__ == "__main__":
    check()
