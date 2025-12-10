from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database

router = APIRouter(
    prefix="/payments",
    tags=["payments"],
)

@router.get("/", response_model=List[schemas.Payment])
def read_payments(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    payments = db.query(models.Payment).offset(skip).limit(limit).all()
    return payments
