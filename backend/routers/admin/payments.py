from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database

router = APIRouter(
    prefix="/payments",
    tags=["payments"],
)

@router.get("/", response_model=List[schemas.Payment])
def read_payments(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    payments = db.query(models.Payment).offset(skip).limit(limit).all()
    return payments

@router.post("/", response_model=schemas.Payment)
def create_payment(payment: schemas.PaymentBase, db: Session = Depends(database.get_db)):
    # Generate ID logic (simple uuid or timestamp)
    import uuid
    db_payment = models.Payment(
        id=str(uuid.uuid4())[:8],
        clientName=payment.clientName,
        lawyerName=payment.lawyerName,
        amount=payment.amount,
        type=payment.type,
        status=payment.status,
        date=payment.date,
        platformFee=payment.platformFee
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment
