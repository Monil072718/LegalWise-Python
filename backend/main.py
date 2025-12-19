from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from fastapi.staticfiles import StaticFiles
from routers import lawyers, clients, cases, appointments, dashboard, books, articles, payments, analytics, auth, upload
from websocket_manager import manager
import models
import database
import os

models.Base.metadata.create_all(bind=database.engine)

# Create uploads directory if not exists (redundant but safe)
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# ... (admin creation code skipped for brevity, keeping it unchanged) ...

# Seed default admin
def create_default_admin():
    db = database.SessionLocal()
    from routers.auth import get_password_hash
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
        print(f"Default admin created: {admin_email}")
    db.close()

create_default_admin()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(lawyers.router)
app.include_router(clients.router)
app.include_router(cases.router)
app.include_router(appointments.router)
app.include_router(dashboard.router)
app.include_router(books.router)
app.include_router(articles.router)
app.include_router(payments.router)
app.include_router(analytics.router)

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo or process if needed, for now just keeping alive or broadcasting
            # await manager.broadcast(f"Client #{client_id} says: {data}")
            pass 
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/")
def read_root():
    return {"message": "Welcome to LegalWise Admin API"}