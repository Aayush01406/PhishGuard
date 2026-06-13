import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from app.services.phishing_detector import PhishingDetector

print("="*100)
print("TESTING UPGRADED PHISHING DETECTION ENGINE!")
print("="*100)

detector = PhishingDetector()

test_urls = [
    "https://google.com",
    "http://paypal-login.xyz",
    "http://login.verify.paypal.account.security.xyz",
    "http://192.168.1.5/login",
    "http://bit.ly/3fake123"
]

for url in test_urls:
    print("\n" + "="*100)
    print(f"TESTING URL: {url}")
    print("="*100)

    result = detector.analyze(url)
    print(f"\nRisk Score: {result['risk_score']}/100")
    print(f"Risk Level: {result['risk_level']}")
    print(f"Prediction: {result['prediction']}")
    print(f"Confidence: {result['confidence']}%")

    print("\n--- DETAILED SCORE BREAKDOWN ---")
    for reason in result['detailed_score_reasons']:
        print(f"  {reason}")

    print("\n--- FEATURES ---")
    for key, value in result['features'].items():
        print(f"  {key}: {value}")

