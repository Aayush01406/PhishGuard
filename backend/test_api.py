
import requests
from pprint import pprint

print("Testing API endpoints...")

print("\n=== Testing http://127.0.0.1:8000/ ===")
r = requests.get("http://127.0.0.1:8000/", timeout=10)
print(r.status_code, r.json())

print("\n=== Testing http://127.0.0.1:8000/health ===")
r = requests.get("http://127.0.0.1:8000/health", timeout=10)
print(r.status_code, r.json())

print("\n=== Testing http://127.0.0.1:8000/scans/ ===")
r = requests.get("http://127.0.0.1:8000/scans/", timeout=10)
print(r.status_code)
pprint(r.json())

print("\n=== Testing http://127.0.0.1:8000/scans/stats ===")
r = requests.get("http://127.0.0.1:8000/scans/stats", timeout=10)
print(r.status_code)
pprint(r.json())

print("\n=== Testing http://127.0.0.1:8000/scans/analytics ===")
r = requests.get("http://127.0.0.1:8000/scans/analytics", timeout=10)
print(r.status_code)
pprint(r.json())

print("\n=== Testing http://127.0.0.1:8000/blocked-domains/ ===")
r = requests.get("http://127.0.0.1:8000/blocked-domains/", timeout=10)
print(r.status_code)
pprint(r.json())
