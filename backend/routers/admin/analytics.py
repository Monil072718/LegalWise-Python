from fastapi import APIRouter, Depends
from typing import List, Dict, Any

from routers.common.auth import get_current_admin

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"],
    dependencies=[Depends(get_current_admin)]
)

@router.get("/performance")
def get_performance_data():
    return [
        {"month": "Jan", "cases": 45, "revenue": 32000, "lawyers": 12, "clients": 89},
        {"month": "Feb", "cases": 52, "revenue": 38000, "lawyers": 15, "clients": 156},
        {"month": "Mar", "cases": 48, "revenue": 35000, "lawyers": 18, "clients": 234},
        {"month": "Apr", "cases": 61, "revenue": 42000, "lawyers": 22, "clients": 298},
        {"month": "May", "cases": 55, "revenue": 39000, "lawyers": 25, "clients": 367},
        {"month": "Jun", "cases": 67, "revenue": 45000, "lawyers": 28, "clients": 445}
    ]

@router.get("/lawyer-performance")
def get_lawyer_performance():
    return [
        {"name": "Sarah Johnson", "cases": 23, "successRate": 95, "avgResponse": 2.3},
        {"name": "Michael Chen", "cases": 31, "successRate": 98, "avgResponse": 1.8},
        {"name": "Emily Rodriguez", "cases": 18, "successRate": 92, "avgResponse": 3.1},
        {"name": "David Wilson", "cases": 26, "successRate": 89, "avgResponse": 2.7},
        {"name": "Lisa Taylor", "cases": 19, "successRate": 94, "avgResponse": 2.1}
    ]

@router.get("/metrics")
def get_metrics():
    return {
        "monthlyGrowth": 24,
        "successRate": 94.2,
        "avgResponseTime": 2.4,
        "clientRetention": 87
    }

@router.get("/revenue-breakdown")
def get_revenue_breakdown():
    return [
        {"month": "Jan", "platform": 5200, "lawyers": 46800, "total": 52000},
        {"month": "Feb", "platform": 6100, "lawyers": 54900, "total": 61000},
        {"month": "Mar", "platform": 5800, "lawyers": 52200, "total": 58000},
        {"month": "Apr", "platform": 7200, "lawyers": 64800, "total": 72000},
        {"month": "May", "platform": 6500, "lawyers": 58500, "total": 65000},
        {"month": "Jun", "platform": 7800, "lawyers": 70200, "total": 78000}
    ]

@router.get("/payment-methods")
def get_payment_methods():
    return [
        {"method": "Credit Card", "amount": 45600, "percentage": 65},
        {"method": "Bank Transfer", "amount": 18200, "percentage": 26},
        {"method": "PayPal", "amount": 6300, "percentage": 9}
    ]
