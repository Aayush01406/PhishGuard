import re
import socket
import ssl
import urllib.parse
import whois
import dns.resolver
import requests
from datetime import datetime, timezone

SUSPICIOUS_KEYWORDS = [
    "login", "signin", "verify", "account", "update", "secure", "bank",
    "paypal", "amazon", "google", "facebook", "apple", "microsoft",
    "password", "credential", "authentication", "confirm", "identity",
    "security", "wallet", "bitcoin", "crypto", "verification"
]

URL_SHORTENERS = [
    "bit.ly", "tinyurl.com", "goo.gl", "ow.ly", "t.co", "is.gd",
    "buff.ly", "adf.ly", "bit.do", "mcaf.ee", "t.ly", "cutt.ly"
]


def extract_features(url: str):
    parsed = urllib.parse.urlparse(url)
    domain = parsed.netloc.lower()
    features = {}
    features["url_length"] = len(url)
    features["num_dots"] = domain.count('.')
    features["num_hyphens"] = domain.count('-')
    features["num_subdomains"] = len(domain.split('.')) - 2
    features["has_at_symbol"] = '@' in url
    features["has_ip_address"] = bool(re.match(r'\d+\.\d+\.\d+\.\d+', domain))
    features["has_https"] = parsed.scheme == 'https'
    features["is_url_shortener"] = any(shortener in domain for shortener in URL_SHORTENERS)
    features["suspicious_keywords"] = sum(1 for keyword in SUSPICIOUS_KEYWORDS if keyword in url.lower())
    return features


def check_ssl(url: str):
    result = {
        "valid": False,
        "issuer": None,
        "subject": None,
        "not_before": None,
        "not_after": None,
        "days_until_expiration": None,
        "is_self_signed": False,
        "ssl_version": None,
        "message": "Unable to verify",
        "error": None
    }
    try:
        parsed = urllib.parse.urlparse(url)
        hostname = parsed.netloc
        if not hostname:
            result["message"] = "No hostname found"
            return result
        ctx = ssl.create_default_context()
        with socket.create_connection((hostname, 443), timeout=10) as sock:
            with ctx.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                ssl_version = ssock.version()
                result["ssl_version"] = ssl_version
                result["valid"] = True
                result["message"] = "Valid SSL certificate"
                subject = dict(x[0] for x in cert['subject'])
                issuer = dict(x[0] for x in cert['issuer'])
                result["subject"] = subject.get('commonName', None)
                result["issuer"] = issuer.get('organizationName', issuer.get('commonName', None))
                not_before = datetime.strptime(cert['notBefore'], '%b %d %H:%M:%S %Y %Z')
                not_after = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
                now = datetime.now(timezone.utc).replace(tzinfo=None)
                not_before = not_before.replace(tzinfo=None)
                not_after = not_after.replace(tzinfo=None)
                result["not_before"] = not_before.isoformat()
                result["not_after"] = not_after.isoformat()
                result["days_until_expiration"] = max(0, (not_after - now).days)
                result["is_self_signed"] = (
                    subject.get('commonName') == issuer.get('commonName') or
                    subject.get('organizationName') == issuer.get('organizationName')
                )
    except Exception as e:
        result["message"] = str(e)
        result["error"] = str(e)
    return result


def get_domain_info(url: str):
    result = {
        "creation_date": None,
        "expiration_date": None,
        "registrar": None,
        "age_days": None,
        "message": "Unable to determine domain info",
        "error": None
    }
    try:
        parsed = urllib.parse.urlparse(url)
        domain = parsed.netloc.lower()
        domain_parts = domain.split('.')
        if len(domain_parts) >= 2:
            domain = '.'.join(domain_parts[-2:])
        w = whois.whois(domain)
        if w.creation_date:
            creation_date = w.creation_date
            if isinstance(creation_date, list):
                creation_date = creation_date[0]
            result["creation_date"] = creation_date.isoformat()
            now = datetime.now(timezone.utc).replace(tzinfo=None)
            creation_date = creation_date.replace(tzinfo=None)
            result["age_days"] = (now - creation_date).days
        if w.expiration_date:
            expiration_date = w.expiration_date
            if isinstance(expiration_date, list):
                expiration_date = expiration_date[0]
            result["expiration_date"] = expiration_date.isoformat()
        result["registrar"] = w.registrar
        result["message"] = "Domain info retrieved successfully"
    except Exception as e:
        result["message"] = str(e)
        result["error"] = str(e)
    return result


