from fastapi import APIRouter

from api.routes import qr, analytics, redirect

api_router = APIRouter()
api_router.include_router(qr.router, prefix="/qr", tags=["qr_codes"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(redirect.router, prefix="/r", tags=["redirect"])
