print("MARKER 1: Imports start")
from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import os
print("MARKER 2: Stdlib imports done")

print("MARKER 3: Importing routers.admin")
from routers.admin import lawyers, clients, cases, dashboard, books, articles, payments, analytics, categories
print("MARKER 4: Admin routers imported")

print("MARKER 5: Importing routers.common")
from routers.common import auth, appointments, upload, chat
print("MARKER 6: Common routers imported")

print("MARKER 7: Importing routers.client")
from routers.client import cases as client_cases, payments as client_payments, books as client_books, articles as client_articles
from routers.client import orders, dashboard as client_dashboard
print("MARKER 8: Client routers imported")

print("MARKER 9: Importing routers.lawyer")
from routers.lawyer import dashboard as lawyer_dashboard
print("MARKER 10: Lawyer routers imported")

from websocket_manager import manager
import models
import database
print("MARKER 11: Models/Database imported")

# Database
models.Base.metadata.create_all(bind=database.engine)
print("MARKER 12: DB Tables created")

if not os.path.exists("uploads"):
    os.makedirs("uploads")

# Default Admin
def create_default_admin():
    db = database.SessionLocal()
    from routers.common.auth import get_password_hash
    import uuid
    from datetime import datetime
    
    admin_email = "admin@legalwise.com"
    existing_admin = db.query(models.Admin).filter(models.Admin.email == admin_email).first()
    
    if not existing_admin:
        default_admin = models.Admin(
            id=str(uuid.uuid4()),
            email=admin_email,
            hashed_password=get_password_hash("admin123"),
            name="Super Admin",
            role="admin",
            createdAt=datetime.now().strftime("%Y-%m-%d")
        )
        db.add(default_admin)
        db.commit()
    db.close()

create_default_admin()
print("MARKER 13: Default admin created")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Common Routers
app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(chat.router)
app.include_router(appointments.router)
print("MARKER 14: Common routers included")

# Admin Routers
app.include_router(lawyers.router)
app.include_router(clients.router)
app.include_router(cases.router)
app.include_router(dashboard.router)
app.include_router(books.router)
app.include_router(articles.router)
app.include_router(payments.router)
app.include_router(analytics.router)
app.include_router(categories.router)
print("MARKER 15: Admin routers included")

# Client Routers - Explicit imports to avoid confusion
app.include_router(client_cases.router, prefix="/client")
app.include_router(client_payments.router, prefix="/client")
app.include_router(client_books.router, prefix="/client")
app.include_router(client_articles.router, prefix="/client")
app.include_router(orders.router, prefix="/client")
app.include_router(client_dashboard.router, prefix="/client")
print("MARKER 16: Client routers included")

# Lawyer Routers
app.include_router(lawyer_dashboard.router, prefix="/lawyer")
print("MARKER 17: Lawyer routers included")

if __name__ == "__main__":
    print("MARKER 18: Running Uvicorn")
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
