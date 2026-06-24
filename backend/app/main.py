"""
Resolve AI Backend - FastAPI Application
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.utils.config import settings
from app.db.database import create_tables
from app.routes import auth, users, activity, ai_chat, mentors
from app.whatsapp_bot import router as whatsapp_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    """
    # Startup
    print(f"🚀 Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    await create_tables()
    print("✅ Database tables created/verified")
    
    yield
    
    # Shutdown
    print("👋 Shutting down...")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description="""
    ## Resolve AI Backend API
    
    A comprehensive platform for JEE aspirants featuring:
    - 🎓 Student & Mentor Management
    - 📚 PYQ (Previous Year Questions) System
    - 🤖 AI-powered Study Assistant
    - 💬 Mentorship Platform
    - 📊 Performance Analytics
    - 🏠 Study Rooms (WebSocket)
    
    Built with ❤️ by the Resolve AI Team
    """,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(mentors.router, prefix="/api/v1/mentors", tags=["Mentors"])
app.include_router(activity.router, prefix="/api/v1/activity", tags=["Activity & Streaks"])
app.include_router(ai_chat.router, prefix="/api/v1/ai", tags=["AI Chat & PYQ"])
app.include_router(whatsapp_router, prefix="/api/v1/whatsapp", tags=["WhatsApp Bot"])


# Root endpoint
@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - API health check"""
    return {
        "message": f"Welcome to {settings.APP_NAME} API",
        "version": settings.APP_VERSION,
        "status": "healthy",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION
    }


# Run with: uvicorn app.main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
