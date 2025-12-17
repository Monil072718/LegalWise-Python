import requests

def check_lawyers():
    url = "http://127.0.0.1:8000/lawyers/"
    print(f"Checking {url}...")
    try:
        r = requests.get(url, timeout=5)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text[:200]}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    check_lawyers()
