"""
routers/auth.py
~~~~~~~~~~~~~~~
Authentication endpoints:

  POST /auth/signup  – register a new user
  POST /auth/login   – verify credentials and return a JWT access token
"""

from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from fastapi import APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends

from core.security import hash_password, verify_password, create_access_token
from core.dependencies import get_current_user
from database import db_helper
from models import UserCreate, UserResponse

router = APIRouter(prefix="/auth", tags=["Auth"])



# ---------------------------------------------------------------------------
# Response schema for the login endpoint
# ---------------------------------------------------------------------------

from pydantic import BaseModel


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------------------------------------------------------------------------
# POST /auth/signup
# ---------------------------------------------------------------------------

@router.post(
    "/signup",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
async def signup(payload: UserCreate) -> UserResponse:
    """Create a new user account.

    - Rejects the request if the email is already registered.
    - Stores a bcrypt hash of the password — the plain-text password is
      never persisted.
    """
    users = db_helper.db["users"]

    # 1. Duplicate email check
    existing = await users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists.",
        )

    # 2. Build the document to insert
    user_doc = {
        "name": payload.name,
        "email": payload.email,
        "passwordHash": hash_password(payload.password),
        "phone": payload.phone,
        "createdAt": datetime.now(timezone.utc),
    }

    # 3. Insert and return the created user (without passwordHash)
    result = await users.insert_one(user_doc)
    created = await users.find_one({"_id": result.inserted_id})
    return UserResponse(**created)


# ---------------------------------------------------------------------------
# POST /auth/login
# ---------------------------------------------------------------------------

@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Log in and receive a JWT access token",
)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> TokenResponse:
    """Authenticate with email + password and return a Bearer token.

    The request body must be submitted as ``application/x-www-form-urlencoded``
    with fields ``username`` (email) and ``password`` — this matches the
    OAuth2 Password Grant convention used by FastAPI's built-in /docs UI.
    """
    users = db_helper.db["users"]

    # 1. Look up the user by email (OAuth2 uses the `username` field for this)
    user_doc = await users.find_one({"email": form_data.username})

    # 2. Verify password — same error for unknown email OR wrong password
    #    (prevents user-enumeration attacks)
    if user_doc is None or not verify_password(form_data.password, user_doc["passwordHash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Issue JWT
    token = create_access_token(subject=str(user_doc["_id"]))
    return TokenResponse(access_token=token)


# ---------------------------------------------------------------------------
# GET /auth/me
# ---------------------------------------------------------------------------

@router.get(
    "/me",
    response_model=UserResponse,
    summary="Return the currently authenticated user's profile",
)
async def get_me(current_user=Depends(get_current_user)) -> UserResponse:
    """Fetch the profile of the user identified by the Bearer token."""
    users = db_helper.db["users"]
    from bson import ObjectId
    doc = await users.find_one({"_id": ObjectId(str(current_user.id))})
    if not doc:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found.")
    return UserResponse(**doc)


# ---------------------------------------------------------------------------
# GET /auth/users/{user_id}  – public profile (name + email only)
# ---------------------------------------------------------------------------

from pydantic import BaseModel as _BaseModel

class PublicUserProfile(_BaseModel):
    name: str
    email: str
    phone: Optional[str] = None


@router.get(
    "/users/{user_id}",
    response_model=PublicUserProfile,
    summary="Return a user's public profile (name and email)",
)
async def get_user_profile(
    user_id: str,
    _current_user=Depends(get_current_user),
) -> PublicUserProfile:
    """Fetch the name and email of any user by their ID.

    Requires authentication to prevent scraping, but only exposes
    public information (name + email — never the password hash).
    """
    users = db_helper.db["users"]
    doc = await users.find_one({"_id": ObjectId(user_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="User not found.")
    return PublicUserProfile(name=doc["name"], email=doc["email"], phone=doc.get("phone"))
