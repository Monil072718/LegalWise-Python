import requests
import json

url = "http://localhost:8000/appointments/"
headers = {"Content-Type": "application/json"}
data = {
    "clientName": "Test Client",
    "lawyerName": "Test Lawyer",
    "lawyerId": "test-lawyer-id",
    "clientId": "test-client-id",
    "date": "2025-12-27",
    "time": "16:00",
    "type": "Consultation",
    "status": "pending",
    "notes": "Debug test"
}

try:
    print(f"Sending POST to {url} with data: {data}")
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Failed to connect: {e}")
