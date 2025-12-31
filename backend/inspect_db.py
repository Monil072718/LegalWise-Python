from sqlalchemy import inspect
import database

def inspect_table():
    inspector = inspect(database.engine)
    columns = inspector.get_columns('orders')
    print("Columns in 'orders' table:")
    for column in columns:
        print(f"- {column['name']} ({column['type']})")

if __name__ == "__main__":
    inspect_table()
