from sqlalchemy import inspect
from database import engine

inspector = inspect(engine)
print("Tables in DB:")
for table in inspector.get_table_names():
    print(f" - {table}")
