"""
models package – re-exports all Pydantic models for convenient imports.

Usage
-----
    from models import UserCreate, UserResponse
    from models import PostCreate, PostResponse, PostType, PostCategory, PostStatus
    from models import MatchCreate, MatchResponse, MatchStatus
"""

from .common import PyObjectId

from .user import (
    UserCreate,
    UserUpdate,
    UserInDB,
    UserResponse,
)

from .post import (
    PostType,
    PostCategory,
    PostStatus,
    PostCreate,
    PostUpdate,
    PostInDB,
    PostResponse,
)

from .match import (
    MatchStatus,
    MatchCreate,
    MatchUpdate,
    MatchInDB,
    MatchResponse,
)

__all__ = [
    # common
    "PyObjectId",
    # user
    "UserCreate",
    "UserUpdate",
    "UserInDB",
    "UserResponse",
    # post
    "PostType",
    "PostCategory",
    "PostStatus",
    "PostCreate",
    "PostUpdate",
    "PostInDB",
    "PostResponse",
    # match
    "MatchStatus",
    "MatchCreate",
    "MatchUpdate",
    "MatchInDB",
    "MatchResponse",
]
