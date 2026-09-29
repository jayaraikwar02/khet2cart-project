from pydantic import BaseModel, EmailStr
from typing import List, Optional
import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    phone: Optional[str] = None
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    farm_size: Optional[str] = None
    location: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(UserBase):
    id: str
    avatar: Optional[str] = None
    token: Optional[str] = None
    class Config:
        from_attributes = True

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    unit: str = "kg"
    quantity: int = 50
    harvest_date: Optional[str] = None
    organic: bool = True
    description: Optional[str] = None
    image: Optional[str] = None

class OrderItemCreate(BaseModel):
    productId: str
    productName: str
    farmerId: str
    farmerName: str
    price: float
    quantity: int
    unit: str
    image: str

class OrderCreate(BaseModel):
    consumerName: Optional[str] = None
    consumerPhone: Optional[str] = None
    address: str
    city: str
    state: str
    pincode: str
    deliveryType: str = "home_delivery"
    paymentMethod: str = "upi"
    items: Optional[List[OrderItemCreate]] = None
