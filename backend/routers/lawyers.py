from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database

router = APIRouter(
    prefix="/lawyers",
    tags=["lawyers"],
)

import uuid

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

@router.post("/", response_model=schemas.Lawyer)
def create_lawyer(lawyer: schemas.LawyerCreate, db: Session = Depends(database.get_db)):
    from routers.auth import get_password_hash
    try:
        hashed_password = get_password_hash(lawyer.password)
        
        lawyer_data = lawyer.dict(exclude={"password"})
        db_lawyer = models.Lawyer(
            **lawyer_data,
            hashed_password=hashed_password,
            id=str(uuid.uuid4())
        )
        db.add(db_lawyer)
        db.commit()
        db.refresh(db_lawyer)
        return db_lawyer
    except Exception as e:
        db.rollback()
        print(f"Error creating lawyer: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create lawyer: {str(e)}")

@router.put("/{lawyer_id}", response_model=schemas.Lawyer)
def update_lawyer(lawyer_id: str, lawyer: schemas.LawyerUpdate, db: Session = Depends(database.get_db)):
    db_lawyer = db.query(models.Lawyer).filter(models.Lawyer.id == lawyer_id).first()
    if db_lawyer is None:
        raise HTTPException(status_code=404, detail="Lawyer not found")
    
    for key, value in lawyer.dict(exclude_unset=True).items():
        setattr(db_lawyer, key, value)
    
    db.commit()
    db.refresh(db_lawyer)
    return db_lawyer

@router.delete("/{lawyer_id}")
def delete_lawyer(lawyer_id: str, db: Session = Depends(database.get_db)):
    db_lawyer = db.query(models.Lawyer).filter(models.Lawyer.id == lawyer_id).first()
    if db_lawyer is None:
        raise HTTPException(status_code=404, detail="Lawyer not found")
    
    db.delete(db_lawyer)
    db.commit()
    return {"ok": True}
