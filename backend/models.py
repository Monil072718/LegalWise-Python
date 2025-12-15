from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, JSON
from sqlalchemy.orm import relationship
from database import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(String, default="client")
    status = Column(String)
    consultations = Column(Integer)
    booksDownloaded = Column(Integer)
    articlesRead = Column(Integer)
    totalSpent = Column(Float)
    createdAt = Column(String)
    avatar = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    company = Column(String, nullable=True)
    notes = Column(String, nullable=True)

class Admin(Base):
    __tablename__ = "admins"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="admin")
    name = Column(String)
    createdAt = Column(String)

class Lawyer(Base):
    __tablename__ = "lawyers"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="lawyer")
    status = Column(String)
    specialization = Column(JSON) # List of strings
    experience = Column(Integer)
    rating = Column(Float)
    casesHandled = Column(Integer)
    availability = Column(String)
    verified = Column(Boolean, default=False)
    createdAt = Column(String)
    documents = Column(JSON) # List of Document objects
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    bio = Column(String, nullable=True)



class Case(Base):
    __tablename__ = "cases"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    clientId = Column(String) # Foreign key logic managed manually or strictly
    lawyerId = Column(String)
    status = Column(String)
    stage = Column(String)
    priority = Column(String)
    createdAt = Column(String)
    nextHearing = Column(String, nullable=True)
    documents = Column(JSON)

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String, primary_key=True, index=True)
    clientName = Column(String)
    lawyerName = Column(String)
    date = Column(String)
    time = Column(String)
    type = Column(String)
    status = Column(String)
    notes = Column(String, nullable=True)

class Payment(Base):
    __tablename__ = "payments"

    id = Column(String, primary_key=True, index=True)
    clientName = Column(String)
    lawyerName = Column(String, nullable=True)
    amount = Column(Float)
    type = Column(String)
    status = Column(String)
    date = Column(String)
    platformFee = Column(Float)

class Book(Base):
    __tablename__ = "books"

    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    author = Column(String)
    category = Column(String)
    price = Column(Float)
    downloads = Column(Integer)
    rating = Column(Float)
    publishedAt = Column(String)

class Article(Base):
    __tablename__ = "articles"

    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    author = Column(String)
    category = Column(String)
    views = Column(Integer)
    likes = Column(Integer)
    publishedAt = Column(String)
    status = Column(String)

class PasswordReset(Base):
    __tablename__ = "password_resets"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    otp = Column(String)
    expires_at = Column(String) # ISO format datetime
