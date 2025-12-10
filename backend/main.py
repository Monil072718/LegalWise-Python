from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from .routers import lawyers, clients, cases, appointments, dashboard, books, articles, payments, analytics

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lawyers.router)
app.include_router(clients.router)
app.include_router(cases.router)
app.include_router(appointments.router)
app.include_router(dashboard.router)
app.include_router(books.router)
app.include_router(articles.router)
app.include_router(payments.router)
app.include_router(analytics.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to LegalWise Admin API"}
