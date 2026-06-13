import requests
from pprint import pprint

url = "http://127.0.0.1:8000/scans/"
test_url = "http://google-account-security-update.xyz"
print(f"Testing scan of already blocked URL: {test_url}")
try:
    response = requests.post(url, json={"url": test_url}, timeout=10)
    print("Scan completed!")
    print("Response details:")
    pprint(response.json())
    print("\n✅ Confidence value present!" if response.json().get('details', {}).get('confidence') else "\n❌ Confidence missing!")
except Exception as e:
    print(f"Error: {e}")
