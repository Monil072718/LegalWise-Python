from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import os

from routers.admin import lawyers, clients, cases, dashboard, books, articles, payments, analytics, categories
from routers.common import auth, appointments, upload, chat, ai, reviews

from websocket_manager import manager
import models
import database

# Database
models.Base.metadata.create_all(bind=database.engine)

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

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
app.include_router(reviews.router)

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

# Public Routers
from routers import public_articles, public_lawyers
app.include_router(public_articles.router)
app.include_router(public_lawyers.router)

# Client Routers - Explicit imports to avoid confusion
from routers.client import cases as client_cases, payments as client_payments, books as client_books, articles as client_articles
from routers.client import orders, dashboard as client_dashboard
app.include_router(client_cases.router, prefix="/client")
app.include_router(client_payments.router, prefix="/client")
app.include_router(client_books.router, prefix="/client")
app.include_router(client_articles.router, prefix="/client")
app.include_router(orders.router, prefix="/client")
app.include_router(client_dashboard.router, prefix="/client")

# Lawyer Routers
from routers.lawyer import dashboard as lawyer_dashboard
app.include_router(lawyer_dashboard.router, prefix="/lawyer")

@app.websocket("/ws/chat")
async def chat_websocket(websocket: WebSocket, token: str = "", db: Session = Depends(database.get_db)):
    """WebSocket endpoint for real-time chat"""
    from routers.common.auth import SECRET_KEY, ALGORITHM
    from jose import jwt, JWTError
    import json
    
    # Authenticate
    try:
        if not token:
            await websocket.close(code=1008, reason="Token required")
            return
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("id")
        user_role = payload.get("role")
        user_name = payload.get("sub")
        
        if not user_id:
            await websocket.close(code=1008, reason="Invalid token")
            return
    except Exception as e:
        print(f"WS Auth Error: {e}")
        await websocket.close(code=1008, reason="Authentication failed")
        return

    await manager.connect(user_id, websocket, user_role, user_name)
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            if message_data.get("type") == "message":
                conversation_id = message_data.get("conversationId")
                content = message_data.get("content")
                
                conversation = db.query(models.Conversation).filter(models.Conversation.id == conversation_id).first()
                if conversation:
                    other_id = conversation.lawyerId if user_role == "client" else conversation.clientId
                    await manager.send_to_conversation({
                        "type": "message",
                        "conversationId": conversation_id,
                        "senderId": user_id,
                        "content": content,
                        "timestamp": message_data.get("timestamp")
                    }, [user_id, other_id])
    except WebSocketDisconnect:
        manager.disconnect(user_id) 
    
@app.get("/")
def read_root():
    return {"message": "LegalWise API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)