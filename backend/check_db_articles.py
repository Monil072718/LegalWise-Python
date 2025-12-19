from database import SessionLocal
import models
import sys

print("Connecting to DB...")
db = SessionLocal()
try:
    print("Querying articles...")
    articles = db.query(models.Article).all()
    print(f"Found {len(articles)} articles.")
    for a in articles:
        print(f"- {a.title}")
    print("Done.")
except Exception as e:
    print(f"Error querying DB: {e}")
finally:
    db.close()
