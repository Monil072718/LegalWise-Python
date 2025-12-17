import requests
import json

url = "http://127.0.0.1:8000/lawyers/"
payload = {
    "name": "Test Lawyer",
    "email": "test@example.com",
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

print("Testing lawyer creation...")
print(f"URL: {url}")
print(f"Payload: {json.dumps(payload, indent=2)}")

try:
    r = requests.post(url, json=payload, timeout=10)
    print(f"\nStatus Code: {r.status_code}")
    print(f"Response: {r.text}")
except Exception as e:
    print(f"Error: {e}")
