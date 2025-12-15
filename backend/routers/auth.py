from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
import os

import database
import models
import schemas
import uuid # Imported uuid

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

# Utils
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependencies
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    if role == "lawyer":
        user = db.query(models.Lawyer).filter(models.Lawyer.email == token_data.email).first()
    elif role == "client":
        user = db.query(models.Client).filter(models.Client.email == token_data.email).first()
    elif role == "admin":
        user = db.query(models.Admin).filter(models.Admin.email == token_data.email).first()
    else:
        user = None
        
    if user is None:
        raise credentials_exception
    return user

def get_current_lawyer(user = Depends(get_current_user)):
    if user.role != "lawyer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Not authorized as a lawyer"
        )
    return user

# Routes
# @router.post("/lawyer/register", response_model=schemas.Lawyer)
# def register_lawyer(lawyer: schemas.LawyerCreate, db: Session = Depends(get_db)):
#     db_lawyer = db.query(models.Lawyer).filter(models.Lawyer.email == lawyer.email).first()
#     if db_lawyer:
#         raise HTTPException(status_code=400, detail="Email already registered")
#     
#     hashed_password = get_password_hash(lawyer.password)
#     
#     # Create new lawyer instance
#     # Note: We exclude 'password' from the dict before creating the model
#     lawyer_data = lawyer.dict(exclude={"password"})
#     new_lawyer = models.Lawyer(
#         **lawyer_data,
#         hashed_password=hashed_password,
#         role="lawyer",
#         createdAt=datetime.now().strftime("%Y-%m-%d")
#     )
#     
#     db.add(new_lawyer)
#     db.commit()
#     db.refresh(new_lawyer)
#     return new_lawyer

@router.post("/lawyer/login", response_model=schemas.Token)
def login_lawyer(form_data: schemas.LawyerLogin, db: Session = Depends(get_db)):
    lawyer = db.query(models.Lawyer).filter(models.Lawyer.email == form_data.email).first()
    if not lawyer or not verify_password(form_data.password, lawyer.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": lawyer.email, "role": "lawyer", "id": lawyer.id}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/admin/login", response_model=schemas.Token)
def login_admin(form_data: schemas.AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(models.Admin).filter(models.Admin.email == form_data.email).first()
    if not admin or not verify_password(form_data.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.email, "role": "admin", "id": admin.id}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=schemas.Token)
def login_universal(form_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    # Check Admin first
    admin = db.query(models.Admin).filter(models.Admin.email == form_data.email).first()
    if admin and verify_password(form_data.password, admin.hashed_password):
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": admin.email, "role": "admin", "id": admin.id}, 
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    
    # Check Lawyer
    lawyer = db.query(models.Lawyer).filter(models.Lawyer.email == form_data.email).first()
    if lawyer and verify_password(form_data.password, lawyer.hashed_password):
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": lawyer.email, "role": "lawyer", "id": lawyer.id}, 
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
        
    # Check Client (Future)
    # client = db.query(models.Client).filter(models.Client.email == form_data.email).first()
    # ...

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect email or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

# Dependency update for admin?
# We can use get_current_user generally, but need to make sure models.Admin is queried if role is admin


