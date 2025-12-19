import sys
import os
# Add current directory to path so imports work
sys.path.append(os.getcwd())

try:
    from main import app
    print("Successfully imported app from main.py")
    found = False
    for route in app.routes:
        if hasattr(route, "path") and "upload" in route.path:
            print(f"FOUND ROUTE: {route.path}")
            found = True
    
    if not found:
        print("NO UPLOAD ROUTES FOUND in app.routes")
        
except Exception as e:
    print(f"CRITICAL ERROR importing main: {e}")
    import traceback
    traceback.print_exc()
