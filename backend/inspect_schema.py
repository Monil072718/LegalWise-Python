from database import engine
from sqlalchemy import inspect
import sys

try:
    inspector = inspect(engine)
    if inspector.has_table('books'):
        print("Table 'books' exists. Columns:")
        columns = inspector.get_columns('books')
        for column in columns:
            print(f"- {column['name']}")
    else:
        print("Table 'books' does NOT exist.")
except Exception as e:
    print(f"Error inspecting DB: {e}")
