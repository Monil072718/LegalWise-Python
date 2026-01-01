import models, schemas, database
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from routers.common.auth import get_current_user
from datetime import datetime

router = APIRouter(
    prefix="/dashboard",
    tags=["client-dashboard"],
)

@router.get("/stats")
def get_client_stats(
    db: Session = Depends(database.get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role != 'client':
        raise HTTPException(status_code=403, detail="Not authorized")

    # 1. Active Cases
    active_cases = db.query(models.Case).filter(
        models.Case.clientId == current_user.id,
        models.Case.status != 'Closed'
    ).count()

    # 2. Upcoming Appointments
    today = datetime.now().strftime("%Y-%m-%d")
    upcoming_appointments = db.query(models.Appointment).filter(
        models.Appointment.clientId == current_user.id,
        models.Appointment.date >= today,
        models.Appointment.status != 'Cancelled'
    ).count()

    # 3. Unread Messages (assuming we can query by conversation/message)
    # Simplified: Find conversations for this client, then count unread by client
    unread_messages = db.query(models.Conversation).filter(
        models.Conversation.clientId == current_user.id
    ).with_entities(models.Conversation.unreadByClient).all()
    
    total_unread = sum([conv.unreadByClient for conv in unread_messages])

    return {
        "activeCases": active_cases,
        "upcomingAppointments": upcoming_appointments,
        "unreadMessages": total_unread
    }
