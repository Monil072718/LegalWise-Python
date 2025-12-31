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
    hashed_password = Column(String)

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
    image = Column(String, nullable=True)



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
    description = Column(String, nullable=True)
    documents = Column(JSON)

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String, primary_key=True, index=True)
    clientName = Column(String)
    lawyerName = Column(String)
    # Map python 'lawyerId' to db 'lawyerid' to handle postgres case folding
    lawyerId = Column("lawyerid", String, index=True)
    clientId = Column("clientid", String, index=True)
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
    itemId = Column(String, nullable=True)  # Track which book/item was purchased

class Book(Base):
    __tablename__ = "books"

    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    author = Column(String)
    category = Column(String)
    price = Column(Float)
    downloads = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    publishedAt = Column(String)
    isbn = Column(String, nullable=True)
    quantity = Column(Integer, default=0)
    cover_image = Column(String, nullable=True)
    description = Column(String, nullable=True)

class Article(Base):
    __tablename__ = "articles"

    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    author = Column(String)
    category = Column(String)
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    publishedAt = Column(String)
    status = Column(String)

class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    avg_rate = Column(Float)
    lawyers_count = Column(Integer, default=0)
    total_hires = Column(Integer, default=0)
    avg_rating = Column(Float, default=0.0) # draft, published
    content = Column(String, nullable=True)
    image = Column(String, nullable=True)

class PasswordReset(Base):
    __tablename__ = "password_resets"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    otp = Column(String)
    expires_at = Column(String) # ISO format datetime

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String, primary_key=True, index=True)
    clientId = Column(String, index=True)
    lawyerId = Column(String, index=True)
    clientName = Column(String)
    lawyerName = Column(String)
    lastMessage = Column(String, nullable=True)
    lastMessageAt = Column(String, nullable=True)
    unreadByClient = Column(Integer, default=0)
    unreadByLawyer = Column(Integer, default=0)
    createdAt = Column(String)

class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, index=True)
    conversationId = Column(String, index=True)
    senderId = Column(String)
    senderRole = Column(String)  # 'client' or 'lawyer'
    senderName = Column(String)
    content = Column(String)
    timestamp = Column(String)
    read = Column(Boolean, default=False)

class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, index=True)
    clientId = Column(String, index=True)
    items = Column(JSON) # List of {bookId, title, price, quantity}
    totalAmount = Column(Float)
    status = Column(String) # 'completed', 'pending'
    shippingAddress = Column(String, name="shippingaddress", nullable=True)
    paymentMethod = Column(String, name="paymentmethod", nullable=True)
    fullName = Column(String, name="fullname", nullable=True)
    phoneNumber = Column(String, name="phonenumber", nullable=True)
    createdAt = Column(String)


