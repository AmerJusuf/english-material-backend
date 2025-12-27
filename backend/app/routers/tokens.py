from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any
from app.database import get_db
from app.models import User, TokenUsage
from app.schemas import TokenUsageSummary, TokenUsageResponse
from app.auth import get_current_user

router = APIRouter(prefix="/tokens", tags=["tokens"])


@router.get("/usage", response_model=TokenUsageSummary)
def get_token_usage(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get all token usage for the current user
    usage_records = db.query(TokenUsage).filter(
        TokenUsage.user_id == current_user.id
    ).all()
    
    # Calculate totals
    total_tokens = sum(record.total_tokens for record in usage_records)
    total_cost = sum(record.estimated_cost for record in usage_records)
    
    # Group by model
    usage_by_model: Dict[str, Dict[str, Any]] = {}
    for record in usage_records:
        model = record.model_used
        if model not in usage_by_model:
            usage_by_model[model] = {
                "total_tokens": 0,
                "total_cost": 0.0,
                "request_count": 0
            }
        
        usage_by_model[model]["total_tokens"] += record.total_tokens
        usage_by_model[model]["total_cost"] += record.estimated_cost
        usage_by_model[model]["request_count"] += 1
    
    # Get recent usage (last 20 records)
    recent_usage = db.query(TokenUsage).filter(
        TokenUsage.user_id == current_user.id
    ).order_by(TokenUsage.timestamp.desc()).limit(20).all()
    
    return TokenUsageSummary(
        total_tokens=total_tokens,
        total_cost=total_cost,
        usage_by_model=usage_by_model,
        recent_usage=recent_usage
    )

