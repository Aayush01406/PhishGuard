import requests
from pprint import pprint

BASE_URL = "http://127.0.0.1:8000"

print("Testing all PhishGuard endpoints:")

print("\n1. POST /scans/")
scan_response = requests.post(f"{BASE_URL}/scans/", json={"url": "https://example.com"}, timeout=10)
print("   Status:", scan_response.status_code)
pprint(scan_response.json())

print("\n2. GET /scans/")
history_response = requests.get(f"{BASE_URL}/scans/", timeout=10)
print("   Status:", history_response.status_code)
print("   Number of scans:", len(history_response.json()))
pprint(history_response.json())

print("\n3. GET /scans/stats")
stats_response = requests.get(f"{BASE_URL}/scans/stats", timeout=10)
print("   Status:", stats_response.status_code)
pprint(stats_response.json())

print("\n4. GET /scans/analytics")
analytics_response = requests.get(f"{BASE_URL}/scans/analytics", timeout=10)
print("   Status:", analytics_response.status_code)
pprint(analytics_response.json())

print("\n5. GET /blocked-domains/")
blocked_response = requests.get(f"{BASE_URL}/blocked-domains/", timeout=10)
print("   Status:", blocked_response.status_code)
pprint(blocked_response.json())

print("\n6. GET /blocked-domains/stats")
blocked_stats_response = requests.get(f"{BASE_URL}/blocked-domains/stats", timeout=10)
print("   Status:", blocked_stats_response.status_code)
pprint(blocked_stats_response.json())

print("\n✅ All endpoints tested!")
