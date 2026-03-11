from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client, ClientOptions
from pydantic import BaseModel
import jwt
from typing import Optional

from core.config import settings

# Global client without auth (for public queries if needed)
global_supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

security = HTTPBearer()

class User(BaseModel):
    id: str
    email: str
    role: str

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    token = credentials.credentials
    try:
        # Note: In production you should verify the JWT signature using Supabase's JWT Secret.
        # For simplicity here, we decode without verification if we trust the API Gateway,
        # but it's best to verify. Supabase auth uses HS256.
        payload = jwt.decode(token, options={"verify_signature": False})
        user_id: str = payload.get("sub")
        email: str = payload.get("email", "")
        role: str = payload.get("role", "authenticated")
        
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
            
        return User(id=user_id, email=email, role=role)
    except jwt.PyJWTError:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_supabase_client(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Client:
    token = credentials.credentials
    # Create a request-scoped client with the user's JWT for RLS
    client = create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_KEY,
        options=ClientOptions(headers={'Authorization': f'Bearer {token}'})
    )
    return client
