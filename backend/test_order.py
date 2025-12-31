from datetime import datetime
import uuid
import models, database
from sqlalchemy.orm import Session

# Setup DB connection
db = database.SessionLocal()

# Mock order data
try:
    print("Attempting to create a test order...")
    test_items = [
        {"bookId": "123", "title": "Test Book", "price": 10.0, "quantity": 1}
    ]
    
    new_order = models.Order(
        id=str(uuid.uuid4()),
        clientId="test-user-id",
        items=test_items,
        totalAmount=10.0,
        shippingAddress="123 Test St",
        paymentMethod="card",
        status="completed",
        createdAt=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    
    db.add(new_order)
    db.commit()
    print("Order created successfully!")
    
    # Clean up
    db.delete(new_order)
    db.commit()
    print("Cleaned up test order.")

except Exception as e:
    print(f"Error creating order: {e}")
finally:
    db.close()
