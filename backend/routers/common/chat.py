from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database
from routers.common.auth import get_current_user
from datetime import datetime
import uuid

router = APIRouter(
    prefix="/chat",
    tags=["chat"],
)

@router.get("/conversations", response_model=List[schemas.Conversation])
def get_conversations(
    db: Session = Depends(database.get_db),
    current_user = Depends(get_current_user)
):
    """Get all conversations for the authenticated user"""
    if not hasattr(current_user, 'role'):
        raise HTTPException(status_code=403, detail="Authentication required")
    
    # Filter conversations based on user role
    if current_user.role == 'client':
        conversations = db.query(models.Conversation).filter(
            models.Conversation.clientId == current_user.id
        ).order_by(models.Conversation.lastMessageAt.desc()).all()
    elif current_user.role == 'lawyer':
        conversations = db.query(models.Conversation).filter(
            models.Conversation.lawyerId == current_user.id
        ).order_by(models.Conversation.lastMessageAt.desc()).all()
    else:
        conversations = []
    
    return conversations

@router.get("/conversations/{conversation_id}/messages", response_model=List[schemas.Message])
def get_messages(
    conversation_id: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
    current_user = Depends(get_current_user)
):
    """Get messages for a specific conversation"""
    if not hasattr(current_user, 'role'):
        raise HTTPException(status_code=403, detail="Authentication required")
    
    # Verify user has access to this conversation
    conversation = db.query(models.Conversation).filter(
        models.Conversation.id == conversation_id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Check access rights
    if current_user.role == 'client' and conversation.clientId != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    elif current_user.role == 'lawyer' and conversation.lawyerId != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get messages
    messages = db.query(models.Message).filter(
        models.Message.conversationId == conversation_id
    ).order_by(models.Message.timestamp.asc()).offset(skip).limit(limit).all()
    
    return messages

@router.post("/conversations/{conversation_id}/messages", response_model=schemas.Message)
def send_message(
    conversation_id: str,
    message_data: schemas.MessageCreate,
    db: Session = Depends(database.get_db),
    current_user = Depends(get_current_user)
):
    """Send a message in a conversation"""
    if not hasattr(current_user, 'role'):
        raise HTTPException(status_code=403, detail="Authentication required")
    
    # Verify conversation exists and user has access
    conversation = db.query(models.Conversation).filter(
        models.Conversation.id == conversation_id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Check access rights
    if current_user.role == 'client' and conversation.clientId != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    elif current_user.role == 'lawyer' and conversation.lawyerId != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Create message
    timestamp = datetime.now().isoformat()
    message = models.Message(
        id=str(uuid.uuid4()),
        conversationId=conversation_id,
        senderId=current_user.id,
        senderRole=current_user.role,
        senderName=current_user.name,
        content=message_data.content,
        timestamp=timestamp,
        read=False
    )
    db.add(message)
    
    # Update conversation
    conversation.lastMessage = message_data.content
    conversation.lastMessageAt = timestamp
    
    # Increment unread count for the other party
    if current_user.role == 'client':
        conversation.unreadByLawyer += 1
    else:
        conversation.unreadByClient += 1
    
    db.commit()
    db.refresh(message)
    
    return message

@router.put("/conversations/{conversation_id}/read")
def mark_as_read(
    conversation_id: str,
    db: Session = Depends(database.get_db),
    current_user = Depends(get_current_user)
):
    """Mark all messages in a conversation as read"""
    if not hasattr(current_user, 'role'):
        raise HTTPException(status_code=403, detail="Authentication required")
    
    # Verify conversation exists and user has access
    conversation = db.query(models.Conversation).filter(
        models.Conversation.id == conversation_id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Check access rights
    if current_user.role == 'client' and conversation.clientId != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    elif current_user.role == 'lawyer' and conversation.lawyerId != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Mark messages as read
    db.query(models.Message).filter(
        models.Message.conversationId == conversation_id,
        models.Message.senderId != current_user.id,
        models.Message.read == False
    ).update({"read": True})
    
    # Reset unread count
    if current_user.role == 'client':
        conversation.unreadByClient = 0
    else:
        conversation.unreadByLawyer = 0
    
    db.commit()
    
    return {"message": "Messages marked as read"}

@router.get("/conversations/with/{other_user_id}", response_model=schemas.Conversation)
def get_or_create_conversation(
    other_user_id: str,
    db: Session = Depends(database.get_db),
    current_user = Depends(get_current_user)
):
    """Get or create a conversation with another user"""
    if not hasattr(current_user, 'role'):
        raise HTTPException(status_code=403, detail="Authentication required")
    
    # Determine client and lawyer IDs
    if current_user.role == 'client':
        client_id = current_user.id
        lawyer_id = other_user_id
        
        # Get lawyer info
        lawyer = db.query(models.Lawyer).filter(models.Lawyer.id == lawyer_id).first()
        if not lawyer:
            raise HTTPException(status_code=404, detail="Lawyer not found")
        
        client_name = current_user.name
        lawyer_name = lawyer.name
        
    elif current_user.role == 'lawyer':
        client_id = other_user_id
        lawyer_id = current_user.id
        
        # Get client info
        client = db.query(models.Client).filter(models.Client.id == client_id).first()
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        
        client_name = client.name
        lawyer_name = current_user.name
    else:
        raise HTTPException(status_code=403, detail="Invalid user role")
    
    # Check if conversation already exists
    conversation = db.query(models.Conversation).filter(
        models.Conversation.clientId == client_id,
        models.Conversation.lawyerId == lawyer_id
    ).first()
    
    if conversation:
        return conversation
    
    # Create new conversation
    conversation = models.Conversation(
        id=str(uuid.uuid4()),
        clientId=client_id,
        lawyerId=lawyer_id,
        clientName=client_name,
        lawyerName=lawyer_name,
        createdAt=datetime.now().isoformat()
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    
    return conversation
