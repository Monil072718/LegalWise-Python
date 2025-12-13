from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database

router = APIRouter(
    prefix="/articles",
    tags=["articles"],
)

@router.get("/", response_model=List[schemas.Article])
def read_articles(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    articles = db.query(models.Article).offset(skip).limit(limit).all()
    return articles
