from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    UserID = Column(Integer, primary_key=True, index=True)
    Name = Column(String(100))
    Email = Column(String(100), unique=True, index=True)
    Phone = Column(String(20), unique=True)
    CreatedAt = Column(DateTime, default=datetime.utcnow)

    addresses = relationship("Address", back_populates="user")
    orders = relationship("Order", back_populates="user")


class Address(Base):
    __tablename__ = "addresses"
    AddressID = Column(Integer, primary_key=True, index=True)
    UserID = Column(Integer, ForeignKey("users.UserID"))
    Label = Column(String(50))
    Street = Column(String(255))
    City = Column(String(100))
    Lat = Column(Float)
    Lng = Column(Float)
    IsDefault = Column(Boolean, default=False)

    user = relationship("User", back_populates="addresses")
    orders = relationship("Order", back_populates="address")


class Category(Base):
    __tablename__ = "categories"
    CategoryID = Column(Integer, primary_key=True, index=True)
    Name = Column(String(100))
    Icon = Column(String(255))

    restaurants = relationship("Restaurant", back_populates="category")


class Restaurant(Base):
    __tablename__ = "restaurants"
    RestaurantID = Column(Integer, primary_key=True, index=True)
    CategoryID = Column(Integer, ForeignKey("categories.CategoryID"))
    Name = Column(String(255))
    GSTIN = Column(String(50))
    Rating = Column(Float, default=0.0)
    IsOpen = Column(Boolean, default=True)
    DeliveryFee = Column(Float, default=0.0)
    PrepTimeMins = Column(Integer, default=0)

    category = relationship("Category", back_populates="restaurants")
    food_items = relationship("FoodItem", back_populates="restaurant")
    orders = relationship("Order", back_populates="restaurant")


class FoodItem(Base):
    __tablename__ = "food_items"
    FoodID = Column(Integer, primary_key=True, index=True)
    RestaurantID = Column(Integer, ForeignKey("restaurants.RestaurantID"))
    Name = Column(String(255))
    Description = Column(Text)
    BasePrice = Column(Float)
    DynamicPrice = Column(Float, nullable=True)
    IsAvailable = Column(Boolean, default=True)
    IsVeg = Column(Boolean, default=True)
    ImageURL = Column(String(255))

    restaurant = relationship("Restaurant", back_populates="food_items")
    order_items = relationship("OrderItem", back_populates="food_item")


class Driver(Base):
    __tablename__ = "drivers"
    DriverID = Column(Integer, primary_key=True, index=True)
    Name = Column(String(100))
    Phone = Column(String(20), unique=True)
    LicenseNo = Column(String(50), unique=True)
    VehicleType = Column(String(50))
    IsAvailable = Column(Boolean, default=True)
    CurrentLat = Column(Float)
    CurrentLng = Column(Float)
    LastLocationUpdate = Column(DateTime, default=datetime.utcnow)

    orders = relationship("Order", back_populates="driver")
    trackings = relationship("DeliveryTracking", back_populates="driver")


class Order(Base):
    __tablename__ = "orders"
    OrderID = Column(Integer, primary_key=True, index=True)
    UserID = Column(Integer, ForeignKey("users.UserID"))
    RestaurantID = Column(Integer, ForeignKey("restaurants.RestaurantID"))
    AddressID = Column(Integer, ForeignKey("addresses.AddressID"))
    DriverID = Column(Integer, ForeignKey("drivers.DriverID"), nullable=True)
    Status = Column(String(50)) # e.g. Pending, Accepted, Delivering, Delivered, Cancelled
    TotalAmount = Column(Float)
    DeliveryFee = Column(Float)
    Discount = Column(Float, default=0.0)
    PlacedAt = Column(DateTime, default=datetime.utcnow)
    DeliveredAt = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="orders")
    restaurant = relationship("Restaurant", back_populates="orders")
    address = relationship("Address", back_populates="orders")
    driver = relationship("Driver", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")
    payments = relationship("Payment", back_populates="order")
    trackings = relationship("DeliveryTracking", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"
    OrderItemID = Column(Integer, primary_key=True, index=True)
    OrderID = Column(Integer, ForeignKey("orders.OrderID"))
    FoodID = Column(Integer, ForeignKey("food_items.FoodID"))
    Quantity = Column(Integer)
    PriceAtOrder = Column(Float)

    order = relationship("Order", back_populates="items")
    food_item = relationship("FoodItem", back_populates="order_items")


class Payment(Base):
    __tablename__ = "payments"
    PaymentID = Column(Integer, primary_key=True, index=True)
    OrderID = Column(Integer, ForeignKey("orders.OrderID"))
    Method = Column(String(50)) # e.g. Card, Cash, UPI
    Status = Column(String(50)) # e.g. Pending, Completed, Failed
    TransactionID = Column(String(100), nullable=True)
    Amount = Column(Float)
    PaidAt = Column(DateTime, nullable=True)

    order = relationship("Order", back_populates="payments")


class DeliveryTracking(Base):
    __tablename__ = "delivery_tracking"
    TrackingID = Column(Integer, primary_key=True, index=True)
    OrderID = Column(Integer, ForeignKey("orders.OrderID"))
    DriverID = Column(Integer, ForeignKey("drivers.DriverID"))
    Stage = Column(String(50)) # e.g. Picked Up, On the Way, Arrived
    DriverLat = Column(Float)
    DriverLng = Column(Float)
    EtaMins = Column(Integer)
    UpdatedAt = Column(DateTime, default=datetime.utcnow)

    order = relationship("Order", back_populates="trackings")
    driver = relationship("Driver", back_populates="trackings")
