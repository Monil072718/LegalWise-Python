try:
    import multipart
    print("python-multipart is installed")
except ImportError:
    print("python-multipart is MISSING")

import requests
try:
    url = "http://localhost:8000/upload/image"
    files = {'file': ('test.txt', b'test content', 'text/plain')}
    response = requests.post(url, files=files)
    print(f"Status Code: {response.status_code}")
except Exception as e:
    print(f"Connection Error: {e}")
