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
    image: Optional[str] = None

class LawyerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    specialization: Optional[List[str]] = None
    experience: Optional[int] = None
    rating: Optional[float] = None
    casesHandled: Optional[int] = None
    availability: Optional[str] = None
    verified: Optional[bool] = None
    createdAt: Optional[str] = None
    documents: Optional[List[dict]] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    bio: Optional[str] = None

class Lawyer(LawyerBase):
    id: str
    class Config:
        from_attributes = True

class LawyerCreate(LawyerBase):
    password: str

class LawyerLogin(BaseModel):
    email: str
    password: str

class AdminLogin(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class PasswordResetRequest(BaseModel):
    email: str

class OTPVerify(BaseModel):
    email: str
    otp: str

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ClientBase(BaseModel):
    name: str
    email: str
    role: str = "client"
    status: str
    consultations: Optional[int] = 0
    booksDownloaded: Optional[int] = 0
    articlesRead: Optional[int] = 0
    totalSpent: Optional[float] = 0.0
    createdAt: str
    avatar: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    company: Optional[str] = None
    notes: Optional[str] = None

    notes: Optional[str] = None

class ClientCreate(ClientBase):
    password: str

class ClientLogin(BaseModel):
    email: str
    password: str

class ClientUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    consultations: Optional[int] = None
    booksDownloaded: Optional[int] = None
    articlesRead: Optional[int] = None
    totalSpent: Optional[float] = None
    createdAt: Optional[str] = None
    avatar: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    company: Optional[str] = None
    notes: Optional[str] = None

class Client(ClientBase):
    id: str
    class Config:
        from_attributes = True

class CaseBase(BaseModel):
    title: str
    clientId: str
    lawyerId: str
    status: str
    stage: str
    priority: str
    createdAt: str
    nextHearing: Optional[str] = None
    description: Optional[str] = None
    documents: List[dict] = []

class CaseUpdate(BaseModel):
    title: Optional[str] = None
    clientId: Optional[str] = None
    lawyerId: Optional[str] = None
    status: Optional[str] = None
    stage: Optional[str] = None
    priority: Optional[str] = None
    createdAt: Optional[str] = None
    nextHearing: Optional[str] = None
    description: Optional[str] = None
    documents: Optional[List[dict]] = None

class Case(CaseBase):
    id: str
    class Config:
        from_attributes = True

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
        from_attributes = True

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
        from_attributes = True

class BookBase(BaseModel):
    title: str
    author: str
    category: str
    price: float
    downloads: int = 0
    rating: float = 0.0
    publishedAt: str
    isbn: Optional[str] = None
    quantity: int = 0
    cover_image: Optional[str] = None
    description: Optional[str] = None

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    downloads: Optional[int] = None
    rating: Optional[float] = None
    publishedAt: Optional[str] = None
    isbn: Optional[str] = None
    quantity: Optional[int] = None
    cover_image: Optional[str] = None
    description: Optional[str] = None

class Book(BookBase):
    id: str
    class Config:
        from_attributes = True

class ArticleBase(BaseModel):
    title: str
    author: str
    category: str
    views: int = 0
    likes: int = 0
    publishedAt: str
    status: str
    content: Optional[str] = None
    image: Optional[str] = None

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    views: Optional[int] = None
    likes: Optional[int] = None
    publishedAt: Optional[str] = None
    status: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None

class Article(ArticleBase):
    id: str
    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str
    description: str
    avg_rate: float

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    pass

class Category(CategoryBase):
    id: str
    lawyers_count: int
    total_hires: int
    avg_rating: float
    
    class Config:
        from_attributes = True
