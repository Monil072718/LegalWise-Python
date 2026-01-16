from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
from pydantic import BaseModel

router = APIRouter(
    prefix="/reviews",
    tags=["reviews"]
)

class ReviewSchema(BaseModel):
    id: str
    name: str
    role: str
    content: str
    rating: int
    image: str | None = None

    class Config:
        orm_mode = True

@router.get("/", response_model=List[ReviewSchema])
def get_reviews(db: Session = Depends(get_db)):
    return db.query(models.Review).all()
