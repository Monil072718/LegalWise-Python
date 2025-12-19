from database import engine
from sqlalchemy import inspect

inspector = inspect(engine)
tables = inspector.get_table_names()
print(f"Tables: {tables}")

if "categories" in tables:
    print("Categories table exists.")
    columns = [c['name'] for c in inspector.get_columns("categories")]
    print(f"Columns: {columns}")
else:
    print("Categories table MISSING.")
