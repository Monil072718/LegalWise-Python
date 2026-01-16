import sys
import os

# Add parent directory to path so we can import database
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import engine
from sqlalchemy import text

def add_columns():
    with engine.connect() as conn:
        # Add subscription_plan column
        try:
            conn.execute(text("ALTER TABLE clients ADD COLUMN subscription_plan VARCHAR DEFAULT 'free'"))
            print("Added subscription_plan column")
        except Exception as e:
            print(f"Error adding subscription_plan: {e}")

        # Add is_premium column
        try:
            conn.execute(text("ALTER TABLE clients ADD COLUMN is_premium BOOLEAN DEFAULT FALSE"))
            print("Added is_premium column")
        except Exception as e:
            print(f"Error adding is_premium: {e}")

        conn.commit()

if __name__ == "__main__":
    add_columns()
