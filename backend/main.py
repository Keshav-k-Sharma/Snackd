from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
from typing import List

from . import crud, models, schemas
from .database import SessionLocal, engine

# Create tables in the database
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Snackd Backend", description="Food Delivery System API")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Snackd Backend API"}

# --- User Routes ---
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.Email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# --- Restaurant Routes ---
@app.get("/restaurants/", response_model=List[schemas.Restaurant])
def read_restaurants(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    restaurants = crud.get_restaurants(db, skip=skip, limit=limit)
    return restaurants

@app.post("/restaurants/", response_model=schemas.Restaurant)
def create_restaurant(restaurant: schemas.RestaurantCreate, db: Session = Depends(get_db)):
    return crud.create_restaurant(db=db, restaurant=restaurant)

# --- Food Items Routes ---
@app.post("/food-items/", response_model=schemas.FoodItem)
def create_food_item(food_item: schemas.FoodItemCreate, db: Session = Depends(get_db)):
    return crud.create_food_item(db=db, food_item=food_item)

@app.get("/restaurants/{restaurant_id}/food-items/", response_model=List[schemas.FoodItem])
def read_food_items(restaurant_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_food_items_for_restaurant(db=db, restaurant_id=restaurant_id, skip=skip, limit=limit)
