from pydantic import BaseModel
from datetime import datetime


class BlockedDomainResponse(BaseModel):
    id: int
    domain_name: str
    risk_score: int
    risk_level: str
    reason: str
    blocked_at: datetime

    class Config:
        from_attributes = True
