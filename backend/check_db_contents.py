import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DATABASE_URL")
engine = create_engine(db_url)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

print("=== DATABASE CONTENTS ===\n")

# Check admins
result = db.execute(text("SELECT count(*), string_agg(email, ', ') FROM admins"))
admin_count, admin_emails = result.fetchone()
print(f"Admins: {admin_count}")
print(f"  Emails: {admin_emails or 'None'}\n")

# Check lawyers
result = db.execute(text("SELECT count(*), string_agg(email, ', ') FROM lawyers"))
lawyer_count, lawyer_emails = result.fetchone()
print(f"Lawyers: {lawyer_count}")
print(f"  Emails: {lawyer_emails or 'None'}\n")

# Check recent lawyer details
result = db.execute(text("SELECT name, email, status, verified FROM lawyers ORDER BY \"createdAt\" DESC LIMIT 5"))
lawyers = result.fetchall()
if lawyers:
    print("Recent lawyers:")
    for l in lawyers:
        print(f"  - {l[0]} ({l[1]}) - Status: {l[2]}, Verified: {l[3]}")
else:
    print("No lawyers found in database!")

db.close()
