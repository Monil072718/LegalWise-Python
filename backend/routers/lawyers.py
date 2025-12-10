from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database

router = APIRouter(
    prefix="/lawyers",
    tags=["lawyers"],
)

@router.get("/", response_model=List[schemas.Lawyer])
def read_lawyers(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    lawyers = db.query(models.Lawyer).offset(skip).limit(limit).all()
    return lawyers

@router.get("/{lawyer_id}", response_model=schemas.Lawyer)
def read_lawyer(lawyer_id: str, db: Session = Depends(database.get_db)):
    db_lawyer = db.query(models.Lawyer).filter(models.Lawyer.id == lawyer_id).first()
    if db_lawyer is None:
        raise HTTPException(status_code=404, detail="Lawyer not found")
    return db_lawyer
