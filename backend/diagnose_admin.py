import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

print("Checking admin imports...")
modules_to_check = [
    ('lawyers', 'routers.admin'),
    ('clients', 'routers.admin'),
    ('cases', 'routers.admin'),
    ('dashboard', 'routers.admin'),
    ('books', 'routers.admin'),
    ('articles', 'routers.admin'),
    ('payments', 'routers.admin'),
    ('analytics', 'routers.admin'),
    ('categories', 'routers.admin'),
    ('upload', 'routers.common'),
    ('chat', 'routers.common'),
    ('auth', 'routers.common'),
    ('appointments', 'routers.common')
]

for name, module in modules_to_check:
    print(f"Importing {name} from {module}...")
    try:
        exec(f"from {module} import {name}")
        print(f"✅ Success: {name}")
    except Exception as e:
        print(f"❌ Failed to import {name} from {module}: {e}")
        import traceback
        traceback.print_exc()

print("Diagnose complete.")
