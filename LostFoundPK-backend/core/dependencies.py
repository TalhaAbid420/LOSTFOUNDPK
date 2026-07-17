"""
core/dependencies.py
~~~~~~~~~~~~~~~~~~~~
FastAPI dependency functions shared across routers.

``get_current_user``  — extracts and validates the Bearer JWT from the
                        Authorization header, returning the full user document.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from core.security import decode_access_token
from database import db_helper
from models import UserResponse

# Tells FastAPI where clients send tokens (used in /docs "Authorize" button too)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserResponse:
    """Validate the Bearer JWT and return the authenticated user.

    Raises HTTP 401 if the token is missing, invalid, expired, or the user
    no longer exists in the database.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    user_id = decode_access_token(token)
    if user_id is None:
        raise credentials_exception

    from bson import ObjectId  # local import avoids circular dependency

    if not ObjectId.is_valid(user_id):
        raise credentials_exception

    user_doc = await db_helper.db["users"].find_one({"_id": ObjectId(user_id)})
    if user_doc is None:
        raise credentials_exception

    return UserResponse(**user_doc)
