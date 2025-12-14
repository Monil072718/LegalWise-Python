from database import engine
import models
models.Base.metadata.create_all(bind=engine)
print("Tables created.")
print(f"Metadata tables: {models.Base.metadata.tables.keys()}")

try:
    print(f"Client tablename: {models.Client.__tablename__}")
    print(f"Client mro: {models.Client.mro()}")
    print(f"Base: {models.Base}")
except Exception as e:
    print(f"Error inspecting Client: {e}")

from sqlalchemy import inspect
inspector = inspect(engine)
print(inspector.get_table_names())
