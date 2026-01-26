"""
Activity tracking routes - GitHub-style heatmap and streaks
"""
from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from app.db.database import get_db
from app.models.user import User, StudentProfile, DailyActivity
from app.models.schemas import (
    DailyActivityResponse,
    ActivityLogRequest,
    ActivityHeatmapResponse,
    StreakMilestone,
    MessageResponse
)
from app.services.auth_service import get_current_user


router = APIRouter()


# Streak milestones for celebrations
STREAK_MILESTONES = {
    3: StreakMilestone(milestone=3, message="🔥 3-day streak! You're warming up!", emoji="🔥", celebration_type="stars"),
    7: StreakMilestone(milestone=7, message="⚡ 1 week streak! Consistency is key!", emoji="⚡", celebration_type="confetti"),
    14: StreakMilestone(milestone=14, message="💪 2 weeks strong! Unstoppable!", emoji="💪", celebration_type="confetti"),
    21: StreakMilestone(milestone=21, message="🏆 3 weeks! A habit is forming!", emoji="🏆", celebration_type="fireworks"),
    30: StreakMilestone(milestone=30, message="🌟 1 MONTH! You're a champion!", emoji="🌟", celebration_type="fireworks"),
    50: StreakMilestone(milestone=50, message="💎 50 days! Diamond dedication!", emoji="💎", celebration_type="fireworks"),
    100: StreakMilestone(milestone=100, message="👑 100 DAYS! LEGENDARY STATUS!", emoji="👑", celebration_type="fireworks"),
}


def calculate_activity_level(questions: int, pyq: int, minutes: int) -> int:
    """Calculate activity level (0-4) based on activity"""
    score = questions * 2 + pyq * 3 + minutes // 30
    if score == 0:
        return 0
    elif score <= 3:
        return 1
    elif score <= 8:
        return 2
    elif score <= 15:
        return 3
    else:
        return 4


async def get_or_create_today_activity(user_id: int, db: AsyncSession) -> DailyActivity:
    """Get or create today's activity record"""
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    result = await db.execute(
        select(DailyActivity).where(
            and_(
                DailyActivity.user_id == user_id,
                DailyActivity.date == today
            )
        )
    )
    activity = result.scalar_one_or_none()
    
    if not activity:
        activity = DailyActivity(user_id=user_id, date=today)
        db.add(activity)
        await db.commit()
        await db.refresh(activity)
    
    return activity


async def calculate_streak(user_id: int, db: AsyncSession) -> tuple[int, int]:
    """Calculate current and longest streak"""
    result = await db.execute(
        select(DailyActivity)
        .where(DailyActivity.user_id == user_id)
        .where(DailyActivity.activity_level > 0)
        .order_by(DailyActivity.date.desc())
    )
    activities = result.scalars().all()
    
    if not activities:
        return 0, 0
    
    # Current streak
    current_streak = 0
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    expected_date = today
    
    for activity in activities:
        activity_date = activity.date.replace(hour=0, minute=0, second=0, microsecond=0)
        if activity_date == expected_date:
            current_streak += 1
            expected_date -= timedelta(days=1)
        elif activity_date == expected_date - timedelta(days=1):
            # Allow for yesterday if no activity today yet
            current_streak += 1
            expected_date = activity_date - timedelta(days=1)
        else:
            break
    
    # Longest streak - simple calculation
    longest_streak = current_streak
    temp_streak = 0
    prev_date = None
    
    for activity in sorted(activities, key=lambda x: x.date):
        activity_date = activity.date.replace(hour=0, minute=0, second=0, microsecond=0)
        if prev_date is None or activity_date == prev_date + timedelta(days=1):
            temp_streak += 1
            longest_streak = max(longest_streak, temp_streak)
        else:
            temp_streak = 1
        prev_date = activity_date
    
    return current_streak, longest_streak


