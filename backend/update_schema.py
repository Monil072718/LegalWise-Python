from database import engine, Base
from sqlalchemy import text
import models

def update_schema():
    print("Connecting to database...")
    with engine.begin() as connection:
        # Check if columns exist (basic check, blindly trying to add is also an option but risky with some DBs)
        # SQLite doesn't support IF NOT EXISTS for ADD COLUMN in older versions, but we'll try standard SQL
        
        try:
            print("Adding shippingAddress column...")
            connection.execute(text("ALTER TABLE orders ADD COLUMN shippingAddress VARCHAR"))
            print("shippingAddress added.")
        except Exception as e:
            print(f"shippingAddress might already exist or error: {e}")

        try:
            print("Adding paymentMethod column...")
            connection.execute(text("ALTER TABLE orders ADD COLUMN paymentMethod VARCHAR"))
            print("paymentMethod added.")
        except Exception as e:
            print(f"paymentMethod might already exist or error: {e}")
            
        try:
            print("Adding fullname column...")
            connection.execute(text("ALTER TABLE orders ADD COLUMN fullname VARCHAR"))
            print("fullname added.")
        except Exception as e:
            print(f"fullname might already exist or error: {e}")
            
        try:
            print("Adding phonenumber column...")
            connection.execute(text("ALTER TABLE orders ADD COLUMN phonenumber VARCHAR"))
            print("phonenumber added.")
        except Exception as e:
            print(f"phonenumber might already exist or error: {e}")
            
    print("Schema update complete.")

if __name__ == "__main__":
    update_schema()
