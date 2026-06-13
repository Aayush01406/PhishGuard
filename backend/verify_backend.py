import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.core.database import SessionLocal
from app.models.url_scan import URLScan
from app.models.blocked_domain import BlockedDomain
from app.api.scans import scan_url
from fastapi.testclient import TestClient
from app.main import app
import json


client = TestClient(app)
db = SessionLocal()


def run_test():
    print("=" * 80)
    print("PHISHGUARD BACKEND VERIFICATION TEST")
    print("=" * 80)
    
    # Step 1: Reset test data (optional)
    print("\n--- Step 1: Clearing existing test data (if any) ---")
    db.query(URLScan).delete()
    db.query(BlockedDomain).delete()
    db.commit()
    print("✅ Cleared existing test data!")
    
    # Step 2: Test scan
    print("\n--- Step 2: Scanning 'https://google.com' ---")
    response = client.post("/scans/", json={"url": "https://google.com"})
    assert response.status_code == 200, f"Scan failed: {response.status_code}"
    scan_result = response.json()
    print(f"✅ Scan completed!")
    print(f"   URL: {scan_result['url']}")
    print(f"   Risk Score: {scan_result['risk_score']}")
    print(f"   Prediction: {scan_result['prediction']}")
    
    # Step 3: Verify scan in DB
    print("\n--- Step 3: Verifying scan in URLScans table ---")
    scans_count = db.query(URLScan).count()
    print(f"✅ Total scans in DB: {scans_count}")
    assert scans_count == 1, f"Expected 1 scan, got {scans_count}"
    print(f"   Scan saved successfully!")
    
    # Step 4: Test GET /scans/
    print("\n--- Step 4: Testing GET /scans/ ---")
    get_response = client.get("/scans/")
    assert get_response.status_code == 200
    all_scans = get_response.json()
    print(f"✅ GET /scans/ returned {len(all_scans)} scan(s)")
    
    # Step 5: Test GET /scans/stats
    print("\n--- Step 5: Testing GET /scans/stats ---")
    stats_response = client.get("/scans/stats")
    assert stats_response.status_code == 200
    stats = stats_response.json()
    print(f"✅ GET /scans/stats returned:")
    print(f"   Total Scans: {stats['total_scans']}")
    print(f"   Safe URLs: {stats['safe_urls']}")
    print(f"   Phishing Detected: {stats['phishing_detected']}")
    
    # Step 6: Test GET /scans/analytics
    print("\n--- Step 6: Testing GET /scans/analytics ---")
    analytics_response = client.get("/scans/analytics")
    assert analytics_response.status_code == 200
    analytics = analytics_response.json()
    print(f"✅ GET /scans/analytics returned:")
    print(f"   Scan Activity (last 7 days): {len(analytics['scan_activity'])} days")
    print(f"   Risk Distribution: {len(analytics['risk_distribution'])} categories")
    print(f"   Total Scans: {analytics['total_scans']}")
    
    # Step 7: Test GET /blocked-domains/
    print("\n--- Step 7: Testing GET /blocked-domains/ ---")
    blocked_response = client.get("/blocked-domains/")
    assert blocked_response.status_code == 200
    blocked_domains = blocked_response.json()
    print(f"✅ GET /blocked-domains/ returned {len(blocked_domains)} domain(s)")
    
    print("\n" + "=" * 80)
    print("✅ ALL TESTS PASSED!")
    print("=" * 80)


if __name__ == "__main__":
    run_test()
