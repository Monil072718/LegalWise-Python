from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database
from routers.common.auth import get_password_hash, get_current_admin, get_current_user
from datetime import datetime
import uuid

router = APIRouter(
    prefix="/clients",
    tags=["clients"]
)

@router.get("/", response_model=List[schemas.Client])
def read_clients(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user = Depends(get_current_user)):
    # Permission check: Admin or Lawyer
    if current_user.role not in ["admin", "lawyer"]:
        raise HTTPException(status_code=403, detail="Not authorized to view clients")

    clients = db.query(models.Client).offset(skip).limit(limit).all()
    return clients

@router.get("/{client_id}", response_model=schemas.Client)
def read_client(client_id: str, db: Session = Depends(database.get_db), current_user = Depends(get_current_user)):
    # Permission check: Admin, Lawyer, or Self
    if current_user.role not in ["admin", "lawyer"] and current_user.id != client_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this profile")

    db_client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client

@router.post("/", response_model=schemas.Client)
def create_client(client: schemas.ClientBase, db: Session = Depends(database.get_db), current_user = Depends(get_current_admin)):
    db_client = models.Client(**client.dict(), id=str(uuid.uuid4()))
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@router.put("/{client_id}", response_model=schemas.Client)
def update_client(client_id: str, client: schemas.ClientUpdate, db: Session = Depends(database.get_db), current_user = Depends(get_current_user)):
    # Permission check
    if current_user.role != "admin" and current_user.id != client_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")

    db_client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    
    update_data = client.dict(exclude_unset=True)
    
    # Filter sensitive fields for non-admins
    if current_user.role != "admin":
        sensitive_fields = ["role", "status", "consultations", "booksDownloaded", "articlesRead", "totalSpent", "createdAt"]
        for field in sensitive_fields:
            update_data.pop(field, None)

    for key, value in update_data.items():
        setattr(db_client, key, value)
    
    db.commit()
    db.refresh(db_client)
    return db_client

@router.delete("/{client_id}")
def delete_client(client_id: str, db: Session = Depends(database.get_db), current_user = Depends(get_current_admin)):
    db_client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    
    db.delete(db_client)
    db.commit()
    return {"ok": True}

@router.post("/register", response_model=schemas.Token)
def register_client(client: schemas.ClientRegistration, db: Session = Depends(database.get_db)):
    print(f"DEBUG: register_client called with {client.email}")
    db_client = db.query(models.Client).filter(models.Client.email == client.email).first()
    if db_client:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(client.password)
    
    # Exclude password from model dump
    client_data = client.dict(exclude={"password"})
    
    new_client = models.Client(
        **client_data,
        hashed_password=hashed_password,
        role="client",
        status="active",
        subscription_plan="free",
        is_premium=False,
        createdAt=datetime.now().strftime("%Y-%m-%d"),
        id=str(uuid.uuid4())
    )
    
    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    
    # Auto login
    from routers.common.auth import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
    from datetime import timedelta
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_client.email, "role": "client", "id": new_client.id}, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}
