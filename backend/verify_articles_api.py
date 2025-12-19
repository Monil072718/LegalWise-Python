import requests
import sys

try:
    print("Testing GET /articles/ ...")
    response = requests.get("http://localhost:8000/articles/", timeout=5)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Response:", response.json())
    else:
        print("Error Response:", response.text)
except Exception as e:
    print(f"Request failed: {e}")
