from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database
from routers.common.auth import get_current_user

router = APIRouter(
    prefix="/payments",
    tags=["client-payments"],
)

@router.get("/", response_model=List[schemas.Payment])
def get_client_payments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
    current_user = Depends(get_current_user)
):
    """Get all payments for the authenticated client"""
    if not hasattr(current_user, 'role') or current_user.role != 'client':
        raise HTTPException(status_code=403, detail="Only clients can access this endpoint")
    
    # Filter payments by client name (using current_user.name)
    # Note: In future, we should add clientId to Payment model for better filtering
    payments = db.query(models.Payment).filter(
        models.Payment.clientName == current_user.name
    ).offset(skip).limit(limit).all()
    
    return payments

@router.get("/{payment_id}", response_model=schemas.Payment)
def get_client_payment(
    payment_id: str,
    db: Session = Depends(database.get_db),
    current_user = Depends(get_current_user)
):
    """Get a specific payment if it belongs to the authenticated client"""
    if not hasattr(current_user, 'role') or current_user.role != 'client':
        raise HTTPException(status_code=403, detail="Only clients can access this endpoint")
    
    payment = db.query(models.Payment).filter(
        models.Payment.id == payment_id,
        models.Payment.clientName == current_user.name
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found or access denied")
    
    return payment
