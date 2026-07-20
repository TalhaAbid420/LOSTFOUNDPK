"""
routers/posts.py
~~~~~~~~~~~~~~
Endpoints for the `posts` collection.
"""

from datetime import date as dt_date, datetime, timezone
from typing import List, Optional
import asyncio

from fastapi import APIRouter, Depends, HTTPException, Query, status
import httpx
from config import settings
from rapidfuzz import fuzz
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
    # After creating the post, find potential matches
    # (the matching logic is handled by a helper defined later)
    
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
    # Create matches against opposite type posts
    await _create_matches_for_post(created)
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
    status: Optional[str] = Query(None),
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
    if status:
        query["status"] = status

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

# Helper to create matches for a newly created post
async def _create_matches_for_post(post_doc: dict):
    """Find and record matches for a newly created post.
    Args:
        post_doc: The newly inserted post document (includes _id).
    """
    opposite_type = "found" if post_doc["type"] == "lost" else "lost"
    query = {
        "type": opposite_type,
        "category": post_doc["category"],
        "city": post_doc["city"],
    }
    cursor = db_helper.db["posts"].find(query)
    async for candidate in cursor:
        # Compute similarity ratio (0-1)
        score = fuzz.ratio(post_doc["description"], candidate["description"]) / 100.0
        if score > 0.4:
            if post_doc["type"] == "lost":
                lost_id = post_doc["_id"]
                found_id = candidate["_id"]
            else:
                lost_id = candidate["_id"]
                found_id = post_doc["_id"]
            existing = await db_helper.db["matches"].find_one({"lostPostId": lost_id, "foundPostId": found_id})
            if not existing:
                await db_helper.db["matches"].insert_one({
                    "lostPostId": lost_id,
                    "foundPostId": found_id,
                    "score": score,
                    "status": "pending",
                    "createdAt": datetime.now(timezone.utc),
                })
                # Notify both post owners via email (non-blocking)
                asyncio.create_task(_notify_match_owners(lost_id, found_id, score))


# Helper to send email notifications for a new match
async def _notify_match_owners(lost_post_id, found_post_id, score):
    import logging
    logger = logging.getLogger("uvicorn.error")

    # Retrieve posts to get user IDs
    lost_post = await db_helper.db["posts"].find_one({"_id": lost_post_id})
    found_post = await db_helper.db["posts"].find_one({"_id": found_post_id})
    if not lost_post or not found_post:
        return
    # Retrieve user emails
    lost_user = await db_helper.db["users"].find_one({"_id": lost_post.get("userId")})
    found_user = await db_helper.db["users"].find_one({"_id": found_post.get("userId")})
    if not lost_user or not found_user:
        return
    lost_email = lost_user.get("email")
    found_email = found_user.get("email")

    # Send via SendGrid API
    api_key = settings.SENDGRID_API_KEY
    if not api_key:
        logger.warning("SENDGRID_API_KEY not set – skipping email notifications")
        return

    sender = settings.EMAIL_FROM
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    lost_category = lost_post.get("category", "item")
    found_category = found_post.get("category", "item")

    for email, role in ((lost_email, "lost"), (found_email, "found")):
        if not email:
            continue
        subject = f"LostFoundPK: Potential match found for your {lost_category if role == 'lost' else found_category} report"
        body = (
            f"Hi {lost_user.get('name', '') if role == 'lost' else found_user.get('name', '')},\n\n"
            f"A new potential match (confidence: {score:.0%}) has been found!\n\n"
            f"• Your report type: {role.title()}\n"
            f"• Category: {lost_category if role == 'lost' else found_category}\n\n"
            f"Log in to LostFoundPK to review the match and confirm if it's your item.\n\n"
            f"Stay safe,\n"
            f"LostFoundPK Team"
        )
        payload = {
            "personalizations": [{"to": [{"email": email}]}],
            "from": {"email": sender, "name": "LostFoundPK"},
            "subject": subject,
            "content": [{"type": "text/plain", "value": body}],
        }
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    "https://api.sendgrid.com/v3/mail/send",
                    json=payload,
                    headers=headers,
                    timeout=10,
                )
                if resp.status_code not in (200, 202):
                    logger.warning(f"SendGrid returned {resp.status_code} for {email}: {resp.text}")
                else:
                    logger.info(f"Email notification sent to {email}")
        except Exception as exc:
            logger.error(f"Failed to send email to {email}: {exc}")
