"""
User models for Students and Mentors
"""
from datetime import datetime
from enum import Enum
from typing import Optional
from sqlalchemy import String, Boolean, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base


class UserRole(str, Enum):
    STUDENT = "student"
    MENTOR = "mentor"
    ADMIN = "admin"


class StudentCategory(str, Enum):
    CLASS_11 = "11th"
    CLASS_12 = "12th"
    DROPPER = "dropper"
    PARTIAL_DROPPER = "partial_dropper"


class SchoolType(str, Enum):
    DUMMY = "dummy"
    REGULAR = "regular"


class MentorTier(str, Enum):
    TIER_1 = "tier_1"  # NIT, IIIT - ₹99/month
    IIT = "iit"  # IIT - ₹199/month


class VerificationStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class User(Base):
    """Base user model for authentication"""
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)  # Null for OAuth users
    
    # Profile
    full_name: Mapped[str] = mapped_column(String(100))
    phone: Mapped[Optional[str]] = mapped_column(String(15), nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # Role
    role: Mapped[UserRole] = mapped_column(SQLEnum(UserRole), default=UserRole.STUDENT)
    
    # Verification
    is_email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    is_phone_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    # OAuth
    google_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, unique=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Relationships
    student_profile: Mapped[Optional["StudentProfile"]] = relationship(back_populates="user", uselist=False)
    mentor_profile: Mapped[Optional["MentorProfile"]] = relationship(back_populates="user", uselist=False)


class StudentProfile(Base):
    """Extended profile for students"""
    __tablename__ = "student_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    
    # Student Info
    category: Mapped[StudentCategory] = mapped_column(SQLEnum(StudentCategory))
    school_type: Mapped[SchoolType] = mapped_column(SQLEnum(SchoolType))
    target_year: Mapped[int] = mapped_column()  # JEE attempt year
    
    # Preparation Details
    target_exam: Mapped[str] = mapped_column(String(50), default="JEE")  # JEE Main, JEE Advanced, both
    current_score: Mapped[Optional[int]] = mapped_column(nullable=True)  # Last mock score
    target_score: Mapped[Optional[int]] = mapped_column(nullable=True)
    
    # Subscription
    is_premium: Mapped[bool] = mapped_column(Boolean, default=False)
    subscription_end: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Gamification
    streak_days: Mapped[int] = mapped_column(default=0)
    total_questions_solved: Mapped[int] = mapped_column(default=0)
    badges: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON string of badges
    
    # WhatsApp
    whatsapp_number: Mapped[Optional[str]] = mapped_column(String(15), nullable=True)
    whatsapp_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user: Mapped["User"] = relationship(back_populates="student_profile")


class MentorProfile(Base):
    """Extended profile for mentors"""
    __tablename__ = "mentor_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    
    # Anonymous Display
    display_name: Mapped[str] = mapped_column(String(50))  # Anonymous name shown to students
    
    # College Details (for verification - encrypted in production)
    college_name: Mapped[str] = mapped_column(String(100))
    college_tier: Mapped[MentorTier] = mapped_column(SQLEnum(MentorTier))
    branch: Mapped[str] = mapped_column(String(100))
    year_of_study: Mapped[int] = mapped_column()
    
    # JEE Details (for verification)
    jee_advanced_qualified: Mapped[bool] = mapped_column(Boolean, default=False)
    jee_roll_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    jee_rank: Mapped[Optional[int]] = mapped_column(nullable=True)
    
    # Personal (for verification - keep encrypted)
    date_of_birth: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Verification Status
    verification_status: Mapped[VerificationStatus] = mapped_column(
        SQLEnum(VerificationStatus), 
        default=VerificationStatus.PENDING
    )
    verification_documents: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON of doc URLs
    verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    verified_by: Mapped[Optional[int]] = mapped_column(nullable=True)  # Admin user ID
    
    # Mentoring
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    expertise_subjects: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON array
    hourly_rate: Mapped[int] = mapped_column(default=99)  # in INR
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)
    total_sessions: Mapped[int] = mapped_column(default=0)
    total_earnings: Mapped[int] = mapped_column(default=0)
    rating: Mapped[float] = mapped_column(default=0.0)
    total_reviews: Mapped[int] = mapped_column(default=0)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user: Mapped["User"] = relationship(back_populates="mentor_profile")


class DailyActivity(Base):
    """Track daily study activity for GitHub-style heatmap"""
    __tablename__ = "daily_activities"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    date: Mapped[datetime] = mapped_column(DateTime, index=True)  # Date only, time set to 00:00
    
    # Activity counts
    questions_solved: Mapped[int] = mapped_column(default=0)
    pyq_solved: Mapped[int] = mapped_column(default=0)
    study_minutes: Mapped[int] = mapped_column(default=0)
    chat_queries: Mapped[int] = mapped_column(default=0)
    
    # Computed activity level (0-4 like GitHub)
    activity_level: Mapped[int] = mapped_column(default=0)  # 0=none, 1=low, 2=medium, 3=high, 4=max
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Unique constraint per user per day
    __table_args__ = (
        # UniqueConstraint('user_id', 'date', name='unique_user_date'),
    )
