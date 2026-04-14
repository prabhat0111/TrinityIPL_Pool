"""
Session & Cookie Management Module
-----------------------------------
Centralizes all JWT token creation, validation, refresh,
and cookie handling for the Trinity IPL Pool backend.
"""

from datetime import datetime, timedelta
from jose import jwt, JWTError, ExpiredSignatureError
from fastapi import HTTPException, Request, Response, Depends
from fastapi.security import OAuth2PasswordBearer
from config import settings

# ─── Constants ──────────────────────────────────────────────────────────────────

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = 1440       # 24 hours
REFRESH_THRESHOLD_MINUTES = 120          # Auto-refresh if < 2 hours left
COOKIE_NAME = "access_token"
COOKIE_MAX_AGE = ACCESS_TOKEN_EXPIRE_MINUTES * 60  # seconds

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login", auto_error=False)


# ─── Token Creation ─────────────────────────────────────────────────────────────

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Create a signed JWT with the given payload.
    Accepts an optional custom expiry; defaults to ACCESS_TOKEN_EXPIRE_MINUTES.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),   # issued-at timestamp for refresh checks
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ─── Token Decoding / Validation ────────────────────────────────────────────────

def decode_token(token: str) -> dict:
    """
    Decode and validate a JWT token.
    Raises HTTPException(401) on any failure.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("user_id") is None:
            raise HTTPException(status_code=401, detail="Invalid token: missing user_id")
        return payload
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ─── Token Extraction ───────────────────────────────────────────────────────────

def extract_token(request: Request, token: str | None = Depends(oauth2_scheme)) -> str:
    """
    Extract JWT token from (in priority order):
    1. Authorization: Bearer header  (OAuth2 scheme)
    2. Cookie named 'access_token'

    Raises 401 if neither source provides a token.
    """
    if token:
        return token

    cookie_token = request.cookies.get(COOKIE_NAME)
    if cookie_token:
        return cookie_token

    raise HTTPException(status_code=401, detail="Not authenticated")


# ─── Token Refresh Logic ────────────────────────────────────────────────────────

def should_refresh(payload: dict) -> bool:
    """
    Returns True if the token has less than REFRESH_THRESHOLD_MINUTES
    remaining before expiry. Used for silent token rotation.
    """
    exp = payload.get("exp")
    if exp is None:
        return False
    remaining = datetime.utcfromtimestamp(exp) - datetime.utcnow()
    return remaining < timedelta(minutes=REFRESH_THRESHOLD_MINUTES)


def refresh_token_if_needed(payload: dict) -> str | None:
    """
    If the token is within the refresh window, generate and return a fresh
    token with the same claims. Returns None if no refresh is required.
    """
    if not should_refresh(payload):
        return None

    # Carry forward the essential claims
    new_data = {
        "user_id": payload["user_id"],
        "email": payload.get("email"),
        "role": payload.get("role"),
    }
    return create_access_token(new_data)


# ─── Cookie Helpers ──────────────────────────────────────────────────────────────

def set_auth_cookie(response: Response, token: str) -> None:
    """
    Set the access_token cookie with secure defaults.
    """
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,           # Set True in production with HTTPS
        max_age=COOKIE_MAX_AGE,
        path="/",               # Available on all routes
    )


def clear_auth_cookie(response: Response) -> None:
    """
    Remove the access_token cookie (for logout).
    """
    response.delete_cookie(
        key=COOKIE_NAME,
        path="/",
        httponly=True,
        samesite="lax",
        secure=False,
    )


# ─── Session Middleware Helper ───────────────────────────────────────────────────

def attach_refreshed_token(response: Response, payload: dict) -> str | None:
    """
    Check if the token needs refreshing. If so, mint a new token,
    update the cookie AND return the new token (so the response body
    can include it for localStorage update on the frontend).
    """
    new_token = refresh_token_if_needed(payload)
    if new_token:
        set_auth_cookie(response, new_token)
    return new_token
