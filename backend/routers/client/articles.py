from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database
from routers.common.auth import get_current_user

router = APIRouter(
    prefix="/articles",
    tags=["client-articles"],
)

@router.get("/", response_model=List[schemas.Article])
def get_articles(
    skip: int = 0,
    limit: int = 100,
    category: str = None,
    db: Session = Depends(database.get_db)
):
    """Get all published articles (no authentication required for browsing)"""
    query = db.query(models.Article).filter(models.Article.status == "published")
    
    # Filter by category if provided
    if category:
        query = query.filter(models.Article.category == category)
    
    articles = query.offset(skip).limit(limit).all()
    return articles

@router.get("/{article_id}", response_model=schemas.Article)
def get_article(
    article_id: str,
    db: Session = Depends(database.get_db),
    current_user = Depends(get_current_user)
):
    """Get a specific article and increment view count"""
    article = db.query(models.Article).filter(
        models.Article.id == article_id,
        models.Article.status == "published"
    ).first()
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Increment views
    article.views += 1
    
    # Update client stats if authenticated
    if current_user and hasattr(current_user, 'role') and current_user.role == 'client':
        client = db.query(models.Client).filter(models.Client.id == current_user.id).first()
        if client:
            client.articlesRead = (client.articlesRead or 0) + 1
    
    db.commit()
    db.refresh(article)
    
    return article

@router.post("/{article_id}/like")
def like_article(
    article_id: str,
    db: Session = Depends(database.get_db),
    current_user = Depends(get_current_user)
):
    """Like an article - increments the like counter"""
    if not hasattr(current_user, 'role') or current_user.role != 'client':
        raise HTTPException(status_code=403, detail="Only clients can like articles")
    
    article = db.query(models.Article).filter(
        models.Article.id == article_id,
        models.Article.status == "published"
    ).first()
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Increment likes
    article.likes += 1
    db.commit()
    db.refresh(article)
    
    return {"message": "Article liked successfully", "likes": article.likes}
