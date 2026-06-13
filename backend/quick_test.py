import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.services.phishing_detector import PhishingDetector

detector = PhishingDetector()

test_urls = [
    "https://google.com",
    "https://github.com",
    "https://paypal.com"
]

for url in test_urls:
    print(f"\n{'='*80}")
    print(f"URL: {url}")
    print('='*80)
    print("\n--- WHOIS RESULT ---")
    domain_info = detector.get_domain_info(url)
    print(f"Registrar: {domain_info['registrar']}")
    print(f"Creation Date: {domain_info['creation_date']}")
    print(f"Expiration Date: {domain_info['expiration_date']}")
    print(f"Domain Age (Days): {domain_info['age_days']}")
    print(f"Error: {domain_info['error']}")

    print("\n--- SSL RESULT ---")
    ssl_info = detector.check_ssl(url)
    print(f"Certificate Issuer: {ssl_info['issuer']}")
    print(f"SSL Version: {ssl_info['ssl_version']}")
    print(f"Expiration Date: {ssl_info['not_after']}")
    print(f"Days Remaining: {ssl_info['days_until_expiration']}")
    print(f"Self Signed: {'Yes' if ssl_info['is_self_signed'] else 'No'}")

    print("\n--- DNS RESULT ---")
    dns_info = detector.get_dns_info(url)
    print(f"A Records: {dns_info['a_records']}")
    print(f"MX Records: {dns_info['mx_records']}")
    print(f"Nameservers: {dns_info['nameservers']}")

    print("\n--- BLACKLIST RESULT ---")
    blacklist_info = detector.check_blacklists(url)
    openphish = any('OpenPhish' in s['source'] for s in blacklist_info['sources'])
    phishtank = any('PhishTank' in s['source'] for s in blacklist_info['sources'])
    internal = any('Internal' in s['source'] for s in blacklist_info['sources'])
    print(f"OpenPhish Match: {'Yes' if openphish else 'No'}")
    print(f"PhishTank Match: {'Yes' if phishtank else 'No'}")
    print(f"Internal Blacklist Match: {'Yes' if internal else 'No'}")

    print("\n--- RISK ANALYSIS ---")
    analysis = detector.analyze(url)
    print(f"Risk Score: {analysis['risk_score']}")
    print(f"Confidence: {analysis['confidence']}%")
    print("Reasons:")
    for reason in analysis['reasons']:
        print(f"  - {reason}")
