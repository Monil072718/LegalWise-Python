from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database

router = APIRouter(
    prefix="/public/lawyers",
    tags=["public-lawyers"]
)

@router.get("/", response_model=List[schemas.Lawyer])
def read_public_lawyers(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    # Return active lawyers for public view
    # We can also add 'verified' filter if needed, but let's start with proper public access
    lawyers = db.query(models.Lawyer).filter(models.Lawyer.status == 'active').offset(skip).limit(limit).all()
    return lawyers
