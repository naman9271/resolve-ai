"""
Mentor routes - Profile management, Sessions, and Payments for Mentors
"""
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from app.db.database import get_db
from app.models.user import User, MentorProfile, MentorSession, UserRole, VerificationStatus, SessionDuration
from app.models.schemas import (
    MentorProfileCreate,
    MentorProfileResponse,
    MentorDashboardResponse,
    MentorProfileUpdate,
    MentorBankingUpdate,
    MentorVerificationRequest,
    MentorSessionCreate,
    MentorSessionResponse,
    MentorEarningsResponse,
    MessageResponse
)
from app.services.auth_service import get_current_user, require_role


router = APIRouter()


# ============== Mentor Profile Routes ==============

@router.post("/profile", response_model=MentorDashboardResponse, status_code=status.HTTP_201_CREATED)
async def create_mentor_profile(
    profile_data: MentorProfileCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create mentor profile for current user (registration flow)"""
    if current_user.role != UserRole.MENTOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only users with mentor role can create mentor profiles"
        )
    
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
    
    # Create profile with pending verification
    profile = MentorProfile(
        user_id=current_user.id,
        display_name=profile_data.display_name,
        profile_photo_url=profile_data.profile_photo_url,
        college_name=profile_data.college_name,
        college_tier=profile_data.college_tier,
        branch=profile_data.branch,
        year_of_study=profile_data.year_of_study,
        jee_advanced_qualified=profile_data.jee_advanced_qualified,
        jee_roll_number=profile_data.jee_roll_number,
        jee_rank=profile_data.jee_rank,
        date_of_birth=profile_data.date_of_birth,
        phone_number=profile_data.phone_number,
        bio=profile_data.bio,
        expertise_subjects=profile_data.expertise_subjects,
        verification_status=VerificationStatus.PENDING
    )
    
    db.add(profile)
    await db.commit()
    await db.refresh(profile)
    
    return profile


@router.get("/profile", response_model=MentorDashboardResponse)
async def get_mentor_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current mentor's profile (dashboard view with private data)"""
    result = await db.execute(
        select(MentorProfile).where(MentorProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentor profile not found. Please complete onboarding."
        )
    
    return profile


@router.patch("/profile", response_model=MentorDashboardResponse)
async def update_mentor_profile(
    update_data: MentorProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current mentor's profile"""
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


@router.patch("/profile/banking", response_model=MessageResponse)
async def update_mentor_banking(
    banking_data: MentorBankingUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update mentor's banking information for payments"""
    result = await db.execute(
        select(MentorProfile).where(MentorProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentor profile not found"
        )
    
    update_dict = banking_data.model_dump(exclude_unset=True)
    
    for field, value in update_dict.items():
        setattr(profile, field, value)
    
    await db.commit()
    
    return MessageResponse(message="Banking information updated successfully")


# ============== Public Mentor Routes (for Students) ==============

@router.get("/list", response_model=List[MentorProfileResponse])
async def list_mentors(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    available_only: bool = True,
    branch: Optional[str] = None,
    college_tier: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """List all approved mentors (public view for students to choose)"""
    query = select(MentorProfile).where(
        MentorProfile.verification_status == VerificationStatus.APPROVED
    )
    
    if available_only:
        query = query.where(MentorProfile.is_available == True)
    
    if branch:
        query = query.where(MentorProfile.branch.ilike(f"%{branch}%"))
    
    if college_tier:
        query = query.where(MentorProfile.college_tier == college_tier)
    
    query = query.order_by(MentorProfile.rating.desc()).offset(skip).limit(limit)
    
    result = await db.execute(query)
    mentors = result.scalars().all()
    
    return mentors


@router.get("/{mentor_id}", response_model=MentorProfileResponse)
async def get_mentor_by_id(
    mentor_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific mentor's public profile"""
    result = await db.execute(
        select(MentorProfile).where(
            and_(
                MentorProfile.id == mentor_id,
                MentorProfile.verification_status == VerificationStatus.APPROVED
            )
        )
    )
    mentor = result.scalar_one_or_none()
    
    if not mentor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentor not found"
        )
    
    return mentor


# ============== Session Management Routes ==============

@router.get("/sessions/list", response_model=List[MentorSessionResponse])
async def list_mentor_sessions(
    status_filter: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List all sessions for the current mentor"""
    result = await db.execute(
        select(MentorProfile).where(MentorProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentor profile not found"
        )
    
    query = select(MentorSession).where(MentorSession.mentor_id == profile.id)
    
    if status_filter:
        query = query.where(MentorSession.status == status_filter)
    
    query = query.order_by(MentorSession.scheduled_at.desc()).offset(skip).limit(limit)
    
    result = await db.execute(query)
    sessions = result.scalars().all()
    
    # Enrich with student names
    session_responses = []
    for session in sessions:
        student_result = await db.execute(
            select(User).where(User.id == session.student_id)
        )
        student = student_result.scalar_one_or_none()
        
        session_dict = {
            "id": session.id,
            "mentor_id": session.mentor_id,
            "student_id": session.student_id,
            "session_type": session.session_type.value,
            "scheduled_at": session.scheduled_at,
            "duration_minutes": session.duration_minutes,
            "amount": session.amount,
            "status": session.status,
            "meeting_link": session.meeting_link,
            "notes": session.notes,
            "student_rating": session.student_rating,
            "student_feedback": session.student_feedback,
            "payment_status": session.payment_status,
            "created_at": session.created_at,
            "student_name": student.full_name if student else None,
            "mentor_name": profile.display_name
        }
        session_responses.append(MentorSessionResponse(**session_dict))
    
    return session_responses


@router.get("/sessions/upcoming", response_model=List[MentorSessionResponse])
async def get_upcoming_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get upcoming scheduled sessions for the mentor"""
    result = await db.execute(
        select(MentorProfile).where(MentorProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentor profile not found"
        )
    
    result = await db.execute(
        select(MentorSession)
        .where(
            and_(
                MentorSession.mentor_id == profile.id,
                MentorSession.status == "scheduled",
                MentorSession.scheduled_at >= datetime.utcnow()
            )
        )
        .order_by(MentorSession.scheduled_at.asc())
        .limit(10)
    )
    sessions = result.scalars().all()
    
    session_responses = []
    for session in sessions:
        student_result = await db.execute(
            select(User).where(User.id == session.student_id)
        )
        student = student_result.scalar_one_or_none()
        
        session_dict = {
            "id": session.id,
            "mentor_id": session.mentor_id,
            "student_id": session.student_id,
            "session_type": session.session_type.value,
            "scheduled_at": session.scheduled_at,
            "duration_minutes": session.duration_minutes,
            "amount": session.amount,
            "status": session.status,
            "meeting_link": session.meeting_link,
            "notes": session.notes,
            "student_rating": session.student_rating,
            "student_feedback": session.student_feedback,
            "payment_status": session.payment_status,
            "created_at": session.created_at,
            "student_name": student.full_name if student else None,
            "mentor_name": profile.display_name
        }
        session_responses.append(MentorSessionResponse(**session_dict))
    
    return session_responses


@router.patch("/sessions/{session_id}/complete", response_model=MessageResponse)
async def complete_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Mark a session as completed"""
    result = await db.execute(
        select(MentorProfile).where(MentorProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentor profile not found"
        )
    
    result = await db.execute(
        select(MentorSession).where(
            and_(
                MentorSession.id == session_id,
                MentorSession.mentor_id == profile.id
            )
        )
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    session.status = "completed"
    profile.total_sessions += 1
    profile.pending_earnings += session.amount
    
    await db.commit()
    
    return MessageResponse(message="Session marked as completed")


@router.patch("/sessions/{session_id}/cancel", response_model=MessageResponse)
async def cancel_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Cancel a scheduled session"""
    result = await db.execute(
        select(MentorProfile).where(MentorProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentor profile not found"
        )
    
    result = await db.execute(
        select(MentorSession).where(
            and_(
                MentorSession.id == session_id,
                MentorSession.mentor_id == profile.id
            )
        )
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    if session.status != "scheduled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only scheduled sessions can be cancelled"
        )
    
    session.status = "cancelled"
    session.payment_status = "refunded"
    
    await db.commit()
    
    return MessageResponse(message="Session cancelled successfully")


# ============== Earnings Routes ==============

@router.get("/earnings", response_model=MentorEarningsResponse)
async def get_mentor_earnings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get mentor's earnings summary"""
    result = await db.execute(
        select(MentorProfile).where(MentorProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentor profile not found"
        )
    
    # Calculate this month's earnings
    first_day_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    result = await db.execute(
        select(func.sum(MentorSession.amount))
        .where(
            and_(
                MentorSession.mentor_id == profile.id,
                MentorSession.status == "completed",
                MentorSession.scheduled_at >= first_day_of_month
            )
        )
    )
    this_month_earnings = result.scalar() or 0
    
    # Count completed sessions
    result = await db.execute(
        select(func.count(MentorSession.id))
        .where(
            and_(
                MentorSession.mentor_id == profile.id,
                MentorSession.status == "completed"
            )
        )
    )
    completed_sessions = result.scalar() or 0
    
    return MentorEarningsResponse(
        total_earnings=profile.total_earnings,
        pending_earnings=profile.pending_earnings,
        total_sessions=profile.total_sessions,
        completed_sessions=completed_sessions,
        this_month_earnings=this_month_earnings,
        last_payout_date=None,  # TODO: Implement payout tracking
        next_payout_estimate=profile.pending_earnings
    )


# ============== Admin Routes for Mentor Verification ==============

@router.get("/admin/pending", response_model=List[MentorDashboardResponse])
async def get_pending_mentors(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    """Get all pending mentor verification requests (Admin only)"""
    result = await db.execute(
        select(MentorProfile)
        .where(MentorProfile.verification_status == VerificationStatus.PENDING)
        .order_by(MentorProfile.created_at.asc())
        .offset(skip)
        .limit(limit)
    )
    mentors = result.scalars().all()
    
    return mentors


@router.patch("/admin/{mentor_id}/verify", response_model=MessageResponse)
async def verify_mentor(
    mentor_id: int,
    verification: MentorVerificationRequest,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    """Approve or reject a mentor (Admin only)"""
    result = await db.execute(
        select(MentorProfile).where(MentorProfile.id == mentor_id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentor not found"
        )
    
    profile.verification_status = verification.status
    
    if verification.status == VerificationStatus.APPROVED:
        profile.verified_at = datetime.utcnow()
        profile.verified_by = current_user.id
        profile.rejection_reason = None
        message = "Mentor approved successfully"
    elif verification.status == VerificationStatus.REJECTED:
        profile.rejection_reason = verification.rejection_reason
        message = "Mentor rejected"
    else:
        message = "Mentor status updated"
    
    await db.commit()
    
    return MessageResponse(message=message)
