from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from ..core.database import Base


class BlockedDomain(Base):
    __tablename__ = "blocked_domains"

    id = Column(Integer, primary_key=True, index=True)
    domain_name = Column(String, unique=True, index=True, nullable=False)
    risk_score = Column(Integer, nullable=False)
    risk_level = Column(String, nullable=False)
    reason = Column(Text, nullable=False)
    blocked_at = Column(DateTime(timezone=True), server_default=func.now())
