"""Quick test: create a lost + found post and verify email notifications fire."""
import httpx, uuid, sys

BASE = "http://127.0.0.1:8000"

def create_user(name):
    email = f"notify-test-{uuid.uuid4().hex[:8]}@test.com"
    r = httpx.post(f"{BASE}/auth/signup", json={"name": name, "email": email, "password": "TestPass123!"})
    assert r.status_code == 201, f"Signup failed: {r.status_code} {r.text}"
    r = httpx.post(f"{BASE}/auth/login", data={"username": email, "password": "TestPass123!"})
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    token = r.json()["access_token"]
    print(f"[OK] {name} created ({email})")
    return {"email": email, "token": token, "name": name}

user_a = create_user("Ali (Lost)")
user_b = create_user("Sara (Found)")

h_a = {"Authorization": f"Bearer {user_a['token']}", "Content-Type": "application/json"}
h_b = {"Authorization": f"Bearer {user_b['token']}", "Content-Type": "application/json"}

r = httpx.post(f"{BASE}/posts/", json={
    "type": "lost", "category": "Phone",
    "description": "Lost my black Samsung Galaxy S23 near Urdu Bazaar Lahore",
    "city": "Lahore", "date": "2026-07-18"
}, headers=h_a)
assert r.status_code == 201, f"Lost post failed: {r.status_code} {r.text}"
lost_id = r.json()["_id"]
print(f"[OK] Lost post created: {lost_id}")

r = httpx.post(f"{BASE}/posts/", json={
    "type": "found", "category": "Phone",
    "description": "Found a black Samsung Galaxy S23 near Urdu Bazaar Lahore",
    "city": "Lahore", "date": "2026-07-18"
}, headers=h_b)
assert r.status_code == 201, f"Found post failed: {r.status_code} {r.text}"
found_id = r.json()["_id"]
print(f"[OK] Found post created: {found_id}")

r = httpx.get(f"{BASE}/matches/{lost_id}", headers=h_a)
matches = r.json()
if matches:
    m = matches[0]
    print(f"[OK] Match created! Score: {m['score']:.2f}, Status: {m['status']}")
    print("[OK] Check your email (talha.abid.joyia@gmail.com) for notifications!")
else:
    print("[!] No matches created - descriptions may not be similar enough")
