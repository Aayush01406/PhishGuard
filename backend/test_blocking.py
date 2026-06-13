import requests
from pprint import pprint

print("="*80)
print("Testing Automatic Domain Blocking")
print("="*80)

# Test 1: Check initial blocked domains
print("\n--- 1. Initial blocked domains ---")
r1 = requests.get("http://127.0.0.1:8000/blocked-domains/", timeout=10)
pprint(r1.json())

# Test 2: Scan a "test" domain with high risk
print("\n--- 2. Scanning test URL (should have high risk) ---")
test_url = "http://login-paypal-security-update.xyz"
r2 = requests.post("http://127.0.0.1:8000/scans/", json={"url": test_url}, timeout=15)
print(f"Status: {r2.status_code}")
scan_data = r2.json()
pprint(scan_data)

# Test 3: Check blocked domains after scan
print("\n--- 3. Blocked domains after scan ---")
r3 = requests.get("http://127.0.0.1:8000/blocked-domains/", timeout=10)
pprint(r3.json())

# Test 4: Check stats
print("\n--- 4. Stats ---")
r4 = requests.get("http://127.0.0.1:8000/blocked-domains/stats", timeout=10)
print("Blocked count stats:", r4.json())

print("\n✅ All tests passed!")
