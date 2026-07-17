"""
Pydantic models for the `posts` MongoDB collection.

Models
------
PostCreate      – payload for POST /posts
PostUpdate      – payload for PATCH /posts/{id}
PostInDB        – internal representation (full document)
PostResponse    – public-facing response

Python 3.14 / Pydantic 2.13 notes
-----------------------------------
* ``type``  and ``date``  are Python built-ins; using them directly as field
  names raises PydanticUserError in Pydantic 2.13.  Both are aliased:
    - ``post_type``  ↔  alias ``"type"``
    - ``item_date``  ↔  alias ``"date"``
  All models use ``populate_by_name=True`` so Python code can use either name.
"""

from datetime import date as date_type, datetime, timezone
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field

from .common import PyObjectId


# ---------------------------------------------------------------------------
# Enumerations
# ---------------------------------------------------------------------------

class PostType(str, Enum):
    lost = "lost"
    found = "found"


class PostCategory(str, Enum):
    cnic = "CNIC"
    wallet = "Wallet"
    phone = "Phone"
    pet = "Pet"
    other = "Other"


class PostStatus(str, Enum):
    open = "open"
    resolved = "resolved"


# ---------------------------------------------------------------------------
# Request models
# ---------------------------------------------------------------------------

class PostCreate(BaseModel):
    """Payload required to create a new lost/found post."""

    post_type: PostType = Field(..., alias="type", examples=["lost"])
    category: PostCategory = Field(..., examples=["Phone"])
    description: str = Field(
        ...,
        min_length=10,
        max_length=2000,
        examples=["Samsung Galaxy S23, black, lost near Jinnah Park."],
    )
    city: str = Field(..., min_length=2, max_length=100, examples=["Lahore"])
    item_date: date_type = Field(..., alias="date", description="Date the item was lost or found.")
    photoURL: Optional[str] = Field(
        None,
        description="Cloudinary URL of the uploaded photo (Cloudinary).",
        examples=["https://res.cloudinary.com/demo/image/upload/sample.jpg"],
    )

    model_config = {
        "populate_by_name": True,
        "str_strip_whitespace": True,
    }


class PostUpdate(BaseModel):
    """Payload for partially updating an existing post (all fields optional)."""

    post_type: Optional[PostType] = Field(None, alias="type")
    category: Optional[PostCategory] = None
    description: Optional[str] = Field(None, min_length=10, max_length=2000)
    city: Optional[str] = Field(None, min_length=2, max_length=100)
    item_date: Optional[date_type] = Field(None, alias="date")
    photoURL: Optional[str] = None
    status: Optional[PostStatus] = None

    model_config = {
        "populate_by_name": True,
        "str_strip_whitespace": True,
    }


# ---------------------------------------------------------------------------
# Database / internal model
# ---------------------------------------------------------------------------

class PostInDB(BaseModel):
    """Mirrors the exact shape stored in MongoDB."""

    id: Optional[PyObjectId] = Field(None, alias="_id")
    userId: PyObjectId = Field(..., description="ObjectId of the post author.")
    post_type: PostType = Field(..., alias="type")
    category: PostCategory
    description: str
    city: str
    item_date: date_type = Field(..., alias="date")
    photoURL: Optional[str] = None
    status: PostStatus = PostStatus.open
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }


# ---------------------------------------------------------------------------
# Response model
# ---------------------------------------------------------------------------

class PostResponse(BaseModel):
    """Returned to API clients."""

    id: Optional[PyObjectId] = Field(None, alias="_id")
    userId: PyObjectId
    post_type: PostType = Field(..., alias="type")
    category: PostCategory
    description: str
    city: str
    item_date: date_type = Field(..., alias="date")
    photoURL: Optional[str] = None
    status: PostStatus
    createdAt: datetime

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
