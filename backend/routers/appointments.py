from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database

router = APIRouter(
    prefix="/appointments",
    tags=["appointments"],
)

@router.get("/", response_model=List[schemas.Appointment])
def read_appointments(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    appointments = db.query(models.Appointment).offset(skip).limit(limit).all()
    return appointments
