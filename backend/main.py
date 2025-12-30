from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from fastapi.staticfiles import StaticFiles
from routers.admin import lawyers, clients, cases, dashboard, books, articles, payments, analytics, categories
from routers.common import auth, appointments, upload, chat
from routers.client import cases_router, payments_router, books_router, articles_router
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
app.include_router(chat.router)
app.include_router(categories.router)
app.include_router(lawyers.router)
app.include_router(clients.router)
app.include_router(cases.router)
app.include_router(appointments.router)
app.include_router(dashboard.router)
app.include_router(books.router)
app.include_router(articles.router)
app.include_router(payments.router)
app.include_router(analytics.router)

# Client routers
app.include_router(cases_router, prefix="/client")
app.include_router(payments_router, prefix="/client")
app.include_router(books_router, prefix="/client")

app.include_router(articles_router, prefix="/client")
from routers.client import orders
app.include_router(orders.router, prefix="/client")


@app.websocket("/ws/chat")
async def chat_websocket(websocket: WebSocket, token: str = "", db: Session = Depends(database.get_db)):
    """WebSocket endpoint for real-time chat"""
    from routers.common.auth import verify_token
    import json
    
    # Authenticate the connection
    try:
        # Verify token
        if not token:
            await websocket.close(code=1008, reason="Token required")
            return
        
        payload = verify_token(token)
        user_id = payload.get("id")
        user_role = payload.get("role")
        user_name = payload.get("sub") or payload.get("name", "User")
        
        if not user_id or not user_role:
            await websocket.close(code=1008, reason="Invalid token")
            return
        
    except Exception as e:
        print(f"WebSocket auth error: {e}")
        await websocket.close(code=1008, reason="Authentication failed")
        return
    
    # Connect the user
    await manager.connect(user_id, websocket, user_role, user_name)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            message_type = message_data.get("type")
            
            if message_type == "message":
                # Handle chat message
                conversation_id = message_data.get("conversationId")
                content = message_data.get("content")
                
                # Get conversation to determine participants
                conversation = db.query(models.Conversation).filter(
                    models.Conversation.id == conversation_id
                ).first()
                
                if conversation:
                    # Determine the other participant
                    if user_role == "client":
                        other_user_id = conversation.lawyerId
                    else:
                        other_user_id = conversation.clientId
                    
                    # Broadcast message to both participants
                    broadcast_message = {
                        "type": "message",
                        "conversationId": conversation_id,
                        "senderId": user_id,
                        "senderName": user_name,
                        "senderRole": user_role,
                        "content": content,
                        "timestamp": message_data.get("timestamp")
                    }
                    
                    await manager.send_to_conversation(
                        broadcast_message,
                        [user_id, other_user_id]
                    )
                    
            elif message_type == "typing":
                # Handle typing indicator
                conversation_id = message_data.get("conversationId")
                is_typing = message_data.get("isTyping", False)
                
                # Get conversation
                conversation = db.query(models.Conversation).filter(
                    models.Conversation.id == conversation_id
                ).first()
                
                if conversation:
                    # Send typing indicator to the other user
                    if user_role == "client":
                        other_user_id = conversation.lawyerId
                    else:
                        other_user_id = conversation.clientId
                    
                    typing_message = {
                        "type": "typing",
                        "conversationId": conversation_id,
                        "userId": user_id,
                        "isTyping": is_typing
                    }
                    
                    await manager.send_personal_message(typing_message, other_user_id)
                    
    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        print(f"WebSocket error for user {user_id}: {e}")
        manager.disconnect(user_id)

@app.get("/")
def read_root():
    return {"message": "Welcome to LegalWise Admin API"}

# Trigger Reload