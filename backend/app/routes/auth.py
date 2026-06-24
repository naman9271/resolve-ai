"""
Authentication routes - Login, Register, Google OAuth
"""
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.database import get_db
from app.models.user import User, UserRole
from app.models.schemas import (
    UserCreate, 
    UserLogin, 
    UserResponse, 
    TokenResponse,
    MessageResponse,
    GoogleAuthRequest
)
from app.services.auth_service import (
    hash_password, 
    verify_password, 
    create_access_token, 
    create_refresh_token,
    decode_token,
    get_current_user
)
from app.services.google_oauth import (
    get_google_auth_url,
    exchange_code_for_token,
    get_google_user_info
)
from app.utils.config import settings


router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user with email and password.
    """
    # Check if email already exists
    result = await db.execute(
        select(User).where(User.email == user_data.email)
    )
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        phone=user_data.phone,
        hashed_password=hash_password(user_data.password),
        role=user_data.role
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Generate tokens
    token_data = {
        "user_id": new_user.id,
        "email": new_user.email,
        "role": new_user.role.value
    }
    
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """
    Login with email and password.
    """
    # Find user by email
    result = await db.execute(
        select(User).where(User.email == credentials.email)
    )
    user = result.scalar_one_or_none()
    
    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    await db.commit()
    
    # Generate tokens
    token_data = {
        "user_id": user.id,
        "email": user.email,
        "role": user.role.value
    }
    
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_token: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get new access token using refresh token.
    """
    token_data = decode_token(refresh_token)
    
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    # Verify user still exists and is active
    result = await db.execute(
        select(User).where(User.id == token_data.user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Generate new tokens
    new_token_data = {
        "user_id": user.id,
        "email": user.email,
        "role": user.role.value
    }
    
    new_access_token = create_access_token(new_token_data)
    new_refresh_token = create_refresh_token(new_token_data)
    
    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


# ============== Google OAuth ==============

@router.get("/google")
async def google_login(role: str = "student"):
    """
    Redirect to Google OAuth consent screen.
    """
    auth_url = get_google_auth_url(role)
    return RedirectResponse(url=auth_url)


@router.get("/google/callback")
async def google_callback(
    code: str,
    state: str = "student",
    db: AsyncSession = Depends(get_db)
):
    """
    Handle Google OAuth callback.
    Creates user if doesn't exist, then returns JWT tokens.
    """
    # Determine role from state parameter
    requested_role = UserRole.MENTOR if state == "mentor" else UserRole.STUDENT
    
    # Exchange code for token
    token_response = await exchange_code_for_token(code)
    
    if not token_response:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to exchange code for token"
        )
    
    access_token = token_response.get("access_token")
    
    # Get user info from Google
    google_user = await get_google_user_info(access_token)
    
    if not google_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to get user info from Google"
        )
    
    # Check if user exists by Google ID or email
    result = await db.execute(
        select(User).where(
            (User.google_id == google_user.id) | (User.email == google_user.email)
        )
    )
    user = result.scalar_one_or_none()
    
    if user:
        # Update Google ID if not set
        if not user.google_id:
            user.google_id = google_user.id
        user.is_email_verified = google_user.verified_email
        user.last_login = datetime.utcnow()
        if google_user.picture:
            user.avatar_url = google_user.picture
        # If existing student wants to become a mentor, update role
        if requested_role == UserRole.MENTOR and user.role == UserRole.STUDENT:
            user.role = UserRole.MENTOR
    else:
        # Create new user with requested role
        user = User(
            email=google_user.email,
            full_name=google_user.name,
            google_id=google_user.id,
            avatar_url=google_user.picture,
            is_email_verified=google_user.verified_email,
            role=requested_role
        )
        db.add(user)
    
    await db.commit()
    await db.refresh(user)
    
    # Generate tokens
    token_data = {
        "user_id": user.id,
        "email": user.email,
        "role": user.role.value
    }
    
    jwt_access_token = create_access_token(token_data)
    jwt_refresh_token = create_refresh_token(token_data)
    
    # Redirect to frontend with tokens
    # For mentors, redirect to mentor callback
    callback_path = "/mentor/callback" if user.role == UserRole.MENTOR else "/auth/callback"
    redirect_url = (
        f"{settings.FRONTEND_URL}{callback_path}"
        f"?access_token={jwt_access_token}"
        f"&refresh_token={jwt_refresh_token}"
    )
    
    return RedirectResponse(url=redirect_url)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user's profile.
    """
    return current_user


@router.post("/logout", response_model=MessageResponse)
async def logout(current_user: User = Depends(get_current_user)):
    """
    Logout user (client should discard tokens).
    In a production app, you might want to blacklist the token.
    """
    return MessageResponse(message="Successfully logged out")
