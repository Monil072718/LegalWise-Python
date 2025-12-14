from database import engine, Base
import models
import sys

print(f"Base from database: {id(Base)}")
print(f"Base from models: {id(models.Base)}")

try:
    print(f"Client class: {models.Client}")
    print(f"Client bases: {models.Client.__bases__}")
    print(f"Client base id: {id(models.Client.__bases__[0])}")
except Exception as e:
    print(f"Error checking Client: {e}")

try:
    print(f"Appointment class: {models.Appointment}")
    print(f"Appointment bases: {models.Appointment.__bases__}")
    print(f"Appointment base id: {id(models.Appointment.__bases__[0])}")
except Exception as e:
    print(f"Error checking Appointment: {e}")

print(f"Content of models.Base.metadata.tables.keys():")
for key in models.Base.metadata.tables.keys():
    print(f" - {key}")

# Try to register a dummy model
class TestModel(Base):
    __tablename__ = "test_model"
    id = models.Column(models.Integer, primary_key=True)

print(f"After TestModel, keys: {list(Base.metadata.tables.keys())}")
