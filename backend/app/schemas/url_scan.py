from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any


class URLScanRequest(BaseModel):
    url: str


class URLScanResponse(BaseModel):
    id: int
    url: str
    risk_score: int
    prediction: str
    status: str
    details: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True