def get_dns_info(url: str):
    result = {
        "a_records": [],
        "mx_records": [],
        "nameservers": [],
        "message": "DNS info retrieved",
        "error": None
    }
    try:
        parsed = urllib.parse.urlparse(url)
        domain = parsed.netloc.lower()
        domain_parts = domain.split('.')
        if len(domain_parts) >= 2:
            domain = '.'.join(domain_parts[-2:])
        try:
            a_records = dns.resolver.resolve(domain, 'A')
            result["a_records"] = [rdata.address for rdata in a_records]
        except Exception:
            pass
        try:
            mx_records = dns.resolver.resolve(domain, 'MX')
            result["mx_records"] = [{"preference": rdata.preference, "exchange": str(rdata.exchange)} for rdata in mx_records]
        except Exception:
            pass
        try:
            ns_records = dns.resolver.resolve(domain, 'NS')
            result["nameservers"] = [str(rdata.target) for rdata in ns_records]
        except Exception:
            pass
    except Exception as e:
        result["error"] = str(e)
    return result


def check_blacklists(url: str):
    result = {
        "blacklisted": False,
        "sources": [],
        "message": "Not found in any blacklist"
    }
    try:
        parsed = urllib.parse.urlparse(url)
        domain = parsed.netloc.lower()
        try:
            response = requests.get("https://openphish.com/feed.txt", timeout=10)
            openphish_urls = response.text.splitlines()
            for blacklisted_url in openphish_urls[:1000]:
                if url.lower() in blacklisted_url.lower() or domain.lower() in blacklisted_url.lower():
                    result["blacklisted"] = True
                    result["sources"].append({"source": "OpenPhish", "reason": "Listed in OpenPhish feed"})
                    break
        except Exception:
            pass
        try:
            response = requests.get("https://data.phishtank.com/data/online-valid.json", timeout=10)
            if response.status_code == 200:
                phishtank_data = response.json()
                for entry in phishtank_data[:100]:
                    if url.lower() in entry["url"].lower() or domain.lower() in entry["url"].lower():
                        result["blacklisted"] = True
                        result["sources"].append({"source": "PhishTank", "reason": entry["phish_detail_url"]})
                        break
        except Exception:
            pass
        if result["sources"]:
            result["message"] = f"Blacklisted in {len(result['sources'])} sources"
    except Exception:
        pass
    return result


def calculate_risk_score(features, ssl_info, domain_info, blacklist_info):
    score = 0
    if blacklist_info["blacklisted"]:
        score += 50
    if features["url_length"] > 75:
        score += 10
    if features["url_length"] > 100:
        score += 10
    if features["num_dots"] > 3:
        score += 10
    if features["num_hyphens"] > 2:
        score += 10
    if features["num_subdomains"] > 2:
        score += 10
    if features["has_at_symbol"]:
        score += 20
    if features["has_ip_address"]:
        score += 25
    if not features["has_https"]:
        score += 20
    if ssl_info and not ssl_info["valid"]:
        score += 20
    if ssl_info and ssl_info["is_self_signed"]:
        score += 15
    if ssl_info and ssl_info["days_until_expiration"] is not None and ssl_info["days_until_expiration"] < 14:
        score += 10
    if domain_info and domain_info["age_days"] is not None and domain_info["age_days"] < 30:
        score += 20
    elif domain_info and domain_info["age_days"] is not None and domain_info["age_days"] < 90:
        score += 10
    if features["is_url_shortener"]:
        score += 15
    score += features["suspicious_keywords"] * 8
    return min(score, 100)


def get_risk_level(score):
    if score <= 20:
        return "Safe"
    elif score <= 50:
        return "Suspicious"
    elif score <= 80:
        return "High Risk"
    else:
        return "Phishing"


