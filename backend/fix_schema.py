from database import engine
from models import Base, Book, Article

try:
    print("Dropping books table...")
    Book.__table__.drop(engine, checkfirst=True)
    print("Dropping articles table...")
    Article.__table__.drop(engine, checkfirst=True)
    
    print("Recreating tables...")
    Base.metadata.create_all(bind=engine)
    print("Schema update complete.")
except Exception as e:
    print(f"Error updating schema: {e}")
