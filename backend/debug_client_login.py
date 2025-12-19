import requests
import sys

BASE_URL = "http://localhost:8000"
EMAIL = "client@legalwise.com"
PASSWORD = "client123"

def debug_login():
    print(f"[-] Attempting login for {EMAIL}...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/client/login", json={"email": EMAIL, "password": PASSWORD})
    except Exception as e:
        print(f"[!] Connection failed: {e}")
        return

    if resp.status_code != 200:
        print(f"[!] Login Failed: {resp.status_code}")
        print(resp.text)
        return

    data = resp.json()
    token = data.get("access_token")
    print(f"[+] Login successful. Token obtained.")
    
    # decode token manually to see contents if needed, but let's just use it
    # We need the ID. The token response doesn't give ID, but we can assume we know it or...
    # Wait, the frontend decodes the token to get the ID.
    # Let's inspect the token to see what ID is in it.
    
    # To get the ID without JWT decoding lib here (to keep it simple), 
    # I'll just query the DB for the ID again or fetch all clients if I can
    
    headers = {"Authorization": f"Bearer {token}"}
    
    print("[-] Fetching ALL clients to find our ID...")
    resp_clients = requests.get(f"{BASE_URL}/clients/", headers=headers)
    if resp_clients.status_code != 200:
        print(f"[!] Failed to fetch clients list: {resp_clients.status_code}")
        print(resp_clients.text)
        # Proceeding to try self-lookup if we can guess endpoint? No.
    else:
        clients = resp_clients.json()
        me = next((c for c in clients if c["email"] == EMAIL), None)
        if me:
            print(f"[+] Found me in list. ID: {me['id']}")
            my_id = me['id']
            
            print(f"[-] Fetching specific client profile: /clients/{my_id}")
            resp_profile = requests.get(f"{BASE_URL}/clients/{my_id}", headers=headers)
            if resp_profile.status_code == 200:
                 print("[+] Profile fetch SUCCESS!")
                 print(resp_profile.json())
            else:
                 print(f"[!] Profile fetch FAILED: {resp_profile.status_code}")
                 print(resp_profile.text)
        else:
            print("[!] Could not find myself in clients list")

if __name__ == "__main__":
    try:
        import requests
        debug_login()
    except ImportError:
        print("Please pip install requests")
