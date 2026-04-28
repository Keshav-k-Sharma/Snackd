import pymysql
from tabulate import tabulate

def view_data():
    try:
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='admin',
            database='food_delivery',
            cursorclass=pymysql.cursors.DictCursor
        )
        with connection.cursor() as cursor:
            # View Restaurants
            cursor.execute("SELECT RestaurantID, Name, Rating, IsOpen FROM restaurants")
            restaurants = cursor.fetchall()
            print("\n=== RESTAURANTS IN DATABASE ===")
            print(tabulate(restaurants, headers="keys", tablefmt="grid"))

            # View Food Items
            cursor.execute("SELECT FoodID, RestaurantID, Name, BasePrice FROM food_items LIMIT 5")
            items = cursor.fetchall()
            print("\n=== FOOD ITEMS (Sample) ===")
            print(tabulate(items, headers="keys", tablefmt="grid"))

            # View Orders
            cursor.execute("SELECT OrderID, UserID, TotalAmount, Status, PlacedAt FROM orders")
            orders = cursor.fetchall()
            print("\n=== RECENT ORDERS ===")
            if not orders:
                print("No orders placed yet. Go to the frontend and place one!")
            else:
                print(tabulate(orders, headers="keys", tablefmt="grid"))

    except Exception as e:
        print(f"Error: {e}")
    finally:
        if 'connection' in locals():
            connection.close()

if __name__ == "__main__":
    view_data()
