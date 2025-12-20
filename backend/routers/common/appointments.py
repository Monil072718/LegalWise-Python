from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database

router = APIRouter(
    prefix="/appointments",
    tags=["appointments"],
)

import uuid

from routers.common.auth import get_current_user

@router.get("/", response_model=List[schemas.Appointment])
def read_appointments(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user = Depends(get_current_user)):
    # Admin sees all, Lawyer sees own (where lawyerId or lawyerName matches? Schema has lawyerName, need to check model)
    # Model has lawyerName, but ideally should be linked by ID. 
    # Let's check model again. Model has lawyerName only? That's weak.
    # checking models.Appointment: clientName, lawyerName.
    # This is a schema design flaw (no lawyerId foreign key). 
    # For now, we will filter by lawyerName matching current_user.name OR if we change model.
    # It's better to verify if we can match by name. 
    # Actually, current_user (Lawyer) has 'name'. 
    
    if hasattr(current_user, "role") and current_user.role == "lawyer":
         # Filter by lawyerId match
         appointments = db.query(models.Appointment).filter(models.Appointment.lawyerId == current_user.id).offset(skip).limit(limit).all()
    else:
         appointments = db.query(models.Appointment).offset(skip).limit(limit).all()
    return appointments

@router.get("/lawyer/{lawyer_id}", response_model=List[schemas.Appointment])
def read_lawyer_appointments(lawyer_id: str, db: Session = Depends(database.get_db)):
    # Public endpoint to check availability
    appointments = db.query(models.Appointment).filter(models.Appointment.lawyerId == lawyer_id).all()
    return appointments

@router.get("/client/{client_id}", response_model=List[schemas.Appointment])
def read_client_appointments(client_id: str, db: Session = Depends(database.get_db)):
    appointments = db.query(models.Appointment).filter(models.Appointment.clientId == client_id).all()
    return appointments

@router.get("/{appointment_id}", response_model=schemas.Appointment)
def read_appointment(appointment_id: str, db: Session = Depends(database.get_db)):
    db_appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if db_appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return db_appointment

@router.post("/", response_model=schemas.Appointment)
def create_appointment(appointment: schemas.AppointmentBase, db: Session = Depends(database.get_db)):
    db_appointment = models.Appointment(**appointment.dict(), id=str(uuid.uuid4()))
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

@router.put("/{appointment_id}", response_model=schemas.Appointment)
def update_appointment(appointment_id: str, appointment: schemas.AppointmentBase, db: Session = Depends(database.get_db)):
    db_appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if db_appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    for key, value in appointment.dict().items():
        setattr(db_appointment, key, value)
    
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

@router.delete("/{appointment_id}")
def delete_appointment(appointment_id: str, db: Session = Depends(database.get_db)):
    db_appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if db_appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    db.delete(db_appointment)
    db.commit()
    return {"ok": True}
