"""
Test script for the Post endpoints.
It performs the following:
  1. Registers and logs in User A (owner) and User B (non-owner).
  2. Creates a post under User A's credentials.
  3. Retrieves the post publicly by ID.
  4. Filters the list of posts by city/keyword/type.
  5. Verifies User B is blocked from modifying User A's post (PUT, PATCH, DELETE).
  6. Verifies User A can modify, resolve, and delete the post.
  7. Verifies the deleted post is no longer accessible.
"""
import sys
import uuid
import httpx

BASE_URL = "http://127.0.0.1:8000"

def create_random_user(name: str):
    email = f"test-{uuid.uuid4().hex[:8]}@example.com"
    password = "TestPass123!"
    signup_payload = {
        "name": name,
        "email": email,
        "password": password,
    }
    print(f"[+] Signing up {name} ({email})")
    resp = httpx.post(f"{BASE_URL}/auth/signup", json=signup_payload)
    if resp.status_code != 201:
        print(f"[!] Signup failed for {name}:", resp.status_code, resp.text)
        sys.exit(1)
    
    login_data = {
        "username": email,
        "password": password,
    }
    resp = httpx.post(f"{BASE_URL}/auth/login", data=login_data)
    if resp.status_code != 200:
        print(f"[!] Login failed for {name}:", resp.status_code, resp.text)
        sys.exit(1)
        
    token = resp.json().get("access_token")
    return {"email": email, "token": token}

# 1. Setup Users
user_a = create_random_user("User A (Owner)")
user_b = create_random_user("User B (Non-Owner)")

headers_a = {"Authorization": f"Bearer {user_a['token']}"}
headers_b = {"Authorization": f"Bearer {user_b['token']}"}

print("\n--- Testing POST /posts/ (Create Post) ---")
post_payload = {
    "type": "lost",
    "category": "Phone",
    "description": "Lost my Samsung Galaxy S23 Ultra in the market",
    "city": "Rawalpindi",
    "date": "2026-07-17"
}

resp = httpx.post(f"{BASE_URL}/posts/", json=post_payload, headers=headers_a)
if resp.status_code != 201:
    print("[!] Create post failed:", resp.status_code, resp.text)
    sys.exit(1)

post = resp.json()
print("POST RESPONSE JSON:", post)
post_id = post.get("id") or post.get("_id")
print(f"[OK] Created post successfully! ID: {post_id}")
print(f"   Status: {post['status']}, Type: {post['type']}, CreatedAt: {post['createdAt']}")

print("\n--- Testing GET /posts/{id} (Retrieve Post) ---")
resp = httpx.get(f"{BASE_URL}/posts/{post_id}")
if resp.status_code != 200:
    print("[!] Retrieve post failed:", resp.status_code, resp.text)
    sys.exit(1)
print(f"[OK] Retrieved post successfully!")

print("\n--- Testing GET /posts/ (List & Filter) ---")
# Test filter by city
resp = httpx.get(f"{BASE_URL}/posts/?city=Rawalpindi&type=lost")
if resp.status_code != 200:
    print("[!] List posts failed:", resp.status_code, resp.text)
    sys.exit(1)
results = resp.json()
found = any((p.get("id") or p.get("_id")) == post_id for p in results)
if not found:
    print("[!] Created post not found in filtered list")
    sys.exit(1)
print(f"[OK] Filtered list check passed (found post in list)")

print("\n--- Testing PUT /posts/{id} Authorization (Non-owner) ---")
update_payload = {
    "type": "lost",
    "category": "Phone",
    "description": "Malicious modification attempt",
    "city": "Islamabad",
    "date": "2026-07-17"
}
resp = httpx.put(f"{BASE_URL}/posts/{post_id}", json=update_payload, headers=headers_b)
if resp.status_code != 403:
    print("[!] Unauthorized PUT did not return 403:", resp.status_code, resp.text)
    sys.exit(1)
print("[OK] Unauthorized PUT blocked (403 Forbidden)")

print("\n--- Testing PUT /posts/{id} Authorization (Owner) ---")
owner_update_payload = {
    "type": "lost",
    "category": "Phone",
    "description": "Lost my Samsung Galaxy S23 Ultra in the market - Offering Reward!",
    "city": "Rawalpindi",
    "date": "2026-07-17"
}
resp = httpx.put(f"{BASE_URL}/posts/{post_id}", json=owner_update_payload, headers=headers_a)
if resp.status_code != 200:
    print("[!] Owner PUT failed:", resp.status_code, resp.text)
    sys.exit(1)
updated_post = resp.json()
print("[OK] Owner PUT succeeded!")
print(f"   New Description: {updated_post['description']}")

print("\n--- Testing PATCH /posts/{id}/resolve Authorization (Non-owner) ---")
resp = httpx.patch(f"{BASE_URL}/posts/{post_id}/resolve", headers=headers_b)
if resp.status_code != 403:
    print("[!] Unauthorized PATCH resolve did not return 403:", resp.status_code, resp.text)
    sys.exit(1)
print("[OK] Unauthorized PATCH resolve blocked (403 Forbidden)")

print("\n--- Testing PATCH /posts/{id}/resolve Authorization (Owner) ---")
resp = httpx.patch(f"{BASE_URL}/posts/{post_id}/resolve", headers=headers_a)
if resp.status_code != 200:
    print("[!] Owner PATCH resolve failed:", resp.status_code, resp.text)
    sys.exit(1)
resolved_post = resp.json()
print("[OK] Owner PATCH resolve succeeded!")
print(f"   Status: {resolved_post['status']}")

print("\n--- Testing DELETE /posts/{id} Authorization (Non-owner) ---")
resp = httpx.delete(f"{BASE_URL}/posts/{post_id}", headers=headers_b)
if resp.status_code != 403:
    print("[!] Unauthorized DELETE did not return 403:", resp.status_code, resp.text)
    sys.exit(1)
print("[OK] Unauthorized DELETE blocked (403 Forbidden)")

print("\n--- Testing DELETE /posts/{id} Authorization (Owner) ---")
resp = httpx.delete(f"{BASE_URL}/posts/{post_id}", headers=headers_a)
if resp.status_code != 204:
    print("[!] Owner DELETE failed:", resp.status_code, resp.text)
    sys.exit(1)
print("[OK] Owner DELETE succeeded (204 No Content)!")

print("\n--- Testing GET /posts/{id} (Retrieve Deleted Post) ---")
resp = httpx.get(f"{BASE_URL}/posts/{post_id}")
if resp.status_code != 404:
    print("[!] Deleted post retrieval did not return 404:", resp.status_code, resp.text)
    sys.exit(1)
print("[OK] Deleted post is no longer accessible (404 Not Found)")

print("\nAll Post endpoints verification checks passed successfully!")
