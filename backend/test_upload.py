import requests

try:
    url = "http://localhost:8000/upload/image"
    # Sending a dummy file
    files = {'file': ('test.txt', b'test content', 'text/plain')}
    response = requests.post(url, files=files)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
