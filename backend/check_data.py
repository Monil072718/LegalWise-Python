import requests
import json

def check_lawyers_data():
    url = "http://127.0.0.1:8000/lawyers/"
    print(f"Fetching data from {url}...")
    try:
        r = requests.get(url, timeout=5)
        print(f"Status: {r.status_code}")
        data = r.json()
        print(f"Record count: {len(data)}")
        print("Data sample:", json.dumps(data[:2], indent=2))
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    check_lawyers_data()
