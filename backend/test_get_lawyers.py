import requests

try:
    r = requests.get("http://127.0.0.1:8000/lawyers/", timeout=5)
    print(f"Status: {r.status_code}")
    data = r.json()
    print(f"Count: {len(data)}")
    for lawyer in data[:3]:
        print(f"  - {lawyer['name']} ({lawyer['email']})")
except Exception as e:
    print(f"Error: {e}")
