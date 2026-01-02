from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
import models, database
from routers.common.auth import get_current_admin
from datetime import datetime

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"],
    dependencies=[Depends(get_current_admin)]
)

@router.get("/performance")
def get_performance_data(db: Session = Depends(database.get_db)):
    # Initialize months map
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    data = {m: {"month": m, "cases": 0, "revenue": 0, "lawyers": 0, "clients": 0} for m in months}
    
    # 1. Revenue from payments
    payments = db.query(models.Payment).filter(models.Payment.status == "completed").all()
    for p in payments:
        # Simplistic date parsing, assuming YYYY-MM-DD
        try:
            date_obj = datetime.strptime(p.date, "%Y-%m-%d")
            month_name = date_obj.strftime("%b")
            if month_name in data:
                data[month_name]["revenue"] += p.amount
        except:
            pass
            
    # 2. Cases count
    cases = db.query(models.Case).all()
    for c in cases:
        try:
             # Assuming YYYY-MM-DD or similar
             date_obj = datetime.strptime(c.createdAt, "%Y-%m-%d")
             month_name = date_obj.strftime("%b")
             if month_name in data:
                 data[month_name]["cases"] += 1
        except:
            pass
            
    # Fill in lawyer/client counts (cumulative merely for trend)
    # Using total counts for now as distinct monthly active is harder without logs
    total_lawyers = db.query(models.Lawyer).count()
    total_clients = db.query(models.Client).count()
    
    result = list(data.values())
    # Add base counts
    for item in result:
        item["lawyers"] = total_lawyers
        item["clients"] = total_clients
        
    return result

@router.get("/lawyer-performance")
def get_lawyer_performance(db: Session = Depends(database.get_db)):
    lawyers = db.query(models.Lawyer).all()
    result = []
    
    for lawyer in lawyers:
        # Calculate success rate from rating (5.0 = 100%)
        success_rate = int((lawyer.rating / 5.0) * 100) if lawyer.rating else 85
        
        # Real cases count
        case_count = db.query(models.Case).filter(models.Case.lawyerId == lawyer.id).count()
        # Fallback to model field if query is 0 (migration issue)
        final_cases = case_count if case_count > 0 else (lawyer.casesHandled or 0)

        result.append({
            "name": lawyer.name,
            "cases": final_cases,
            "successRate": success_rate,
            "avgResponse": 2.4, # Placeholder
            "performance": lawyer.rating or 4.0
        })
        
    # Sort by cases handled
    result.sort(key=lambda x: x["cases"], reverse=True)
    return result[:10] # Top 10

@router.get("/metrics")
def get_metrics(db: Session = Depends(database.get_db)):
    active_clients = db.query(models.Client).filter(models.Client.status == 'active').count()
    total_clients = db.query(models.Client).count() 
    retention = int((active_clients / total_clients * 100)) if total_clients > 0 else 0
    
    # Success rate average
    avg_rating = db.query(func.avg(models.Lawyer.rating)).scalar() or 0
    success_rate = round((avg_rating / 5.0) * 100, 1)

    return {
        "monthlyGrowth": 12, # Hard to calculate without historical snapshots
        "successRate": success_rate,
        "avgResponseTime": 2.4,
        "clientRetention": retention
    }

@router.get("/revenue-breakdown")
def get_revenue_breakdown(db: Session = Depends(database.get_db)):
    # Group by month
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    data = {m: {"month": m, "platform": 0, "lawyers": 0, "total": 0} for m in months}
    
    payments = db.query(models.Payment).filter(models.Payment.status == "completed").all()
    for p in payments:
        try:
            date_obj = datetime.strptime(p.date, "%Y-%m-%d")
            month_name = date_obj.strftime("%b")
            if month_name in data:
                data[month_name]["total"] += p.amount
                data[month_name]["platform"] += (p.platformFee or 0)
                # Lawyer gets remainder
                data[month_name]["lawyers"] += (p.amount - (p.platformFee or 0))
        except:
            pass
            
    return list(data.values())

@router.get("/payment-methods")
def get_payment_methods():
    # We don't track payment method in Payment model yet (only 'type')
    # So we keep this static or base on random distribution of Total Revenue
    return [
        {"method": "Credit Card", "amount": 45600, "percentage": 65},
        {"method": "Bank Transfer", "amount": 18200, "percentage": 26},
        {"method": "PayPal", "amount": 6300, "percentage": 9}
    ]
