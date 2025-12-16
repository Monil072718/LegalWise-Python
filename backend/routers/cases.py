from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database

router = APIRouter(
    prefix="/cases",
    tags=["cases"],
)

import uuid
from datetime import datetime

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
    try:
        data = case.dict()
        # Ensure documents is initialized if not present (though schema default handles this)
        if "documents" not in data:
            data["documents"] = []
            
        db_case = models.Case(**data, id=str(uuid.uuid4()))
        db.add(db_case)
        db.commit()
        db.refresh(db_case)
        
        return db_case
    except Exception as e:
        print(f"ERROR CREATING CASE: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{case_id}", response_model=schemas.Case)
def update_case(case_id: str, case: schemas.CaseUpdate, db: Session = Depends(database.get_db)):
    db_case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if db_case is None:
        raise HTTPException(status_code=404, detail="Case not found")
    
    for key, value in case.dict(exclude_unset=True).items():
        setattr(db_case, key, value)
    
    db.commit()
    db.refresh(db_case)
    return db_case

    db.delete(db_case)
    db.commit()
    return {"ok": True}

import shutil
import os
from fastapi import File, UploadFile
from fastapi.responses import FileResponse

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/{case_id}/documents", response_model=schemas.Case)
def upload_document(case_id: str, file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    db_case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if db_case is None:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Create case specific folder
    case_dir = os.path.join(UPLOAD_DIR, case_id)
    if not os.path.exists(case_dir):
        os.makedirs(case_dir)
        
    file_path = os.path.join(case_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Update DB
    new_doc = {
        "id": str(uuid.uuid4()),
        "name": file.filename,
        "type": file.content_type,
        "size": f"{os.path.getsize(file_path) / 1024:.1f} KB",
        "uploadedAt": str(datetime.now().date())
    }
    
    # Initialize list if None or ensure it's a list
    current_docs = db_case.documents if db_case.documents else []
    # If it's a string (legacy/sqlite quirk sometimes), parse it? No, SQLAlchemy handles JSON type.
    # But we must create a NEW list to trigger update
    updated_docs = list(current_docs) + [new_doc]
    
    db_case.documents = updated_docs
    # Force flag modified if needed, but reassignment usually works
    from sqlalchemy.orm.attributes import flag_modified
    flag_modified(db_case, "documents")
    
    db.commit()
    db.refresh(db_case)
    return db_case

@router.get("/{case_id}/documents/{filename}")
def download_document(case_id: str, filename: str):
    file_path = os.path.join(UPLOAD_DIR, case_id, filename)
    if not os.path.exists(file_path):
         raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

@router.delete("/{case_id}/documents/{doc_id}")
def delete_document(case_id: str, doc_id: str, db: Session = Depends(database.get_db)):
    db_case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if db_case is None:
        raise HTTPException(status_code=404, detail="Case not found")
        
    current_docs = db_case.documents if db_case.documents else []
    
    # Find doc to delete (to get filename)
    doc_to_delete = next((d for d in current_docs if d["id"] == doc_id), None)
    
    if doc_to_delete:
        # Remove file from disk
        file_path = os.path.join(UPLOAD_DIR, case_id, doc_to_delete["name"])
        if os.path.exists(file_path):
            os.remove(file_path)
            
        # Remove from DB
        updated_docs = [d for d in current_docs if d["id"] != doc_id]
        db_case.documents = updated_docs
        
        from sqlalchemy.orm.attributes import flag_modified
        flag_modified(db_case, "documents")
        
        db.commit()
        
    return {"ok": True}
