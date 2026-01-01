import os

root_dir = 'd:/Self/legalwise-admin-next/backend/routers'

print("Printing headers of router files...")

for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith('.py') and file != '__init__.py':
            path = os.path.join(root, file)
            print(f"\n--- {path} ---")
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    for _ in range(10):
                        print(f.readline().rstrip())
            except Exception as e:
                print(f"Error reading {path}: {e}")
