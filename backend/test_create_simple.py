import requests
import json

url = "http://127.0.0.1:8000/lawyers/"
payload = {
    "name": "Test Lawyer 2",
    "email": "test2@example.com",
    "password": "password123",
    "role": "lawyer",
    "status": "active",
    "specialization": ["Corporate Law"],
    "experience": 5,
    "availability": "online",
    "verified": True,
    "phone": "1234567890",
    "address": "Test Address",
    "bio": "Test Bio",
    "rating": 0,
    "casesHandled": 0,
    "createdAt": "2024-01-01",
    "documents": []
}

try:
    r = requests.post(url, json=payload, timeout=10)
    print(f"Status: {r.status_code}")
    if r.status_code == 200:
        print("SUCCESS!")
    else:
        print(f"Error: {r.json()}")
except Exception as e:
    print(f"Exception: {e}")
