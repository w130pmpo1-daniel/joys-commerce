from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
import secrets
from app.database import get_db
from app.models import Customer, User
from app.schemas import (
    CustomerRegister, CustomerLogin, ForgotPassword, ResetPassword,
    CustomerResponse, Token, AdminResponse, AdminLogin, AdminToken
)
from app.auth import get_password_hash, verify_password
from jose import JWTError, jwt
from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/register", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
async def register(customer: CustomerRegister, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Customer).where(Customer.email == customer.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    result = await db.execute(select(Customer).where(Customer.username == customer.username))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Username already taken")
    
    hashed_password = get_password_hash(customer.password)
    verification_token = secrets.token_urlsafe(32)
    
    db_customer = Customer(
        email=customer.email,
        username=customer.username,
        hashed_password=hashed_password,
        name=customer.name,
        phone=customer.phone,
        verification_token=verification_token,
    )
    db.add(db_customer)
    await db.commit()
    await db.refresh(db_customer)
    return db_customer


@router.post("/login", response_model=Token)
async def login(credentials: CustomerLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Customer).where(Customer.email == credentials.email))
    customer = result.scalar_one_or_none()
    
    if not customer or not verify_password(credentials.password, customer.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not customer.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
    access_token = create_access_token({"sub": customer.email, "user_id": customer.id})
    return Token(
        access_token=access_token,
        token_type="bearer",
        customer=customer
    )


@router.post("/forgot-password")
async def forgot_password(data: ForgotPassword, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Customer).where(Customer.email == data.email))
    customer = result.scalar_one_or_none()
    
    if customer:
        reset_token = secrets.token_urlsafe(32)
        customer.reset_token = reset_token
        customer.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
        await db.commit()
    
    return {"message": "If the email exists, a reset link has been sent"}


@router.post("/reset-password")
async def reset_password(data: ResetPassword, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Customer).where(
            Customer.reset_token == data.token,
            Customer.reset_token_expires > datetime.utcnow()
        )
    )
    customer = result.scalar_one_or_none()
    
    if not customer:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    customer.hashed_password = get_password_hash(data.new_password)
    customer.reset_token = None
    customer.reset_token_expires = None
    await db.commit()
    
    return {"message": "Password reset successful"}


@router.get("/me", response_model=CustomerResponse)
async def get_current_customer(
    db: AsyncSession = Depends(get_db),
    authorization: str = None
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    result = await db.execute(select(Customer).where(Customer.email == email))
    customer = result.scalar_one_or_none()
    
    if not customer:
        raise HTTPException(status_code=404, detail="User not found")
    
    return customer


@router.post("/admin/login", response_model=AdminToken)
async def admin_login(credentials: AdminLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == credentials.email))
    admin = result.scalar_one_or_none()
    
    if not admin or not verify_password(credentials.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
    if not admin.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not an admin account"
        )
    
    access_token = create_access_token({"sub": admin.email, "user_id": admin.id, "type": "admin"})
    return AdminToken(
        access_token=access_token,
        token_type="bearer",
        admin=admin
    )


@router.put("/profile", response_model=CustomerResponse)
async def update_profile(
    data: dict,
    db: AsyncSession = Depends(get_db),
    authorization: str = None
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    result = await db.execute(select(Customer).where(Customer.email == email))
    customer = result.scalar_one_or_none()
    
    if not customer:
        raise HTTPException(status_code=404, detail="User not found")
    
    for key, value in data.items():
        if hasattr(customer, key) and value is not None:
            setattr(customer, key, value)
    
    await db.commit()
    await db.refresh(customer)
    return customer
