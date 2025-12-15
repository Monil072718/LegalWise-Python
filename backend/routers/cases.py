from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database

router = APIRouter(
    prefix="/cases",
    tags=["cases"],
)

import uuid

@router.get("/", response_model=List[schemas.Case])
def read_cases(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    cases = db.query(models.Case).offset(skip).limit(limit).all()
    return cases

@router.get("/{case_id}", response_model=schemas.Case)
def read_case(case_id: str, db: Session = Depends(database.get_db)):
    db_case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if db_case is None:
        raise HTTPException(status_code=404, detail="Case not found")
    return db_case

@router.post("/", response_model=schemas.Case)
def create_case(case: schemas.CaseBase, db: Session = Depends(database.get_db)):
    db_case = models.Case(**case.dict(), id=str(uuid.uuid4()))
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    
    # Broadcast update
    from websocket_manager import manager
    import asyncio
    asyncio.create_task(manager.broadcast(f"New Case Created: {db_case.title}"))
    
    return db_case

@router.put("/{case_id}", response_model=schemas.Case)
def update_case(case_id: str, case: schemas.CaseBase, db: Session = Depends(database.get_db)):
    db_case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if db_case is None:
        raise HTTPException(status_code=404, detail="Case not found")
    
    for key, value in case.dict().items():
        setattr(db_case, key, value)
    
    db.commit()
    db.refresh(db_case)
    return db_case

@router.delete("/{case_id}")
def delete_case(case_id: str, db: Session = Depends(database.get_db)):
    db_case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if db_case is None:
        raise HTTPException(status_code=404, detail="Case not found")
    
    db.delete(db_case)
    db.commit()
    return {"ok": True}
