import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:8000"

def test_create_client_extended():
    print("Testing Client Creation with new fields...")
    new_client = {
        "name": "Test Client Verification",
        "email": "test.verification.urllib@example.com",
        "role": "client",
        "status": "active",
        "consultations": 0,
        "booksDownloaded": 0,
        "articlesRead": 0,
        "totalSpent": 0.0,
        "createdAt": "2023-10-27",
        "phone": "555-0199",
        "address": "123 Test Lane",
        "company": "Test Co",
        "notes": "Created via verification script"
    }

    try:
        data = json.dumps(new_client).encode('utf-8')
        req = urllib.request.Request(
            f"{BASE_URL}/clients/", 
            data=data, 
            headers={'Content-Type': 'application/json'}
        )
        
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                response_data = json.loads(response.read().decode('utf-8'))
                print("Response:", json.dumps(response_data, indent=2))
                
                # Verify fields
                if response_data.get("phone") == "555-0199":
                    print("\nSUCCESS: 'phone' field persisted correctly.")
                else:
                    print(f"\nFAILURE: 'phone' field missing or incorrect. Got: {response_data.get('phone')}")
            else:
                print(f"Request failed with status {response.status}")

    except urllib.error.HTTPError as e:
        print(f"HTTP Error accessing API: {e.code} - {e.reason}")
        print(e.read().decode())
    except urllib.error.URLError as e:
        print(f"URL Error accessing API: {e.reason}")
    except Exception as e:
        print(f"Error accessing API: {e}")

if __name__ == "__main__":
    test_create_client_extended()
