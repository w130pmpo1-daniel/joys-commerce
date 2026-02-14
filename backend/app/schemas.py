from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int = 0
    category: Optional[str] = None
    sku: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    image_url: Optional[str] = None
    thumbnail: Optional[str] = None
    gallery: Optional[str] = None


class ProductCreate(ProductBase):
    is_active: bool = True


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    category: Optional[str] = None
    sku: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    image_url: Optional[str] = None
    thumbnail: Optional[str] = None
    gallery: Optional[str] = None
    is_active: Optional[bool] = None


class ProductResponse(ProductBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    order_number: str
    customer_name: str
    customer_email: Optional[str] = None
    total_amount: float
    status: str = "pending"


class OrderCreate(OrderBase):
    pass


class OrderResponse(OrderBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_users: int
    total_products: int
    total_orders: int
    total_revenue: float
    recent_orders: list
    top_products: list


class CustomerRegister(BaseModel):
    email: EmailStr
    username: str
    password: str
    name: Optional[str] = None
    phone: Optional[str] = None


class CustomerLogin(BaseModel):
    email: EmailStr
    password: str


class ForgotPassword(BaseModel):
    email: EmailStr


class ResetPassword(BaseModel):
    token: str
    new_password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    customer: "CustomerResponse"


class CustomerResponse(BaseModel):
    id: int
    email: EmailStr
    username: str
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CustomerCreate(BaseModel):
    email: EmailStr
    username: str
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    is_active: bool = True
    is_verified: bool = False


class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class AdminResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str] = None
    is_superuser: bool

    class Config:
        from_attributes = True


class AdminToken(BaseModel):
    access_token: str
    token_type: str
    admin: AdminResponse


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1


class CartItemResponse(BaseModel):
    id: int
    cart_id: int
    product_id: int
    quantity: int
    price: float
    product: "CartProductResponse"
    created_at: datetime

    class Config:
        from_attributes = True


class CartProductResponse(BaseModel):
    id: int
    name: str
    thumbnail: Optional[str] = None
    image_url: Optional[str] = None
    price: float

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    id: int
    customer_id: Optional[int] = None
    session_id: Optional[str] = None
    items: list[CartItemResponse] = []
    total_amount: float = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CartCreate(BaseModel):
    customer_id: Optional[int] = None
    session_id: Optional[str] = None


class AddToCartRequest(BaseModel):
    product_id: int
    quantity: int = 1
    customer_id: Optional[int] = None
    session_id: Optional[str] = None


class UpdateCartItemRequest(BaseModel):
    quantity: int
