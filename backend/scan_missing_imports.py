import os
import ast

def check_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            tree = ast.parse(f.read())
        except Exception as e:
            print(f"Error parsing {filepath}: {e}")
            return

    imports = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for n in node.names:
                imports.add(n.name.split('.')[0])
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                imports.add(node.module.split('.')[0])
            for n in node.names:
                imports.add(n.name)

    used_names = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Load):
            used_names.add(node.id)
    
    missing = []
    if 'APIRouter' in used_names and 'APIRouter' not in imports and 'fastapi' not in imports:
        missing.append('APIRouter')
    if 'Depends' in used_names and 'Depends' not in imports and 'fastapi' not in imports:
        missing.append('Depends')
    if 'Session' in used_names and 'Session' not in imports and 'sqlalchemy' not in imports:
        missing.append('Session')
        
    if missing:
        print(f"Potential missing imports in {filepath}: {missing}")

root_dir = 'd:/Self/legalwise-admin-next/backend/routers'
for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith('.py'):
            check_file(os.path.join(root, file))
