import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

load_dotenv()

db_url = os.getenv("DATABASE_URL")
print("="*60)
print("DATABASE CONNECTION INFO")
print("="*60)
print(f"Database URL from .env: {db_url}")
print()

# Parse the URL to show connection details
if db_url:
    parts = db_url.replace("postgresql://", "").split("@")
    if len(parts) == 2:
        user_pass = parts[0].split(":")
        host_db = parts[1].split("/")
        print(f"User: {user_pass[0]}")
        print(f"Host: {host_db[0].split(':')[0]}")
        print(f"Port: {host_db[0].split(':')[1] if ':' in host_db[0] else '5432'}")
        print(f"Database: {host_db[1] if len(host_db) > 1 else 'postgres'}")
print()

try:
    engine = create_engine(db_url)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    print("="*60)
    print("CONNECTION TEST")
    print("="*60)
    result = db.execute(text("SELECT version()"))
    version = result.fetchone()[0]
    print(f"✓ Connected successfully!")
    print(f"PostgreSQL version: {version[:50]}...")
    print()
    
    print("="*60)
    print("TABLE DATA")
    print("="*60)
    
    # Admins
    result = db.execute(text("SELECT COUNT(*) FROM admins"))
    admin_count = result.fetchone()[0]
    print(f"Admins table: {admin_count} records")
    
    # Lawyers - with details
    result = db.execute(text("SELECT COUNT(*) FROM lawyers"))
    lawyer_count = result.fetchone()[0]
    print(f"Lawyers table: {lawyer_count} records")
    
    if lawyer_count > 0:
        result = db.execute(text("""
            SELECT id, name, email, status, verified 
            FROM lawyers 
            ORDER BY "createdAt" DESC
        """))
        print("\nLawyer details:")
        for row in result.fetchall():
            print(f"  - {row[1]} ({row[2]})")
            print(f"    Status: {row[3]}, Verified: {row[4]}, ID: {row[0][:20]}...")
    
    db.close()
    print()
    print("="*60)
    print("✓ Data IS being stored in this database!")
    print("="*60)
    
except Exception as e:
    print(f"✗ ERROR: {e}")
