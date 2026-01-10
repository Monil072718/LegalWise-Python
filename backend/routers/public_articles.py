from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database

router = APIRouter(
    prefix="/public/articles",
    tags=["public-articles"]
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[schemas.Article])
def get_public_articles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    articles = db.query(models.Article).filter(models.Article.status == "published").offset(skip).limit(limit).all()
    return articles

@router.get("/{article_id}", response_model=schemas.Article)
def get_public_article(article_id: str, db: Session = Depends(get_db)):
    article = db.query(models.Article).filter(models.Article.id == article_id, models.Article.status == "published").first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article
