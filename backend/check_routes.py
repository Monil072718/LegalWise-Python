import requests
import json

try:
    response = requests.get("http://localhost:8000/openapi.json")
    if response.status_code == 200:
        schema = response.json()
        paths = schema.get("paths", {})
        if "/upload/image" in paths:
            print("SUCCESS: /upload/image route FOUND in OpenAPI schema.")
        else:
            print("FAILURE: /upload/image route NOT FOUND in OpenAPI schema.")
            print("Available paths starting with /upload:")
            for p in paths:
                if p.startswith("/upload"):
                    print(f" - {p}")
    else:
        print(f"Failed to fetch OpenAPI schema. Status: {response.status_code}")
except Exception as e:
    print(f"Error fetching schema: {e}")
