"""
Pydantic models for the `matches` MongoDB collection.

Models
------
MatchCreate     – payload for POST /matches  (internal / ML service use)
MatchUpdate     – payload for PATCH /matches/{id}  (confirm / dismiss)
MatchInDB       – internal representation (full document)
MatchResponse   – public-facing response
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator

from .common import PyObjectId


# ---------------------------------------------------------------------------
# Enumerations
# ---------------------------------------------------------------------------

class MatchStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    dismissed = "dismissed"


# ---------------------------------------------------------------------------
# Request models
# ---------------------------------------------------------------------------

class MatchCreate(BaseModel):
    """Payload to record a new match (typically created by the matching service)."""

    lostPostId: PyObjectId = Field(
        ...,
        description="ObjectId of the matched lost post.",
        examples=["64f1a2b3c4d5e6f7a8b9c0d1"],
    )
    foundPostId: PyObjectId = Field(
        ...,
        description="ObjectId of the matched found post.",
        examples=["64f1a2b3c4d5e6f7a8b9c0d2"],
    )
    score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Similarity score between 0 (no match) and 1 (identical).",
        examples=[0.87],
    )

    @field_validator("lostPostId", "foundPostId", mode="before")
    @classmethod
    def coerce_to_pyobjectid(cls, v: object) -> PyObjectId:
        return PyObjectId.validate(v)

    model_config = {"arbitrary_types_allowed": True}


class MatchUpdate(BaseModel):
    """Payload to update a match status (confirm or dismiss)."""

    status: MatchStatus = Field(
        ...,
        description="New status: 'confirmed' or 'dismissed'.",
        examples=["confirmed"],
    )


# ---------------------------------------------------------------------------
# Database / internal model
# ---------------------------------------------------------------------------

class MatchInDB(BaseModel):
    """Mirrors the exact shape stored in MongoDB."""

    id: Optional[PyObjectId] = Field(None, alias="_id")
    lostPostId: PyObjectId
    foundPostId: PyObjectId
    score: float = Field(..., ge=0.0, le=1.0)
    status: MatchStatus = MatchStatus.pending
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }


# ---------------------------------------------------------------------------
# Response model
# ---------------------------------------------------------------------------

class MatchResponse(BaseModel):
    """Returned to API clients."""

    id: Optional[PyObjectId] = Field(None, alias="_id")
    lostPostId: PyObjectId
    foundPostId: PyObjectId
    score: float
    status: MatchStatus
    createdAt: datetime

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
