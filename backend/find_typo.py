import os

root_dir = 'd:/Self/legalwise-admin-next/backend'

print("Searching for 'router =' in usage...")

for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith('.py'):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    for i, line in enumerate(lines):
                        if 'router =' in line or 'router=' in line:
                             # Clean whitespace
                             clean = line.strip()
                             # Check if it looks suspicious (not APIRouter)
                             if 'APIRouter' not in clean:
                                 print(f"SUSPICIOUS: {path}:{i+1}: {clean}")
                             else:
                                 # print(f"Normal: {path}:{i+1}: {clean}")
                                 pass
            except Exception as e:
                print(f"Skipping {path}: {e}")
