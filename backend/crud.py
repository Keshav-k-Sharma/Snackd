from sqlalchemy.orm import Session
from . import models, schemas

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
