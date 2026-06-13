from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..core.database import get_db
from ..models.blocked_domain import BlockedDomain
from ..schemas.blocked_domain import BlockedDomainResponse

router = APIRouter(prefix="/blocked-domains", tags=["Blocked Domains"])


@router.get("/", response_model=List[BlockedDomainResponse])
def get_blocked_domains(
    db: Session = Depends(get_db),
):
    domains = db.query(BlockedDomain).order_by(BlockedDomain.blocked_at.desc()).all()
    return domains


@router.get("/stats")
def get_blocked_stats(
    db: Session = Depends(get_db),
):
    total = db.query(BlockedDomain).count()
    return {"total_blocked": total}


@router.delete("/{domain_id}")
def delete_blocked_domain(
    domain_id: int,
    db: Session = Depends(get_db),
):
    domain = db.query(BlockedDomain).filter(BlockedDomain.id == domain_id).first()
    if not domain:
        raise HTTPException(status_code=404, detail="Domain not found")
    db.delete(domain)
    db.commit()
    return {"message": "Domain removed from blocklist"}
