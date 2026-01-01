import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

modules_to_check = [
    ('cases_router', 'routers.client'),
    ('payments_router', 'routers.client'),
    ('books_router', 'routers.client'),
    ('articles_router', 'routers.client'),
    ('orders', 'routers.client'),
    ('client_dashboard', 'routers.client') # This is aliased in main.py, locally it's 'dashboard'
]

print("Checking imports...")
for name, module in modules_to_check:
    try:
        if name == 'client_dashboard':
            from routers.client import dashboard
            print(f"✅ Imported dashboard from routers.client")
        else:
            exec(f"from {module} import {name}")
            print(f"✅ Imported {name} from {module}")
    except Exception as e:
        print(f"❌ Failed to import {name} from {module}: {e}")

print("Checking lawyer imports...")
try:
    from routers.lawyer import dashboard as lawyer_dashboard
    print(f"✅ Imported lawyer_dashboard")
except Exception as e:
    print(f"❌ Failed to import lawyer_dashboard: {e}")
