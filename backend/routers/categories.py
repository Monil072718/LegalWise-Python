from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database
import uuid

router = APIRouter(
    prefix="/categories",
    tags=["categories"]
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[schemas.Category])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@router.post("/", response_model=schemas.Category)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_category = models.Category(
        id=str(uuid.uuid4()),
        name=category.name,
        description=category.description,
        avg_rate=category.avg_rate,
        lawyers_count=0,
        total_hires=0,
        avg_rating=0.0
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.delete("/{category_id}")
def delete_category(category_id: str, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(category)
    db.commit()
    return {"detail": "Category deleted"}
