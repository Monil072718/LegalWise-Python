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

pwd_context = CryptContext(schemes=["pbkdf2_sha256", "bcrypt"], deprecated="auto")
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

@router.post("/client/login", response_model=schemas.Token)
def login_client(form_data: schemas.ClientLogin, db: Session = Depends(get_db)):
    client = db.query(models.Client).filter(models.Client.email == form_data.email).first()
    if not client or not verify_password(form_data.password, client.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": client.email, "role": "client", "id": client.id}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=schemas.Token)
def login_universal(form_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    print(f"Login attempt for: {form_data.email}")
    # Check Admin first
    admin = db.query(models.Admin).filter(models.Admin.email == form_data.email).first()
    print(f"Admin found: {admin}")
    if admin:
         print(f"Verifying password for admin...")
         is_valid = verify_password(form_data.password, admin.hashed_password)
         print(f"Password valid: {is_valid}")
         if is_valid:
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
        
    
    # Check Client
    client = db.query(models.Client).filter(models.Client.email == form_data.email).first()
    if client and verify_password(form_data.password, client.hashed_password):
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": client.email, "role": "client", "id": client.id}, 
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect email or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

import random
import string
from utils.email import send_email

# NOTE: This endpoint now initiates the OTP flow
@router.post("/forgot-password")
def forgot_password_universal(request: schemas.PasswordResetRequest, db: Session = Depends(get_db)):
    # Check Admin first
    admin = db.query(models.Admin).filter(models.Admin.email == request.email).first()
    role = None
    
    if admin:
        role = "admin"
    else:
        # Check Lawyer
        lawyer = db.query(models.Lawyer).filter(models.Lawyer.email == request.email).first()
        if lawyer:
            role = "lawyer"
    
    if not role:
         # To prevent leaking email existence, we might return success, but user asked to "first check".
         # So we will return 404 if not found as permitted by user request context ("first check...").
         raise HTTPException(status_code=404, detail="Email not registered")

    # Generate 6-digit OTP
    otp = ''.join(random.choices(string.digits, k=6))
    expires_at = (datetime.utcnow() + timedelta(minutes=10)).isoformat()
    
    # Store OTP
    # Check if entry exists for email, update it, else create new
    # Actually, let's just create a new entry for simplicity, or delete old ones
    db.query(models.PasswordReset).filter(models.PasswordReset.email == request.email).delete()
    
    reset_entry = models.PasswordReset(
        email=request.email,
        otp=otp,
        expires_at=expires_at
    )
    db.add(reset_entry)
    db.commit()
    
    # Send Email
    subject = "LegalWise Password Reset OTP"
    body = f"Your OTP for password reset is: {otp}. It expires in 10 minutes."
    send_email(request.email, subject, body)
    
    print(f"DEV LOG - OTP for {request.email}: {otp}")
    
    return {"message": "OTP sent to your email"}

@router.post("/verify-otp")
def verify_otp_universal(data: schemas.OTPVerify, db: Session = Depends(get_db)):
    record = db.query(models.PasswordReset).filter(
        models.PasswordReset.email == data.email, 
        models.PasswordReset.otp == data.otp
    ).first()
    
    if not record:
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    if datetime.fromisoformat(record.expires_at) < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP expired")
        
    # Check role again to issue token
    role = "lawyer" # Default fallback
    admin = db.query(models.Admin).filter(models.Admin.email == data.email).first()
    if admin:
        role = "admin"
    else:
        role = "lawyer" # We assume it exists because OTP was sent
        
    # Generate reset token (short lived, scoped)
    access_token_expires = timedelta(minutes=15)
    reset_token = create_access_token(
        data={"sub": data.email, "role": role, "type": "reset_verified"}, 
        expires_delta=access_token_expires
    )
    
    # Clean up OTP
    db.delete(record)
    db.commit()
    
    return {"token": reset_token, "message": "OTP verified"}

@router.post("/reset-password")
def reset_password_universal(data: schemas.PasswordResetConfirm, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(data.token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        token_type: str = payload.get("type")
        
        # Ensure it's a verified reset token
        if email is None or token_type != "reset_verified":
            raise HTTPException(status_code=400, detail="Invalid token type")
            
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid token")
    
    if role == "admin":
        user = db.query(models.Admin).filter(models.Admin.email == email).first()
    elif role == "lawyer":
        user = db.query(models.Lawyer).filter(models.Lawyer.email == email).first()
    else:
        raise HTTPException(status_code=400, detail="Invalid role in token")

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    
    return {"message": "Password updated successfully"}

# Dependency update for admin?
# We can use get_current_user generally, but need to make sure models.Admin is queried if role is admin


