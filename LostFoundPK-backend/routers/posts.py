"""
routers/posts.py
~~~~~~~~~~~~~~
Endpoints for the `posts` collection.
"""

from datetime import date as dt_date, datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from bson import ObjectId

from core.dependencies import get_current_user
from database import db_helper
from models import (
    PostCreate,
    PostUpdate,
    PostResponse,
    PostStatus,
)

router = APIRouter(prefix="/posts", tags=["Posts"])

# Helper to convert a Mongo document into a Pydantic response model
def _to_response(doc: dict) -> PostResponse:
    return PostResponse(**doc)

# ---------------------------------------------------------------------------
# POST /posts – create a new post (auth required)
# ---------------------------------------------------------------------------
@router.post(
    "/",
    response_model=PostResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new post (authenticated)",
)
async def create_post(payload: PostCreate, current_user=Depends(get_current_user)) -> PostResponse:
    post_doc = payload.model_dump(by_alias=True)
    # Convert date to datetime at midnight for MongoDB compatibility
    if "date" in post_doc and isinstance(post_doc["date"], dt_date) and not isinstance(post_doc["date"], datetime):
        post_doc["date"] = datetime.combine(post_doc["date"], datetime.min.time(), tzinfo=timezone.utc)
    # Attach author reference and creation metadata
    post_doc["userId"] = ObjectId(current_user.id) if isinstance(current_user.id, str) else current_user.id
    post_doc["createdAt"] = datetime.now(timezone.utc)
    post_doc["status"] = PostStatus.open
    result = await db_helper.db["posts"].insert_one(post_doc)
    created = await db_helper.db["posts"].find_one({"_id": result.inserted_id})
    return _to_response(created)

# ---------------------------------------------------------------------------
# GET /posts – list with optional filters
# ---------------------------------------------------------------------------
@router.get(
    "/",
    response_model=List[PostResponse],
    summary="List posts with optional query filters",
)
async def list_posts(
    post_type: Optional[str] = Query(None, alias="type"),
    category: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    date: Optional[str] = Query(None),  # ISO‑8601 date string (YYYY‑MM‑DD)
    keyword: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
) -> List[PostResponse]:
    query: dict = {}
    if post_type:
        query["type"] = post_type
    if category:
        query["category"] = category
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    if date:
        try:
            d = dt_date.fromisoformat(date)
            query["date"] = datetime.combine(d, datetime.min.time(), tzinfo=timezone.utc)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid date format – use YYYY‑MM‑DD")
    if keyword:
        query["description"] = {"$regex": keyword, "$options": "i"}

    cursor = db_helper.db["posts"].find(query).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)
    return [_to_response(doc) for doc in docs]

# ---------------------------------------------------------------------------
# GET /posts/{id} – retrieve a single post
# ---------------------------------------------------------------------------
@router.get(
    "/{post_id}",
    response_model=PostResponse,
    summary="Get a post by its ObjectId",
)
async def get_post(post_id: str) -> PostResponse:
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=404, detail="Post not found")
    doc = await db_helper.db["posts"].find_one({"_id": ObjectId(post_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    return _to_response(doc)

# ---------------------------------------------------------------------------
# Helper – ensure the current user is the post owner
# ---------------------------------------------------------------------------
def _assert_owner(user, post_doc: dict) -> None:
    if str(post_doc.get("userId")) != str(user.id):
        raise HTTPException(status_code=403, detail="Operation allowed for owner only")

# ---------------------------------------------------------------------------
# PUT /posts/{id} – replace a post (owner only)
# ---------------------------------------------------------------------------
@router.put(
    "/{post_id}",
    response_model=PostResponse,
    summary="Replace a post (owner only)",
)
async def replace_post(
    post_id: str,
    payload: PostUpdate,
    current_user=Depends(get_current_user),
) -> PostResponse:
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=404, detail="Post not found")
    doc = await db_helper.db["posts"].find_one({"_id": ObjectId(post_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    _assert_owner(current_user, doc)
    update_data = payload.model_dump(exclude_unset=True, by_alias=True)
    if "date" in update_data and isinstance(update_data["date"], dt_date) and not isinstance(update_data["date"], datetime):
        update_data["date"] = datetime.combine(update_data["date"], datetime.min.time(), tzinfo=timezone.utc)
    await db_helper.db["posts"].update_one({"_id": ObjectId(post_id)}, {"$set": update_data})
    updated = await db_helper.db["posts"].find_one({"_id": ObjectId(post_id)})
    return _to_response(updated)

# ---------------------------------------------------------------------------
# DELETE /posts/{id} – delete a post (owner only)
# ---------------------------------------------------------------------------
@router.delete(
    "/{post_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a post (owner only)",
)
async def delete_post(post_id: str, current_user=Depends(get_current_user)) -> None:
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=404, detail="Post not found")
    doc = await db_helper.db["posts"].find_one({"_id": ObjectId(post_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    _assert_owner(current_user, doc)
    await db_helper.db["posts"].delete_one({"_id": ObjectId(post_id)})
    return

# ---------------------------------------------------------------------------
# PATCH /posts/{id}/resolve – mark as resolved (owner only)
# ---------------------------------------------------------------------------
@router.patch(
    "/{post_id}/resolve",
    response_model=PostResponse,
    summary="Mark a post as resolved (owner only)",
)
async def resolve_post(post_id: str, current_user=Depends(get_current_user)) -> PostResponse:
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=404, detail="Post not found")
    doc = await db_helper.db["posts"].find_one({"_id": ObjectId(post_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    _assert_owner(current_user, doc)
    await db_helper.db["posts"].update_one({"_id": ObjectId(post_id)}, {"$set": {"status": PostStatus.resolved}})
    updated = await db_helper.db["posts"].find_one({"_id": ObjectId(post_id)})
    return _to_response(updated)
