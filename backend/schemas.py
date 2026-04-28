from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    Name: str
    Email: str
    Phone: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    UserID: int
    CreatedAt: datetime
    model_config = ConfigDict(from_attributes=True)

# --- Address Schemas ---
class AddressBase(BaseModel):
    Label: str
    Street: str
    City: str
    Lat: float
    Lng: float
    IsDefault: bool = False

class AddressCreate(AddressBase):
    UserID: int

class Address(AddressBase):
    AddressID: int
    UserID: int
    model_config = ConfigDict(from_attributes=True)

# --- Category Schemas ---
class CategoryBase(BaseModel):
    Name: str
    Icon: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    CategoryID: int
    model_config = ConfigDict(from_attributes=True)

# --- Restaurant Schemas ---
class RestaurantBase(BaseModel):
    Name: str
    GSTIN: str
    Rating: float = 0.0
    IsOpen: bool = True
    DeliveryFee: float = 0.0
    PrepTimeMins: int = 0

class RestaurantCreate(RestaurantBase):
    CategoryID: int

class Restaurant(RestaurantBase):
    RestaurantID: int
    CategoryID: int
    model_config = ConfigDict(from_attributes=True)

# --- FoodItem Schemas ---
class FoodItemBase(BaseModel):
    Name: str
    Description: str
    BasePrice: float
    DynamicPrice: Optional[float] = None
    IsAvailable: bool = True
    IsVeg: bool = True
    ImageURL: str

class FoodItemCreate(FoodItemBase):
    RestaurantID: int

class FoodItem(FoodItemBase):
    FoodID: int
    RestaurantID: int
    model_config = ConfigDict(from_attributes=True)

# --- Driver Schemas ---
class DriverBase(BaseModel):
    Name: str
    Phone: str
    LicenseNo: str
    VehicleType: str
    IsAvailable: bool = True
    CurrentLat: float
    CurrentLng: float

class DriverCreate(DriverBase):
    pass

class Driver(DriverBase):
    DriverID: int
    LastLocationUpdate: datetime
    model_config = ConfigDict(from_attributes=True)

# --- OrderItem Schemas ---
class OrderItemBase(BaseModel):
    FoodID: int
    Quantity: int
    PriceAtOrder: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    OrderItemID: int
    OrderID: int
    model_config = ConfigDict(from_attributes=True)

# --- Order Schemas ---
class OrderBase(BaseModel):
    UserID: int
    RestaurantID: int
    AddressID: int
    Status: str
    TotalAmount: float
    DeliveryFee: float
    Discount: float = 0.0

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class Order(OrderBase):
    OrderID: int
    DriverID: Optional[int] = None
    PlacedAt: datetime
    DeliveredAt: Optional[datetime] = None
    items: List[OrderItem] = []
    model_config = ConfigDict(from_attributes=True)

# --- Payment Schemas ---
class PaymentBase(BaseModel):
    OrderID: int
    Method: str
    Status: str
    Amount: float

class PaymentCreate(PaymentBase):
    TransactionID: Optional[str] = None

class Payment(PaymentBase):
    PaymentID: int
    TransactionID: Optional[str] = None
    PaidAt: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

# --- DeliveryTracking Schemas ---
class DeliveryTrackingBase(BaseModel):
    OrderID: int
    DriverID: int
    Stage: str
    DriverLat: float
    DriverLng: float
    EtaMins: int

class DeliveryTrackingCreate(DeliveryTrackingBase):
    pass

class DeliveryTracking(DeliveryTrackingBase):
    TrackingID: int
    UpdatedAt: datetime
    model_config = ConfigDict(from_attributes=True)
