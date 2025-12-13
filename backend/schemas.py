from pydantic import BaseModel
from typing import List, Optional

class Document(BaseModel):
    id: str
    name: str
    type: str
    uploadedAt: str
    size: str

class LawyerBase(BaseModel):
    name: str
    email: str
    role: str = "lawyer"
    status: str
    specialization: List[str]
    experience: int
    rating: float
    casesHandled: int
    availability: str
    verified: bool
    createdAt: str
    documents: List[dict] = [] # Simply dicts for now
    phone: Optional[str] = None
    address: Optional[str] = None
    bio: Optional[str] = None

class Lawyer(LawyerBase):
    id: str
    class Config:
        orm_mode = True

class ClientBase(BaseModel):
    name: str
    email: str
    role: str = "client"
    status: str
    consultations: int
    booksDownloaded: int
    articlesRead: int
    totalSpent: float
    createdAt: str
    avatar: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    company: Optional[str] = None
    notes: Optional[str] = None

class Client(ClientBase):
    id: str
    class Config:
        orm_mode = True

class CaseBase(BaseModel):
    title: str
    clientId: str
    lawyerId: str
    status: str
    stage: str
    priority: str
    createdAt: str
    nextHearing: Optional[str] = None
    documents: List[dict] = []

class Case(CaseBase):
    id: str
    class Config:
        orm_mode = True

class AppointmentBase(BaseModel):
    clientName: str
    lawyerName: str
    date: str
    time: str
    type: str
    status: str
    notes: Optional[str] = None

class Appointment(AppointmentBase):
    id: str
    class Config:
        orm_mode = True

class PaymentBase(BaseModel):
    clientName: str
    lawyerName: Optional[str] = None
    amount: float
    type: str
    status: str
    date: str
    platformFee: float

class Payment(PaymentBase):
    id: str
    class Config:
        orm_mode = True

class BookBase(BaseModel):
    title: str
    author: str
    category: str
    price: float
    downloads: int
    rating: float
    publishedAt: str

class Book(BookBase):
    id: str
    class Config:
        orm_mode = True

class ArticleBase(BaseModel):
    title: str
    author: str
    category: str
    views: int
    likes: int
    publishedAt: str
    status: str

class Article(ArticleBase):
    id: str
    class Config:
        orm_mode = True
