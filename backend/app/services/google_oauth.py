"""
Google OAuth service
"""
import httpx
import logging
from typing import Optional
from app.utils.config import settings
from app.models.schemas import GoogleUserInfo

logger = logging.getLogger(__name__)

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


def get_google_auth_url(role: str = "student") -> str:
    """
    Generate Google OAuth authorization URL.
    Frontend should redirect user to this URL.
    """
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
        "state": role  # Pass role through state parameter
    }
    
    query_string = "&".join([f"{k}={v}" for k, v in params.items()])
    return f"{GOOGLE_AUTH_URL}?{query_string}"


async def exchange_code_for_token(code: str) -> Optional[dict]:
    """
    Exchange authorization code for access token.
    """
    async with httpx.AsyncClient() as client:
        request_data = {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": settings.GOOGLE_REDIRECT_URI
        }
        logger.info(f"Exchanging code for token with redirect_uri: {settings.GOOGLE_REDIRECT_URI}")
        
        response = await client.post(
            GOOGLE_TOKEN_URL,
            data=request_data
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            logger.error(f"Google token exchange failed: {response.status_code} - {response.text}")
            return None


async def get_google_user_info(access_token: str) -> Optional[GoogleUserInfo]:
    """
    Get user info from Google using access token.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            return GoogleUserInfo(
                id=data.get("id"),
                email=data.get("email"),
                name=data.get("name"),
                picture=data.get("picture"),
                verified_email=data.get("verified_email", False)
            )
        return None
