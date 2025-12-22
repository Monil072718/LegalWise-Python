from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database
from routers.common.auth import get_current_user

router = APIRouter(
    prefix="/cases",
    tags=["client-cases"],
)

@router.get("/", response_model=List[schemas.Case])
def get_client_cases(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(database.get_db),
    current_user = Depends(get_current_user)
):
    """Get all cases for the authenticated client"""
    # Ensure user is a client
    if not hasattr(current_user, 'role') or current_user.role != 'client':
        raise HTTPException(status_code=403, detail="Only clients can access this endpoint")
    
    # Filter cases by client ID
    cases = db.query(models.Case).filter(
        models.Case.clientId == current_user.id
    ).offset(skip).limit(limit).all()
    
    return cases

@router.get("/{case_id}", response_model=schemas.Case)
def get_client_case(
    case_id: str,
    db: Session = Depends(database.get_db),
    current_user = Depends(get_current_user)
):
    """Get a specific case if it belongs to the authenticated client"""
    if not hasattr(current_user, 'role') or current_user.role != 'client':
        raise HTTPException(status_code=403, detail="Only clients can access this endpoint")
    
    case = db.query(models.Case).filter(
        models.Case.id == case_id,
        models.Case.clientId == current_user.id
    ).first()
    
    if not case:
        raise HTTPException(status_code=404, detail="Case not found or access denied")
    
    return case

@router.get("/{case_id}/documents/{filename}")
def get_case_document(
    case_id: str,
    filename: str,
    db: Session = Depends(database.get_db),
    current_user = Depends(get_current_user)
):
    """Download a case document if the case belongs to the authenticated client"""
    from fastapi.responses import FileResponse
    import os
    
    if not hasattr(current_user, 'role') or current_user.role != 'client':
        raise HTTPException(status_code=403, detail="Only clients can access this endpoint")
    
    # Verify case belongs to client
    case = db.query(models.Case).filter(
        models.Case.id == case_id,
        models.Case.clientId == current_user.id
    ).first()
    
    if not case:
        raise HTTPException(status_code=404, detail="Case not found or access denied")
    
    # Return file
    UPLOAD_DIR = "uploads"
    file_path = os.path.join(UPLOAD_DIR, case_id, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path)
