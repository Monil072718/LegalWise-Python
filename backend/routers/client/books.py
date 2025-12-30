from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database
from routers.common.auth import get_current_user
from datetime import datetime
import uuid

router = APIRouter(
    prefix="/books",
    tags=["client-books"],
)

@router.get("/", response_model=List[schemas.Book])
def get_purchased_books(
    skip: int = 0,
    limit: int = 100,
    category: str = None,
    db: Session = Depends(database.get_db),
    current_user = Depends(get_current_user)
):
    """Get only books that the authenticated client has purchased"""
    if not hasattr(current_user, 'role') or current_user.role != 'client':
        raise HTTPException(status_code=403, detail="Only clients can access this endpoint")
    
    # Security check: Show books only if user has booked a lawyer (consultation or case)
    has_booking = db.query(models.Payment).filter(
        models.Payment.clientName == current_user.name,
        models.Payment.type.in_(['consultation', 'case']),
        models.Payment.status == 'completed'
    ).first()
    
    if not has_booking:
        return []
    
    # Get all book purchases for this client
    book_payments = db.query(models.Payment).filter(
        models.Payment.clientName == current_user.name,
        models.Payment.type == "book",
        models.Payment.status == "completed",
        models.Payment.itemId.isnot(None)
    ).all()
    
    # Extract book IDs
    book_ids = [payment.itemId for payment in book_payments]
    
    # If no books purchased, return empty array (not an error)
    if not book_ids:
        return []
    
    # Query books that match the purchased book IDs
    query = db.query(models.Book).filter(models.Book.id.in_(book_ids))
    
    # Filter by category if provided
    if category:
        query = query.filter(models.Book.category == category)
    
    books = query.offset(skip).limit(limit).all()
    return books

@router.get("/available", response_model=List[schemas.Book])
def get_available_books(
    skip: int = 0,
    limit: int = 100,
    category: str = None,
    db: Session = Depends(database.get_db)
):
    """Get all available books for purchase (no authentication required)"""
    query = db.query(models.Book)
    
    # Filter by category if provided
    if category:
        query = query.filter(models.Book.category == category)
    
    books = query.offset(skip).limit(limit).all()
    return books

@router.get("/{book_id}", response_model=schemas.Book)
def get_book(
    book_id: str,
    db: Session = Depends(database.get_db),
    current_user = Depends(get_current_user)
):
    """Get a specific book if the client has purchased it"""
    if not hasattr(current_user, 'role') or current_user.role != 'client':
        raise HTTPException(status_code=403, detail="Only clients can access this endpoint")
    
    # Check if client has purchased this book
    book_payment = db.query(models.Payment).filter(
        models.Payment.clientName == current_user.name,
        models.Payment.type == "book",
        models.Payment.status == "completed",
        models.Payment.itemId == book_id
    ).first()
    
    if not book_payment:
        raise HTTPException(status_code=404, detail="Book not found in your library")
    
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    return book

@router.post("/{book_id}/purchase", response_model=schemas.Payment)
def purchase_book(
    book_id: str,
    db: Session = Depends(database.get_db),
    current_user = Depends(get_current_user)
):
    """Purchase a book - creates payment record and updates client stats"""
    if not hasattr(current_user, 'role') or current_user.role != 'client':
        raise HTTPException(status_code=403, detail="Only clients can purchase books")
    
    # Check if already purchased
    existing_purchase = db.query(models.Payment).filter(
        models.Payment.clientName == current_user.name,
        models.Payment.type == "book",
        models.Payment.status == "completed",
        models.Payment.itemId == book_id
    ).first()
    
    if existing_purchase:
        raise HTTPException(status_code=400, detail="You have already purchased this book")
    
    # Get the book
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Check if book is in stock
    if book.quantity <= 0:
        raise HTTPException(status_code=400, detail="Book is out of stock")
    
    # Create payment record with itemId
    platform_fee = book.price * 0.1  # 10% platform fee
    payment = models.Payment(
        id=str(uuid.uuid4())[:8],
        clientName=current_user.name,
        lawyerName=None,
        amount=book.price,
        type="book",
        status="completed",
        date=datetime.now().strftime("%Y-%m-%d"),
        platformFee=platform_fee,
        itemId=book_id  # Track which book was purchased
    )
    db.add(payment)
    
    # Update book stats
    book.downloads += 1
    book.quantity -= 1
    
    # Update client stats
    client = db.query(models.Client).filter(models.Client.id == current_user.id).first()
    if client:
        client.booksDownloaded = (client.booksDownloaded or 0) + 1
        client.totalSpent = (client.totalSpent or 0) + book.price
    
    db.commit()
    db.refresh(payment)
    
    return payment
