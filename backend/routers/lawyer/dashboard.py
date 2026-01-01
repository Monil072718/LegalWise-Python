import models, schemas, database
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from routers.common.auth import get_current_lawyer
from datetime import datetime

router = APIRouter(
    prefix="/dashboard",
    tags=["lawyer-dashboard"],
)

@router.get("/stats")
def get_lawyer_stats(
    db: Session = Depends(database.get_db),
    current_user = Depends(get_current_lawyer)
):
    # 1. Active Cases
    active_cases = db.query(models.Case).filter(
        models.Case.lawyerId == current_user.id,
        models.Case.status != 'Closed'
    ).count()

    # 2. Pending Requests (Appointments that are pending)
    pending_requests = db.query(models.Appointment).filter(
        models.Appointment.lawyerId == current_user.id,
        models.Appointment.status == 'Pending'
    ).count()

    # 3. Upcoming Appointments (Approved and in future)
    today = datetime.now().strftime("%Y-%m-%d")
    upcoming_appointments = db.query(models.Appointment).filter(
        models.Appointment.lawyerId == current_user.id,
        models.Appointment.date >= today,
        models.Appointment.status == 'Approved'
    ).count()

    # 4. Unread Messages
    unread_messages = db.query(models.Conversation).filter(
        models.Conversation.lawyerId == current_user.id
    ).with_entities(models.Conversation.unreadByLawyer).all()
    
    total_unread = sum([conv.unreadByLawyer for conv in unread_messages])

    return {
        "activeCases": active_cases,
        "pendingRequests": pending_requests,
        "upcomingAppointments": upcoming_appointments,
        "unreadMessages": total_unread
    }
