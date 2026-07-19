"""
Pydantic models for the `users` MongoDB collection.

Models
------
UserCreate      – payload for POST /users  (registration)
UserUpdate      – payload for PATCH /users/{id}  (profile update)
UserInDB        – internal representation including passwordHash
UserResponse    – public-facing response (no password hash)
"""

from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from .common import PyObjectId


# ---------------------------------------------------------------------------
# Request models
# ---------------------------------------------------------------------------

class UserCreate(BaseModel):
    """Payload required to register a new user."""

    name: str = Field(..., min_length=2, max_length=100, examples=["Ali Raza"])
    email: EmailStr = Field(..., examples=["ali@example.com"])
    password: str = Field(
        ...,
        min_length=8,
        description="Plain-text password; will be hashed before storage.",
        examples=["S3cur3P@ss!"],
    )
    phone: Optional[str] = Field(
        None,
        max_length=20,
        description="WhatsApp or mobile number (e.g. 03001234567).",
        examples=["03001234567"],
    )

    model_config = {"str_strip_whitespace": True}


class UserUpdate(BaseModel):
    """Payload for partially updating a user profile (all fields optional)."""

    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8)
    phone: Optional[str] = Field(None, max_length=20)

    model_config = {"str_strip_whitespace": True}


# ---------------------------------------------------------------------------
# Database / internal model
# ---------------------------------------------------------------------------

class UserInDB(BaseModel):
    """Mirrors the exact shape stored in MongoDB (includes passwordHash)."""

    id: Optional[PyObjectId] = Field(None, alias="_id")
    name: str
    email: EmailStr
    passwordHash: str
    phone: Optional[str] = None
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = {
        "populate_by_name": True,   # allow both `id` and `_id`
        "arbitrary_types_allowed": True,
    }


# ---------------------------------------------------------------------------
# Response model
# ---------------------------------------------------------------------------

class UserResponse(BaseModel):
    """Returned to API clients – omits passwordHash."""

    id: Optional[PyObjectId] = Field(None, alias="_id")
    name: str
    email: EmailStr
    phone: Optional[str] = None
    createdAt: datetime

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
