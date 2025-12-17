import requests
import json

url = "http://127.0.0.1:8000/auth/login"
payload = {"email": "admin@legalwise.com", "password": "admin123"}

try:
    r = requests.post(url, json=payload, timeout=5)
    print(f"Status: {r.status_code}")
    if r.status_code == 200:
        print("✓ Login successful!")
        data = r.json()
        print(f"Token: {data.get('token', 'N/A')[:50]}...")
    else:
        print(f"Response: {r.text}")
except Exception as e:
    print(f"✗ Failed: {e}")
