"""
core/security.py
~~~~~~~~~~~~~~~~
Password hashing (bcrypt directly) and JWT creation/verification (python-jose).

passlib 1.7.4 is incompatible with bcrypt >= 4.0 (it inspects a removed
``__about__`` attribute).  We call bcrypt directly instead — the API is
trivial and the dependency is already installed as a passlib transitive dep.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
from jose import JWTError, jwt

from config import settings


# ---------------------------------------------------------------------------
# Password hashing (bcrypt, no passlib wrapper)
# ---------------------------------------------------------------------------

def hash_password(plain: str) -> str:
    """Return a bcrypt hash of *plain* as a UTF-8 string."""
    password_bytes = plain.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    """Return True if *plain* matches the stored bcrypt *hashed* value."""
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


# ---------------------------------------------------------------------------
# JWT helpers
# ---------------------------------------------------------------------------

def create_access_token(
    subject: str,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Encode a signed JWT with the user's id as the ``sub`` claim.

    Parameters
    ----------
    subject:
        The value to store in the ``sub`` claim — typically the user's
        string ObjectId.
    expires_delta:
        How long the token should be valid.  Defaults to
        ``settings.JWT_EXPIRE_MINUTES``.
    """
    expire = datetime.now(timezone.utc) + (
        expires_delta
        if expires_delta is not None
        else timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    )
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[str]:
    """Decode *token* and return the ``sub`` claim (user id) if valid.

    Returns ``None`` if the token is invalid or expired.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload.get("sub")
    except JWTError:
        return None
