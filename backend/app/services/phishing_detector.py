import re
import urllib.parse
import json
from typing import Dict, Any, List, Optional
from ..models.blocked_domain import BlockedDomain

SUSPICIOUS_KEYWORDS = [
    "login", "signin", "verify", "account", "update", "secure", "bank",
    "paypal", "amazon", "google", "facebook", "apple", "microsoft",
    "password", "credential", "authentication", "confirm", "identity"
]

URL_SHORTENERS = [
    "bit.ly", "tinyurl.com", "goo.gl", "ow.ly", "t.co", "is.gd",
    "buff.ly", "adf.ly", "bit.do", "mcaf.ee"
]


class PhishingDetector:
    def __init__(self, db_session=None):
        self.db_session = db_session

    def extract_features(self, url: str) -> Dict[str, Any]:
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

    def check_ssl(self, url: str) -> Dict[str, Any]:
        return {"valid": False, "message": "Not checked", "details": None}

    def get_domain_info(self, url: str) -> Dict[str, Any]:
        return {"age_days": 0, "message": "Not checked", "registrar": None}

    def get_dns_info(self, url: str) -> Dict[str, Any]:
        return {"a_records": [], "mx_records": [], "nameservers": []}

    def check_blacklists(self, url: str) -> Dict[str, Any]:
        return {"blacklisted": False, "sources": [], "message": "Not checked"}

    def calculate_risk_score_and_reasons(
        self,
        features: Dict[str, Any],
        ssl_info: Dict[str, Any],
        domain_info: Dict[str, Any],
        blacklist_info: Dict[str, Any],
        brand_reasons: List[str],
        homoglyph_reasons: List[str]
    ):
        score = 0
        detailed_reasons = []
        if features["url_length"] > 75:
            score += 15
            detailed_reasons.append("+15 - Long URL")
        if features["num_dots"] > 3:
            score += 10
            detailed_reasons.append("+10 - Multiple dots in domain")
        if features["num_hyphens"] > 2:
            score += 10
            detailed_reasons.append("+10 - Multiple hyphens in domain")
        if features["num_subdomains"] > 2:
            score += 10
            detailed_reasons.append("+10 - Excessive subdomains")
        if features["has_at_symbol"]:
            score += 20
            detailed_reasons.append("+20 - URL has @ symbol")
        if features["has_ip_address"]:
            score += 25
            detailed_reasons.append("+25 - Uses IP address")
        if not features["has_https"]:
            score += 20
            detailed_reasons.append("+20 - No HTTPS")
        if features["is_url_shortener"]:
            score += 15
            detailed_reasons.append("+15 - URL shortener used")
        score += features["suspicious_keywords"] * 8
        if features["suspicious_keywords"] > 0:
            detailed_reasons.append(f"+{features['suspicious_keywords'] * 8} - Contains suspicious keywords")
        return min(score, 100), detailed_reasons

    @staticmethod
    def get_risk_level(score: int) -> str:
        if score <= 20:
            return "Safe"
        elif score <= 50:
            return "Suspicious"
        elif score <= 80:
            return "High Risk"
        else:
            return "Phishing"

    def calculate_confidence(
        self,
        score: int,
        detailed_reasons: List[str],
        blacklist_info: Dict[str, Any],
        features: Dict[str, Any]
    ) -> int:
        return 95 - abs(50 - score)

    def analyze(self, url: str) -> Dict[str, Any]:
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        parsed = urllib.parse.urlparse(url)
        domain = parsed.netloc.lower()
        features = self.extract_features(url)
        ssl_info = self.check_ssl(url)
        domain_info = self.get_domain_info(url)
        dns_info = self.get_dns_info(url)
        blacklist_info = self.check_blacklists(url)
        brand_reasons = []
        homoglyph_reasons = []
        risk_score, detailed_score_reasons = self.calculate_risk_score_and_reasons(
            features, ssl_info, domain_info, blacklist_info, brand_reasons, homoglyph_reasons
        )
        risk_level = self.get_risk_level(risk_score)
        prediction = "Phishing" if risk_score > 50 else "Safe"
        confidence = self.calculate_confidence(risk_score, detailed_score_reasons, blacklist_info, features)
        display_reasons = []
        return {
            "url": url,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "prediction": prediction,
            "confidence": confidence,
            "features": features,
            "ssl": ssl_info,
            "domain": domain_info,
            "dns": dns_info,
            "blacklists": blacklist_info,
            "detailed_score_reasons": detailed_score_reasons,
            "reasons": display_reasons
        }
