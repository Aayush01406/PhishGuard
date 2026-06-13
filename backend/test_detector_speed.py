import time
import sys
sys.path.insert(0, '.')
from app.services.phishing_detector import PhishingDetector

print("Testing detector.analyze speed...")
detector = PhishingDetector()

start = time.time()
result = detector.analyze("https://example.com")
elapsed = time.time() - start

print(f"Time taken: {elapsed:.2f} seconds")
print(f"Risk score: {result['risk_score']}")