@router.post("/log", response_model=MessageResponse)
async def log_activity(
    activity_data: ActivityLogRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Log a study activity (question solved, PYQ, study time, etc.)"""
    activity = await get_or_create_today_activity(current_user.id, db)
    
    # Update based on activity type
    if activity_data.activity_type == "question_solved":
        activity.questions_solved += activity_data.count
    elif activity_data.activity_type == "pyq_solved":
        activity.pyq_solved += activity_data.count
        activity.questions_solved += activity_data.count  # PYQ also counts as question
    elif activity_data.activity_type == "study_time":
        activity.study_minutes += activity_data.study_minutes or 0
    elif activity_data.activity_type == "chat_query":
        activity.chat_queries += activity_data.count
    
    # Recalculate activity level
    activity.activity_level = calculate_activity_level(
        activity.questions_solved,
        activity.pyq_solved,
        activity.study_minutes
    )
    
    await db.commit()
    
    # Update student profile totals
    result = await db.execute(
        select(StudentProfile).where(StudentProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if profile:
        if activity_data.activity_type in ["question_solved", "pyq_solved"]:
            profile.total_questions_solved += activity_data.count
        
        # Update streak
        current_streak, _ = await calculate_streak(current_user.id, db)
        profile.streak_days = current_streak
        await db.commit()
    
    return MessageResponse(message=f"Activity logged: {activity_data.activity_type}")


@router.get("/heatmap", response_model=ActivityHeatmapResponse)
async def get_activity_heatmap(
    days: int = 365,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get activity heatmap data for the last N days"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    result = await db.execute(
        select(DailyActivity)
        .where(DailyActivity.user_id == current_user.id)
        .where(DailyActivity.date >= start_date)
        .order_by(DailyActivity.date.asc())
    )
    activities = result.scalars().all()
    
    # Convert to response format
    activity_list = [
        DailyActivityResponse(
            date=a.date.strftime("%Y-%m-%d"),
            questions_solved=a.questions_solved,
            pyq_solved=a.pyq_solved,
            study_minutes=a.study_minutes,
            chat_queries=a.chat_queries,
            activity_level=a.activity_level
        )
        for a in activities
    ]
    
    # Calculate stats
    total_questions = sum(a.questions_solved for a in activities)
    total_active_days = len([a for a in activities if a.activity_level > 0])
    current_streak, longest_streak = await calculate_streak(current_user.id, db)
    
    return ActivityHeatmapResponse(
        activities=activity_list,
        total_questions=total_questions,
        current_streak=current_streak,
        longest_streak=longest_streak,
        total_active_days=total_active_days
    )


@router.get("/streak", response_model=dict)
async def get_streak_info(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current streak info with milestone celebrations"""
    current_streak, longest_streak = await calculate_streak(current_user.id, db)
    
    # Check if there's a milestone to celebrate
    milestone = None
    for m in sorted(STREAK_MILESTONES.keys()):
        if current_streak >= m:
            milestone = STREAK_MILESTONES[m]
    
    # Check if it's a new milestone (exact match)
    is_new_milestone = current_streak in STREAK_MILESTONES
    
    return {
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "milestone": milestone.model_dump() if milestone else None,
        "is_new_milestone": is_new_milestone,
        "next_milestone": next((m for m in sorted(STREAK_MILESTONES.keys()) if m > current_streak), None),
        "encouragement": get_encouragement_message(current_streak)
    }


def get_encouragement_message(streak: int) -> str:
    """Get an encouraging message based on streak"""
    if streak == 0:
        return "Start your streak today! Every journey begins with a single step. 🚀"
    elif streak == 1:
        return "Great start! Come back tomorrow to build your streak! 💪"
    elif streak < 3:
        return f"{streak} days strong! Keep the momentum going! 🔥"
    elif streak < 7:
        return f"Amazing {streak}-day streak! You're building a habit! ⚡"
    elif streak < 14:
        return f"Incredible {streak} days! Champions are made of this! 🏆"
    elif streak < 30:
        return f"{streak} days of dedication! IIT is calling your name! 🎯"
    elif streak < 50:
        return f"LEGENDARY {streak}-day streak! You're unstoppable! 👑"
    else:
        return f"MYTHICAL {streak}-day streak! You're writing history! 🌟"


@router.post("/celebrate", response_model=MessageResponse)
async def mark_milestone_celebrated(
    milestone: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Mark a milestone as celebrated (so we don't show it again)"""
    # In a full implementation, you'd store this in a separate table
    # For now, just acknowledge
    return MessageResponse(message=f"Milestone {milestone} celebrated!")
