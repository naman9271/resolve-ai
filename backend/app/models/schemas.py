"""
Pydantic schemas for request/response validation
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.models.user import UserRole, StudentCategory, SchoolType, MentorTier, VerificationStatus


# ============== Auth Schemas ==============

class TokenResponse(BaseModel):
    """JWT token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenData(BaseModel):
    """Data encoded in JWT token"""
    user_id: int
    email: str
    role: UserRole


# ============== User Schemas ==============

class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)


class UserCreate(UserBase):
    """Schema for user registration"""
    password: str = Field(..., min_length=8)
    role: UserRole = UserRole.STUDENT


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class UserResponse(UserBase):
    """Schema for user response"""
    id: int
    role: UserRole
    avatar_url: Optional[str] = None
    is_email_verified: bool
    is_phone_verified: bool
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    """Schema for updating user profile"""
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, pattern=r"^\+?[1-9]\d{9,14}$")
    avatar_url: Optional[str] = None


# ============== Student Schemas ==============

class StudentProfileCreate(BaseModel):
    """Schema for creating student profile"""
    category: StudentCategory
    school_type: SchoolType
    target_year: int = Field(..., ge=2024, le=2030)
    target_exam: str = Field(default="JEE", max_length=50)
    target_score: Optional[int] = Field(None, ge=0, le=360)
    whatsapp_number: Optional[str] = None


class StudentProfileResponse(BaseModel):
    """Schema for student profile response"""
    id: int
    user_id: int
    category: StudentCategory
    school_type: SchoolType
    target_year: int
    target_exam: str
    current_score: Optional[int] = None
    target_score: Optional[int] = None
    is_premium: bool
    subscription_end: Optional[datetime] = None
    streak_days: int
    total_questions_solved: int
    whatsapp_verified: bool
    created_at: datetime
    is_profile_complete: bool = False

    class Config:
        from_attributes = True

    @classmethod
    def from_profile(cls, profile) -> "StudentProfileResponse":
        """Create response with computed is_profile_complete field"""
        # Profile is complete if target_score and current_score are set
        is_complete = (
            profile.target_score is not None and
            profile.current_score is not None
        )
        return cls(
            id=profile.id,
            user_id=profile.user_id,
            category=profile.category,
            school_type=profile.school_type,
            target_year=profile.target_year,
            target_exam=profile.target_exam,
            current_score=profile.current_score,
            target_score=profile.target_score,
            is_premium=profile.is_premium,
            subscription_end=profile.subscription_end,
            streak_days=profile.streak_days,
            total_questions_solved=profile.total_questions_solved,
            whatsapp_verified=profile.whatsapp_verified,
            created_at=profile.created_at,
            is_profile_complete=is_complete,
        )


class StudentProfileUpdate(BaseModel):
    """Schema for updating student profile"""
    category: Optional[StudentCategory] = None
    school_type: Optional[SchoolType] = None
    target_year: Optional[int] = Field(None, ge=2024, le=2030)
    target_exam: Optional[str] = None
    current_score: Optional[int] = Field(None, ge=0, le=360)
    target_score: Optional[int] = Field(None, ge=0, le=360)
    whatsapp_number: Optional[str] = None


# ============== Mentor Schemas ==============

class MentorProfileCreate(BaseModel):
    """Schema for creating mentor profile"""
    display_name: str = Field(..., min_length=3, max_length=50)
    college_name: str = Field(..., max_length=100)
    college_tier: MentorTier
    branch: str = Field(..., max_length=100)
    year_of_study: int = Field(..., ge=1, le=5)
    jee_advanced_qualified: bool = False
    jee_roll_number: Optional[str] = None
    jee_rank: Optional[int] = None
    date_of_birth: Optional[datetime] = None
    bio: Optional[str] = None
    expertise_subjects: Optional[str] = None  # JSON array string


class MentorProfileResponse(BaseModel):
    """Schema for mentor profile response (public view)"""
    id: int
    display_name: str  # Anonymous name
    college_tier: MentorTier
    branch: str
    year_of_study: int
    jee_advanced_qualified: bool
    verification_status: VerificationStatus
    bio: Optional[str] = None
    expertise_subjects: Optional[str] = None
    hourly_rate: int
    is_available: bool
    total_sessions: int
    rating: float
    total_reviews: int

    class Config:
        from_attributes = True


class MentorProfileUpdate(BaseModel):
    """Schema for updating mentor profile"""
    display_name: Optional[str] = Field(None, min_length=3, max_length=50)
    bio: Optional[str] = None
    expertise_subjects: Optional[str] = None
    hourly_rate: Optional[int] = Field(None, ge=0)
    is_available: Optional[bool] = None


# ============== Google OAuth Schemas ==============

class GoogleAuthRequest(BaseModel):
    """Schema for Google OAuth callback"""
    code: str


class GoogleUserInfo(BaseModel):
    """Schema for Google user info"""
    id: str
    email: str
    name: str
    picture: Optional[str] = None
    verified_email: bool = False


# ============== Activity Tracking Schemas ==============

class DailyActivityResponse(BaseModel):
    """Schema for daily activity response"""
    date: str  # YYYY-MM-DD format
    questions_solved: int
    pyq_solved: int
    study_minutes: int
    chat_queries: int
    activity_level: int  # 0-4

    class Config:
        from_attributes = True


class ActivityLogRequest(BaseModel):
    """Schema for logging activity"""
    activity_type: str  # "question_solved", "pyq_solved", "study_time", "chat_query"
    count: int = 1
    study_minutes: Optional[int] = None


class ActivityHeatmapResponse(BaseModel):
    """Schema for activity heatmap data"""
    activities: list[DailyActivityResponse]
    total_questions: int
    current_streak: int
    longest_streak: int
    total_active_days: int


class StreakMilestone(BaseModel):
    """Schema for streak milestone celebrations"""
    milestone: int  # 3, 7, 14, 30, 50, 100, etc.
    message: str
    emoji: str
    celebration_type: str  # "confetti", "fireworks", "stars"


# ============== Generic Response Schemas ==============

class MessageResponse(BaseModel):
    """Generic message response"""
    message: str
    success: bool = True


class PaginatedResponse(BaseModel):
    """Generic paginated response"""
    items: list
    total: int
    page: int
    per_page: int
    total_pages: int
