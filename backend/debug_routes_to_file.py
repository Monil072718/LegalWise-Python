import sys
import os
sys.path.append(os.getcwd())

try:
    from main import app
    with open("routes.txt", "w") as f:
        f.write(f"Total routes: {len(app.routes)}\n")
        for route in app.routes:
            if hasattr(route, "path"):
                f.write(f"{route.path}\n")
            else:
                f.write(f"Route type: {type(route)}\n")
    print("Routes written to routes.txt")
except Exception as e:
    with open("routes.txt", "w") as f:
        f.write(f"ERROR: {e}")
    print(f"Error: {e}")
