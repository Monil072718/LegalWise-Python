import urllib.request
import urllib.error

try:
    with urllib.request.urlopen("http://localhost:8000/dashboard/stats") as response:
        print(f"Status Code: {response.getcode()}")
        print(f"Response: {response.read().decode()}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code} {e.reason}")
    print(f"Response: {e.read().decode()}")
except Exception as e:
    print(f"Error: {e}")
