from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from ..core.database import Base


class URLScan(Base):
    __tablename__ = "url_scans"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    risk_score = Column(Integer)
    prediction = Column(String)
    status = Column(String)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
