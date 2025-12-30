from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database
from routers.common.auth import get_current_user
import uuid
from datetime import datetime

router = APIRouter(
    prefix="/orders",
    tags=["orders"]
)

@router.post("/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(database.get_db), current_user = Depends(get_current_user)):
    # Verify user is client
    if not hasattr(current_user, 'role') or current_user.role != "client":
        raise HTTPException(status_code=403, detail="Only clients can place orders")
    
    # Create order
    new_order = models.Order(
        id=str(uuid.uuid4()),
        clientId=current_user.id,
        items=[item.dict() for item in order.items],
        totalAmount=order.totalAmount,
        status="completed", # Auto-complete for now
        createdAt=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order

@router.get("/history", response_model=List[schemas.Order])
def get_order_history(db: Session = Depends(database.get_db), current_user = Depends(get_current_user)):
    if not hasattr(current_user, 'role') or current_user.role != "client":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    orders = db.query(models.Order).filter(models.Order.clientId == current_user.id).all()
    return orders
