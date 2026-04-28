import pymysql

try:
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='admin'
    )
    cursor = connection.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS food_delivery")
    connection.commit()
    print("Database 'food_delivery' checked/created successfully!")
    connection.close()
except Exception as e:
    print(f"Error: {e}")
