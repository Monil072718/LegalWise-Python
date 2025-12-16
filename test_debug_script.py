import requests
import os
import uuid

BASE_URL = "http://localhost:8000"

def test_upload_flow():
    # 1. Login as Admin
    print("1. Logging in as Admin...")
    try:
        login_res = requests.post(f"{BASE_URL}/auth/admin/login", json={
            "email": "admin@legalwise.com",
            "password": "admin123"
        })
        if login_res.status_code != 200:
            print(f"Login failed: {login_res.status_code} {login_res.text}")
            return
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("   Login successful.")
    except Exception as e:
        print(f"   Connection failed: {e}")
        return

    # 2. Create a Case
    print("\n2. Creating a Test Case...")
    case_data = {
        "title": "Test Upload Case",
        "clientId": "client-1",
        "lawyerId": "lawyer-1",
        "status": "open",
        "stage": "initial",
        "priority": "medium",
        "createdAt": "2024-01-01"
    }
    create_res = requests.post(f"{BASE_URL}/cases/", json=case_data, headers=headers)
    if create_res.status_code != 200:
        print(f"   Create failed: {create_res.status_code} {create_res.text}")
        return
    case_id = create_res.json()["id"]
    print(f"   Case created with ID: {case_id}")

    # 3. Create Dummy File
    print("\n3. Creating dummy file...")
    filename = "test_doc.txt"
    with open(filename, "w") as f:
        f.write("This is a test document content.")

    # 4. Upload File
    print("\n4. Uploading Document...")
    with open(filename, "rb") as f:
        files = {'file': (filename, f, 'text/plain')}
        # Note: Do not manually set Content-Type header when using 'files' in requests, it handles boundary.
        upload_res = requests.post(
            f"{BASE_URL}/cases/{case_id}/documents",
            headers=headers,
            files=files
        )
    
    if upload_res.status_code == 200:
        print("   Upload successful!")
        print("   Response:", upload_res.json())
    else:
        print(f"   Upload failed: {upload_res.status_code} {upload_res.text}")

    # Cleanup
    if os.path.exists(filename):
        os.remove(filename)

if __name__ == "__main__":
    test_upload_flow()
