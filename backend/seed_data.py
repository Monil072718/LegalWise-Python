from database import SessionLocal
import models
import uuid
from datetime import datetime

def seed_data():
    db = SessionLocal()
    
    # Check for clients
    clients_count = db.query(models.Client).count()
    if clients_count == 0:
        print("Seeding clients...")
        clients_data = [
            {
                "name": "Alice Johnson",
                "email": "alice@example.com",
                "phone": "+1 (555) 123-4567",
                "status": "Active",
                "createdAt": "2024-01-15",
                "role": "client"
            },
             {
                "name": "Robert Smith",
                "email": "robert@example.com",
                "phone": "+1 (555) 987-6543",
                "status": "Active",
                "createdAt": "2024-01-20",
                "role": "client"
            },
             {
                "name": "Sarah Williams",
                "email": "sarah@example.com",
                "phone": "+1 (555) 456-7890",
                "status": "Pending",
                "createdAt": "2024-02-01",
                "role": "client"
            }
        ]
        
        for client in clients_data:
            db_client = models.Client(id=str(uuid.uuid4()), **client)
            db.add(db_client)
        
        db.commit()
        print("Clients seeded.")
    else:
        print(f"Clients already exist: {clients_count}")
        
    db.close()

if __name__ == "__main__":
    seed_data()
