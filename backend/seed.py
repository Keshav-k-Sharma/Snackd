from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models, schemas
import datetime

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    try:
        # 1. Seed Categories
        categories_data = [
            {"Name": "Pizza", "Icon": "🍕"},
            {"Name": "Burgers", "Icon": "🍔"},
            {"Name": "Sushi", "Icon": "🍣"},
            {"Name": "Biryani", "Icon": "🍛"},
            {"Name": "Pasta", "Icon": "🍝"},
            {"Name": "Salads", "Icon": "🥗"},
            {"Name": "Desserts", "Icon": "🍰"},
            {"Name": "Drinks", "Icon": "🧋"},
        ]
        
        category_map = {}
        for cat in categories_data:
            db_cat = db.query(models.Category).filter(models.Category.Name == cat["Name"]).first()
            if not db_cat:
                db_cat = models.Category(Name=cat["Name"], Icon=cat["Icon"])
                db.add(db_cat)
                db.commit()
                db.refresh(db_cat)
            category_map[cat["Name"]] = db_cat.CategoryID

        # 2. Seed Restaurants
        restaurants_data = [
            {
                "Name": "The Ember Kitchen",
                "Category": "Pizza",
                "GSTIN": "GSTIN123",
                "Rating": 4.8,
                "IsOpen": True,
                "DeliveryFee": 29.0,
                "PrepTimeMins": 30
            },
            {
                "Name": "Biryani Brotherhood",
                "Category": "Biryani",
                "GSTIN": "GSTIN456",
                "Rating": 4.7,
                "IsOpen": True,
                "DeliveryFee": 0.0,
                "PrepTimeMins": 35
            },
        ]

        restaurant_map = {}
        for res in restaurants_data:
            db_res = db.query(models.Restaurant).filter(models.Restaurant.Name == res["Name"]).first()
            if not db_res:
                db_res = models.Restaurant(
                    Name=res["Name"],
                    CategoryID=category_map[res["Category"]],
                    GSTIN=res["GSTIN"],
                    Rating=res["Rating"],
                    IsOpen=res["IsOpen"],
                    DeliveryFee=res["DeliveryFee"],
                    PrepTimeMins=res["PrepTimeMins"]
                )
                db.add(db_res)
                db.commit()
                db.refresh(db_res)
            restaurant_map[res["Name"]] = db_res.RestaurantID

        # 3. Seed Food Items
        food_items_data = [
            {
                "Restaurant": "The Ember Kitchen",
                "Name": "Truffle Mushroom Pizza",
                "Description": "Wild mushrooms, black truffle oil, fontina cheese, fresh thyme on a thin sourdough base.",
                "BasePrice": 399.0,
                "DynamicPrice": 449.0,
                "IsAvailable": True,
                "IsVeg": True,
                "ImageURL": "🍕"
            },
            {
                "Restaurant": "The Ember Kitchen",
                "Name": "Garlic Focaccia",
                "Description": "Wood-fired, rosemary, sea salt, roasted garlic.",
                "BasePrice": 129.0,
                "DynamicPrice": 149.0,
                "IsAvailable": True,
                "IsVeg": True,
                "ImageURL": "🍞"
            },
            {
                "Restaurant": "Biryani Brotherhood",
                "Name": "Dum Gosht Biryani",
                "Description": "Slow-cooked mutton on the bone, aged basmati, saffron-milk crust, caramelised onion.",
                "BasePrice": 499.0,
                "DynamicPrice": 549.0,
                "IsAvailable": True,
                "IsVeg": False,
                "ImageURL": "🍛"
            }
        ]

        for food in food_items_data:
            db_food = db.query(models.FoodItem).filter(
                models.FoodItem.Name == food["Name"],
                models.FoodItem.RestaurantID == restaurant_map[food["Restaurant"]]
            ).first()
            if not db_food:
                db_food = models.FoodItem(
                    RestaurantID=restaurant_map[food["Restaurant"]],
                    Name=food["Name"],
                    Description=food["Description"],
                    BasePrice=food["BasePrice"],
                    DynamicPrice=food["DynamicPrice"],
                    IsAvailable=food["IsAvailable"],
                    IsVeg=food["IsVeg"],
                    ImageURL=food["ImageURL"]
                )
                db.add(db_food)
        
        # 4. Seed a User
        db_user = db.query(models.User).filter(models.User.Email == "arjun@snackd.app").first()
        if not db_user:
            db_user = models.User(
                Name="Arjun Mehta",
                Email="arjun@snackd.app",
                Phone="+91 98765 43210"
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
        
        # 5. Seed an Address
        db_addr = db.query(models.Address).filter(models.Address.UserID == db_user.UserID).first()
        if not db_addr:
            db_addr = models.Address(
                UserID=db_user.UserID,
                Label="Home",
                Street="14/B, Anna Nagar West",
                City="Chennai",
                Lat=13.0827,
                Lng=80.2707,
                IsDefault=True
            )
            db.add(db_addr)

        db.commit()
        print("Database seeded successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
