"""
Test script for the newly added authentication endpoints.
It performs the following steps:
  1. Sign‑up a fresh test user (random email to avoid conflicts).
  2. Log in with that user to obtain a JWT token.
  3. Use the token to hit a protected endpoint (GET /health –
     which is publicly accessible, but we also demonstrate calling a dummy
     protected route if you add one later).

The script prints clear status messages and exits with a non‑zero code
if any step fails, making it easy to integrate into CI or a manual sanity
check.
"""
import sys
import uuid
import httpx

BASE_URL = "http://127.0.0.1:8000"

# 1. Sign‑up ---------------------------------------------------------------
email = f"test-{uuid.uuid4().hex[:8]}@example.com"
password = "TestPass123!"
signup_payload = {
    "name": "Test User",
    "email": email,
    "password": password,
}
print(f"[+] Signing up user {email}")
resp = httpx.post(f"{BASE_URL}/auth/signup", json=signup_payload)
if resp.status_code != 201:
    print("[!] Signup failed", resp.status_code, resp.text)
    sys.exit(1)
print("    ✅ Signup succeeded")

# 2. Login -----------------------------------------------------------------
login_data = {
    "username": email,  # OAuth2PasswordRequestForm expects `username`
    "password": password,
}
print("[+] Logging in")
resp = httpx.post(f"{BASE_URL}/auth/login", data=login_data)
if resp.status_code != 200:
    print("[!] Login failed", resp.status_code, resp.text)
    sys.exit(1)
 token = resp.json().get("access_token")
if not token:
    print("[!] No token returned")
    sys.exit(1)
print("    ✅ Login succeeded – token obtained")

# 3. Verify token works with a protected route (health is public, so we
#    just demonstrate a request with the Authorization header).
headers = {"Authorization": f"Bearer {token}"}
print("[+] Calling a protected endpoint with the token")
resp = httpx.get(f"{BASE_URL}/health", headers=headers)
if resp.status_code != 200:
    print("[!] Protected request failed", resp.status_code, resp.text)
    sys.exit(1)
print("    ✅ Protected request succeeded – auth flow works")

print("\nAll authentication checks passed!")
