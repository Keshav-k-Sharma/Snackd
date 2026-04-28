from sqlalchemy.orm import Session
from . import models, schemas

# --- Categories ---
def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Category).offset(skip).limit(limit).all()

# --- Users ---
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.UserID == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.Email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- Restaurants ---
def get_restaurants(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Restaurant).offset(skip).limit(limit).all()

def create_restaurant(db: Session, restaurant: schemas.RestaurantCreate):
    db_restaurant = models.Restaurant(**restaurant.model_dump())
    db.add(db_restaurant)
    db.commit()
    db.refresh(db_restaurant)
    return db_restaurant

# --- Food Items ---
def get_food_items_for_restaurant(db: Session, restaurant_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.FoodItem).filter(models.FoodItem.RestaurantID == restaurant_id).offset(skip).limit(limit).all()

def create_food_item(db: Session, food_item: schemas.FoodItemCreate):
    db_food_item = models.FoodItem(**food_item.model_dump())
    db.add(db_food_item)
    db.commit()
    db.refresh(db_food_item)
    return db_food_item

# --- Orders ---
def create_order(db: Session, order: schemas.OrderCreate):
    db_order = models.Order(
        UserID=order.UserID,
        RestaurantID=order.RestaurantID,
        AddressID=order.AddressID,
        Status=order.Status,
        TotalAmount=order.TotalAmount,
        DeliveryFee=order.DeliveryFee,
        Discount=order.Discount
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    for item in order.items:
        db_item = models.OrderItem(
            OrderID=db_order.OrderID,
            FoodID=item.FoodID,
            Quantity=item.Quantity,
            PriceAtOrder=item.PriceAtOrder
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders_by_user(db: Session, user_id: int):
    return db.query(models.Order).filter(models.Order.UserID == user_id).all()