def get_threat_explanations(features, ssl_info, domain_info, blacklist_info):
    reasons = []
    if blacklist_info["blacklisted"]:
        for source in blacklist_info["sources"]:
            reasons.append(f"Listed in {source['source']}: {source['reason']}")
    if domain_info and domain_info["age_days"] is not None and domain_info["age_days"] < 30:
        reasons.append(f"Domain registered only {domain_info['age_days']} days ago (very new)")
    elif domain_info and domain_info["age_days"] is not None and domain_info["age_days"] < 90:
        reasons.append(f"Domain registered {domain_info['age_days']} days ago (relatively new)")
    if features["has_ip_address"]:
        reasons.append("Uses IP address instead of domain name")
    if features["has_at_symbol"]:
        reasons.append("URL contains '@' symbol")
    if not features["has_https"]:
        reasons.append("Missing HTTPS encryption")
    if ssl_info and not ssl_info["valid"]:
        reasons.append("Invalid or missing SSL certificate")
    if ssl_info and ssl_info["is_self_signed"]:
        reasons.append("Self-signed SSL certificate")
    if ssl_info and ssl_info["days_until_expiration"] is not None and ssl_info["days_until_expiration"] < 14:
        reasons.append(f"SSL certificate expires in {ssl_info['days_until_expiration']} days")
    if features["is_url_shortener"]:
        reasons.append("Uses URL shortener service")
    if features["suspicious_keywords"] > 0:
        reasons.append(f"Contains {features['suspicious_keywords']} suspicious keyword(s)")
    if features["url_length"] > 75:
        reasons.append(f"URL is very long ({features['url_length']} characters)")
    if features["num_dots"] > 3:
        reasons.append("Unusual number of subdomains/dots")
    return reasons


def calculate_confidence(score, reasons, blacklist_info):
    base_confidence = 50
    if blacklist_info["blacklisted"]:
        base_confidence += 40
    for reason in reasons:
        if "Listed in" in reason:
            base_confidence += 20
        if "registered only" in reason:
            base_confidence += 10
        if "IP address" in reason:
            base_confidence += 15
        if "invalid or missing SSL" in reason.lower():
            base_confidence += 10
        if "suspicious keyword" in reason:
            base_confidence += 5
    base_confidence += abs(50 - score) // 2
    return min(base_confidence, 100)


def analyze(url: str):
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    features = extract_features(url)
    ssl_info = check_ssl(url)
    domain_info = get_domain_info(url)
    dns_info = get_dns_info(url)
    blacklist_info = check_blacklists(url)
    risk_score = calculate_risk_score(features, ssl_info, domain_info, blacklist_info)
    risk_level = get_risk_level(risk_score)
    reasons = get_threat_explanations(features, ssl_info, domain_info, blacklist_info)
    confidence = calculate_confidence(risk_score, reasons, blacklist_info)
    return {
        "url": url,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "reasons": reasons,
        "confidence": confidence,
        "ssl": ssl_info,
        "domain": domain_info,
        "dns": dns_info,
        "blacklists": blacklist_info
    }


def run_test():
    test_urls = [
        "https://google.com",
        "https://github.com",
        "https://paypal.com"
    ]

    for url in test_urls:
        print(f"\n{'='*80}")
        print(f"URL: {url}")
        print('='*80)

        result = analyze(url)

        print("\n--- WHOIS Result ---")
        print(f"Registrar: {result['domain']['registrar']}")
        print(f"Creation Date: {result['domain']['creation_date']}")
        print(f"Expiration Date: {result['domain']['expiration_date']}")
        print(f"Domain Age: {result['domain']['age_days']} days")
        if result['domain']['error']:
            print(f"Error: {result['domain']['error']}")

        print("\n--- SSL Result ---")
        print(f"Certificate Issuer: {result['ssl']['issuer']}")
        print(f"SSL Version: {result['ssl']['ssl_version']}")
        print(f"Expiration Date: {result['ssl']['not_after']}")
        print(f"Days Remaining: {result['ssl']['days_until_expiration']}")
        print(f"Self Signed: {'Yes' if result['ssl']['is_self_signed'] else 'No'}")

        print("\n--- DNS Result ---")
        print(f"A Records: {result['dns']['a_records']}")
        print(f"MX Records: {result['dns']['mx_records']}")
        print(f"Nameservers: {result['dns']['nameservers']}")

        print("\n--- Blacklist Result ---")
        openphish = any('OpenPhish' in s['source'] for s in result['blacklists']['sources'])
        phishtank = any('PhishTank' in s['source'] for s in result['blacklists']['sources'])
        internal = any('Internal' in s['source'] for s in result['blacklists']['sources'])
        print(f"OpenPhish Match: {'Yes' if openphish else 'No'}")
        print(f"PhishTank Match: {'Yes' if phishtank else 'No'}")
        print(f"Internal Blacklist Match: {'Yes' if internal else 'No'}")

        print("\n--- Risk Analysis ---")
        print(f"Risk Score: {result['risk_score']}")
        print(f"Confidence: {result['confidence']}%")
        print("Reasons:")
        for reason in result['reasons']:
            print(f"  - {reason}")


if __name__ == "__main__":
    run_test()
