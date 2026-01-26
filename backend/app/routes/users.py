"""
User routes - Profile management for Students and Mentors
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.database import get_db
from app.models.user import User, StudentProfile, MentorProfile, UserRole
from app.models.schemas import (
    UserResponse,
    UserUpdate,
    StudentProfileCreate,
    StudentProfileResponse,
    StudentProfileUpdate,
    MentorProfileCreate,
    MentorProfileResponse,
    MentorProfileUpdate,
    MessageResponse
)
from app.services.auth_service import get_current_user, require_role


router = APIRouter()


# ============== User Profile Routes ==============

@router.get("/me", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile"""
    return current_user


@router.patch("/me", response_model=UserResponse)
async def update_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user's profile"""
    update_dict = update_data.model_dump(exclude_unset=True)
    
    for field, value in update_dict.items():
        setattr(current_user, field, value)
    
    await db.commit()
    await db.refresh(current_user)
    
    return current_user


# ============== Student Profile Routes ==============

@router.post("/student/profile", response_model=StudentProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_student_profile(
    profile_data: StudentProfileCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create student profile for current user"""
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can create student profiles"
        )
    
    # Check if profile already exists
    result = await db.execute(
        select(StudentProfile).where(StudentProfile.user_id == current_user.id)
    )
    existing_profile = result.scalar_one_or_none()
    
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student profile already exists"
        )
    
    # Create profile
    profile = StudentProfile(
        user_id=current_user.id,
        **profile_data.model_dump()
    )
    
    db.add(profile)
    await db.commit()
    await db.refresh(profile)
    
    return StudentProfileResponse.from_profile(profile)


@router.get("/student/profile", response_model=StudentProfileResponse)
async def get_student_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's student profile"""
    result = await db.execute(
        select(StudentProfile).where(StudentProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    return StudentProfileResponse.from_profile(profile)


@router.patch("/student/profile", response_model=StudentProfileResponse)
async def update_student_profile(
    update_data: StudentProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user's student profile"""
    result = await db.execute(
        select(StudentProfile).where(StudentProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    update_dict = update_data.model_dump(exclude_unset=True)
    
    for field, value in update_dict.items():
        setattr(profile, field, value)
    
    await db.commit()
    await db.refresh(profile)
    
    return StudentProfileResponse.from_profile(profile)


# ============== Mentor Profile Routes ==============

@router.post("/mentor/profile", response_model=MentorProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_mentor_profile(
    profile_data: MentorProfileCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create mentor profile for current user"""
    # Update user role to mentor
    current_user.role = UserRole.MENTOR
    
    # Check if profile already exists
    result = await db.execute(
        select(MentorProfile).where(MentorProfile.user_id == current_user.id)
    )
    existing_profile = result.scalar_one_or_none()
    
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mentor profile already exists"
        )
    
    # Create profile
    profile = MentorProfile(
        user_id=current_user.id,
        **profile_data.model_dump()
    )
    
    db.add(profile)
    await db.commit()
    await db.refresh(profile)
    
    return profile


@router.get("/mentor/profile", response_model=MentorProfileResponse)
async def get_mentor_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's mentor profile"""
    result = await db.execute(
        select(MentorProfile).where(MentorProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentor profile not found"
        )
    
    return profile


@router.patch("/mentor/profile", response_model=MentorProfileResponse)
async def update_mentor_profile(
    update_data: MentorProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user's mentor profile"""
    result = await db.execute(
        select(MentorProfile).where(MentorProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentor profile not found"
        )
    
    update_dict = update_data.model_dump(exclude_unset=True)
    
    for field, value in update_dict.items():
        setattr(profile, field, value)
    
    await db.commit()
    await db.refresh(profile)
    
    return profile


# ============== Public Mentor Listing ==============

@router.get("/mentors", response_model=List[MentorProfileResponse])
async def list_mentors(
    skip: int = 0,
    limit: int = 20,
    available_only: bool = True,
    db: AsyncSession = Depends(get_db)
):
    """
    List all verified mentors (public endpoint).
    Students can browse available mentors.
    """
    query = select(MentorProfile).where(
        MentorProfile.verification_status == "approved"
    )
    
    if available_only:
        query = query.where(MentorProfile.is_available == True)
    
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    mentors = result.scalars().all()
    
    return mentors


@router.get("/mentors/{mentor_id}", response_model=MentorProfileResponse)
async def get_mentor(
    mentor_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific mentor's profile (public)"""
    result = await db.execute(
        select(MentorProfile).where(MentorProfile.id == mentor_id)
    )
    mentor = result.scalar_one_or_none()
    
    if not mentor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentor not found"
        )
    
    return mentor
