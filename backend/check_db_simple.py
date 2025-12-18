import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

db_url = os.getenv("DATABASE_URL")

with open("database_status.txt", "w", encoding="utf-8") as f:
    f.write("DATABASE STATUS REPORT\n")
    f.write("="*60 + "\n\n")
    
    f.write(f"Connected to: {db_url}\n\n")
    
    try:
        engine = create_engine(db_url)
        with engine.connect() as conn:
            # Connection test
            f.write("Connection: SUCCESS\n\n")
            
            # Count lawyers
            result = conn.execute(text("SELECT COUNT(*) FROM lawyers"))
            count = result.fetchone()[0]
            f.write(f"Total lawyers in database: {count}\n\n")
            
            if count > 0:
                result = conn.execute(text("SELECT name, email, status FROM lawyers"))
                f.write("Lawyers found:\n")
                for row in result.fetchall():
                    f.write(f"  - {row[0]} ({row[1]}) - {row[2]}\n")
            else:
                f.write("NO LAWYERS FOUND IN DATABASE!\n")
            
            f.write("\n" + "="*60 + "\n")
            f.write("If you see lawyers listed above, data IS being saved.\n")
            f.write("Make sure you're looking at the correct database in pgAdmin:\n")
            f.write(f"  Host: localhost\n")
            f.write(f"  Database: postgres\n")
            
    except Exception as e:
        f.write(f"ERROR: {str(e)}\n")

print("Report written to database_status.txt")
