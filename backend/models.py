from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String) # 'consumer', 'farmer', 'admin'
    phone = Column(String, nullable=True)
    village = Column(String, nullable=True)
    district = Column(String, nullable=True)
    state = Column(String, nullable=True)
    farm_size = Column(String, nullable=True)
    location = Column(String, nullable=True)
    avatar = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farmer_profile = relationship("FarmerProfile", back_populates="user", uselist=False)
    orders = relationship("Order", back_populates="consumer")

class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    farmer_name = Column(String)
    village = Column(String)
    district = Column(String)
    state = Column(String)
    years_of_farming = Column(Integer, default=5)
    farm_size = Column(String)
    rating = Column(Float, default=4.9)
    total_orders = Column(Integer, default=0)
    verified = Column(Boolean, default=True)
    bio = Column(Text)
    phone = Column(String)
    avatar = Column(String)

    user = relationship("User", back_populates="farmer_profile")
    products = relationship("Product", back_populates="farmer")

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True)
    farmer_id = Column(String, ForeignKey("farmer_profiles.id"))
    farmer_name = Column(String)
    village = Column(String)
    district = Column(String)
    name = Column(String, index=True)
    category = Column(String, index=True)
    price = Column(Float)
    unit = Column(String, default="kg")
    quantity = Column(Integer, default=50)
    harvest_date = Column(String)
    freshness_score = Column(Integer, default=95)
    organic = Column(Boolean, default=True)
    description = Column(Text)
    image = Column(String)
    fair_price_status = Column(String, default="Fair Price")
    benchmark_price = Column(Float)
    distance_km = Column(Float, default=5.0)

    farmer = relationship("FarmerProfile", back_populates="products")

class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, index=True)
    order_number = Column(String, index=True)
    consumer_id = Column(String, ForeignKey("users.id"))
    consumer_name = Column(String)
    consumer_phone = Column(String)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    pincode = Column(String)
    delivery_instructions = Column(String, nullable=True)
    delivery_type = Column(String, default="home_delivery")
    payment_method = Column(String, default="upi")
    payment_status = Column(String, default="paid")
    subtotal = Column(Float)
    delivery_fee = Column(Float, default=30.0)
    platform_fee = Column(Float, default=5.0)
    total_amount = Column(Float)
    farmer_earnings = Column(Float)
    status = Column(String, default="placed") # placed, farmer_accepted, prepared, out_for_delivery, delivered
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    consumer = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String, primary_key=True, index=True)
    order_id = Column(String, ForeignKey("orders.id"))
    product_id = Column(String, ForeignKey("products.id"))
    product_name = Column(String)
    farmer_id = Column(String)
    farmer_name = Column(String)
    price = Column(Float)
    quantity = Column(Integer)
    unit = Column(String)
    image = Column(String)

    order = relationship("Order", back_populates="items")
