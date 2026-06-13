import requests
from pprint import pprint

print("Testing POST /scans/ with simple URL...")
url = "http://127.0.0.1:8000/scans/"
try:
    response = requests.post(url, json={"url": "https://example.com"}, timeout=30)
    print(f"Status code: {response.status_code}")
    print("Response:")
    pprint(response.json())
except Exception as e:
    print(f"ERROR: {e}")
