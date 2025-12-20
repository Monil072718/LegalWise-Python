from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
import models, database

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"],
)

@router.get("/stats")
def get_stats(db: Session = Depends(database.get_db)):
    lawyers_count = db.query(models.Lawyer).count()
    users_count = db.query(models.Client).count() + lawyers_count
    pending_requests = db.query(models.Lawyer).filter(models.Lawyer.status == 'pending').count()
    revenue_month = 45320 # Using mock value as dynamic calculation needs more transaction data
    upcoming_appointments = db.query(models.Appointment).filter(models.Appointment.status == 'approved').count()
    pending_client_requests = db.query(models.Appointment).filter(models.Appointment.status == 'pending').count()

    return {
        "active_cases": db.query(models.Case).filter(models.Case.status != 'closed').count(),
        "total_users": users_count,
        "pending_requests": pending_requests,
        "revenue_month": revenue_month,
        "upcoming_appointments": upcoming_appointments,
        "pending_client_requests": pending_client_requests
    }

@router.get("/revenue")
def get_revenue():
    # Mock data for charts
    return [
        { "month": 'Jan', "revenue": 32000, "cases": 45 },
        { "month": 'Feb', "revenue": 38000, "cases": 52 },
        { "month": 'Mar', "revenue": 35000, "cases": 48 },
        { "month": 'Apr', "revenue": 42000, "cases": 61 },
        { "month": 'May', "revenue": 39000, "cases": 55 },
        { "month": 'Jun', "revenue": 45000, "cases": 67 }
    ]

@router.get("/case-status")
def get_case_status(db: Session = Depends(database.get_db)):
    # Simple aggregation
    in_progress = db.query(models.Case).filter(models.Case.status == 'in-progress').count()
    pending = db.query(models.Case).filter(models.Case.status == 'open').count() # mapping open -> pending for chart
    closed = db.query(models.Case).filter(models.Case.status == 'closed').count()
    urgent = db.query(models.Case).filter(models.Case.priority == 'high').count()

    return [
        { "name": 'In Progress', "value": in_progress, "color": '#3B82F6' },
        { "name": 'Pending', "value": pending, "color": '#F59E0B' },
        { "name": 'Closed', "value": closed, "color": '#10B981' },
        { "name": 'Urgent', "value": urgent, "color": '#EF4444' }
    ]

@router.get("/recent-activity")
def get_recent_activity():
    # Hardcoded for now as we don't have an activity log table developed yet
    return [
        { "text": "New case assigned to Sarah Johnson", "time": "2 hours ago", "type": "case" },
        { "text": "Payment received from John Smith", "time": "4 hours ago", "type": "payment" },
        { "text": "Appointment scheduled for tomorrow", "time": "6 hours ago", "type": "appointment" },
        { "text": "New lawyer verification completed", "time": "8 hours ago", "type": "verification" }
    ]
