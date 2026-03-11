from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Dynamic QR Code SaaS API",
    description="Backend API for the Dynamic QR Code SaaS platform",
    version="1.0.0"
)

# CORS middleware to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update this to the actual frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from api.router import api_router

app.include_router(api_router, prefix="/api")
