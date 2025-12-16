import requests
try:
    r = requests.get("http://localhost:8000/clients/")
    print(f"Clients Status: {r.status_code}")
    print("Connection Successful")
except Exception as e:
    print(f"Connection Failed: {e}")
