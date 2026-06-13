import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.services.phishing_detector import PhishingDetector

print("="*80)
print("PHASE 2: PHISHING DETECTOR IMPROVEMENT TESTS")
print("="*80)

detector = PhishingDetector()

test_urls = [
    "https://google.com",
    "https://github.com",
]

for url in test_urls:
    print("\n" + "="*80)
    print(f"TESTING URL: {url}")
    print("="*80)

    print("\n1. WHOIS DOMAIN INFO")
    print("-"*80)
    domain_info = detector.get_domain_info(url)
    print(f"Creation Date: {domain_info['creation_date']}")
    print(f"Expiration Date: {domain_info['expiration_date']}")
    print(f"Registrar: {domain_info['registrar']}")
    print(f"Domain Age (Days): {domain_info['age_days']}")
    print(f"Message: {domain_info['message']}")
    print(f"Error: {domain_info['error']}")

    print("\n2. SSL ANALYSIS")
    print("-"*80)
    ssl_info = detector.check_ssl(url)
    print(f"Valid: {ssl_info['valid']}")
    print(f"Issuer: {ssl_info['issuer']}")
    print(f"Subject: {ssl_info['subject']}")
    print(f"Not Before: {ssl_info['not_before']}")
    print(f"Not After: {ssl_info['not_after']}")
    print(f"Days Until Expiration: {ssl_info['days_until_expiration']}")
    print(f"Is Self-Signed: {ssl_info['is_self_signed']}")
    print(f"SSL Version: {ssl_info['ssl_version']}")
    print(f"Message: {ssl_info['message']}")

    print("\n3. DNS INTELLIGENCE")
    print("-"*80)
    dns_info = detector.get_dns_info(url)
    print(f"A Records: {dns_info['a_records']}")
    print(f"MX Records: {dns_info['mx_records']}")
    print(f"Nameservers: {dns_info['nameservers']}")

    print("\n4. BLACKLISTS CHECK")
    print("-"*80)
    blacklist_info = detector.check_blacklists(url)
    print(f"Blacklisted: {blacklist_info['blacklisted']}")
    print(f"Sources: {blacklist_info['sources']}")
    print(f"Message: {blacklist_info['message']}")

    print("\n5. FULL ANALYSIS")
    print("-"*80)
    analysis = detector.analyze(url)
    print(f"URL: {analysis['url']}")
    print(f"Risk Score: {analysis['risk_score']}/100")
    print(f"Risk Level: {analysis['risk_level']}")
    print(f"Prediction: {analysis['prediction']}")
    print(f"Confidence: {analysis['confidence']}%")
    print(f"Reasons: {analysis['reasons']}")
    print(f"Recommendations: {analysis['recommendations']}")
