from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class QuoteRequestCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    message: str = Field(min_length=5, max_length=2000)


class QuoteRequest(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    message: str
    status: str
    email_status: str
    email_error: Optional[str] = None
    created_at: datetime


class QuoteStatusUpdate(BaseModel):
    status: str = Field(pattern="^(new|contacted|closed)$")
