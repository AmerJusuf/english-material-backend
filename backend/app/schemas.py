from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime


# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# Material Generation Schemas
class ChapterInput(BaseModel):
    title: str
    description: Optional[str] = ""


class MaterialGenerationRequest(BaseModel):
    title: str
    chapters: List[ChapterInput]
    model: str = "gpt-4o-mini"  # gpt-4o-mini, gpt-4, claude-3-5-sonnet, etc.


class MaterialGenerationResponse(BaseModel):
    material_id: int
    generated_content: Dict[str, Any]
    tokens_used: int
    estimated_cost: float


# Token Usage Schemas
class TokenUsageResponse(BaseModel):
    id: int
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int
    estimated_cost: float
    model_used: str
    timestamp: datetime

    class Config:
        from_attributes = True


class TokenUsageSummary(BaseModel):
    total_tokens: int
    total_cost: float
    usage_by_model: Dict[str, Dict[str, Any]]
    recent_usage: List[TokenUsageResponse]


# Material Schemas
class MaterialResponse(BaseModel):
    id: int
    title: str
    table_of_contents: str
    generated_content: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MaterialUpdate(BaseModel):
    generated_content: str

