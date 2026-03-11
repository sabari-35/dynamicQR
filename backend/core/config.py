import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Dynamic QR Code SaaS"
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://bwvykwcbuxefyrxpzebg.supabase.co")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dnlrd2NidXhlZnlyeHB6ZWJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTE3MjIsImV4cCI6MjA4ODc4NzcyMn0.kkZq8DV_11TzWqRHzxhxzYhYs1iw0G9A7fRmU0rXQfk")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-jwt-key-replace-in-prod") # Usually Supabase JWT secret
    
    # Configure domain for short links
    DOMAIN: str = os.getenv("DOMAIN", "http://localhost:8000")

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
