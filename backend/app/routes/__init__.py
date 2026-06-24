"""
Routes package - exports all routers
"""
from app.routes import auth, users, activity, ai_chat, mentors

__all__ = ["auth", "users", "activity", "ai_chat", "mentors"]
