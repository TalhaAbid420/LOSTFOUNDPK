# routers/matches.py
"""Router for match-related endpoints.
Provides:
- GET /matches/summary: match counts for all posts (badge display).
- GET /matches/{post_id}: retrieve matches for a given post.
- PATCH /matches/{match_id}/confirm: update match status (e.g., confirm).
"""

from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

from core.dependencies import get_current_user
from database import db_helper
from models import MatchResponse, MatchUpdate

router = APIRouter(prefix="/matches", tags=["Matches"])

# ---------------------------------------------------------------------------
# GET /matches/summary – lightweight dict of postId → pending match count
# ---------------------------------------------------------------------------
@router.get(
    "/summary",
    summary="Return pending match counts for all posts",
)
async def match_summary(current_user=Depends(get_current_user)):
    """Aggregates the matches collection and returns a dict mapping
    each postId (as string) to its number of pending matches.

    The frontend uses this to show a badge on item cards that have
    potential matches.
    """
    pipeline = [
        {"$match": {"status": "pending"}},
        {"$group": {
            "_id": None,
            "lostIds": {"$addToSet": {"$toString": "$lostPostId"}},
            "foundIds": {"$addToSet": {"$toString": "$foundPostId"}},
        }},
    ]
    cursor = db_helper.db["matches"].aggregate(pipeline)
    docs = await cursor.to_list(length=1)

    post_ids = set()
    for doc in docs:
        post_ids.update(doc.get("lostIds", []))
        post_ids.update(doc.get("foundIds", []))

    return {"postIds": list(post_ids)}

# ---------------------------------------------------------------------------
# GET /matches/{post_id}
# ---------------------------------------------------------------------------
@router.get(
    "/{post_id}",
    response_model=list[MatchResponse],
    summary="Retrieve matches for a given post",
)
async def get_matches(post_id: str, current_user=Depends(get_current_user)):
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=404, detail="Post not found")
    oid = ObjectId(post_id)
    cursor = db_helper.db["matches"].find({"$or": [{"lostPostId": oid}, {"foundPostId": oid}]})
    matches = await cursor.to_list(length=None)
    return [MatchResponse(**m) for m in matches]

# ---------------------------------------------------------------------------
# PATCH /matches/{match_id}/confirm
# ---------------------------------------------------------------------------
@router.patch(
    "/{match_id}/confirm",
    response_model=MatchResponse,
    summary="Confirm (or update) a match status",
)
async def confirm_match(match_id: str, payload: MatchUpdate, current_user=Depends(get_current_user)):
    if not ObjectId.is_valid(match_id):
        raise HTTPException(status_code=404, detail="Match not found")
    oid = ObjectId(match_id)
    result = await db_helper.db["matches"].find_one_and_update(
        {"_id": oid},
        {"$set": {"status": payload.status}},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Match not found")
    return MatchResponse(**result)
