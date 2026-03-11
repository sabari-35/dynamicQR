from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

# Folder Schemas
class FolderBase(BaseModel):
    name: str

class FolderCreate(FolderBase):
    pass

class FolderResponse(FolderBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    
# Campaign Schemas
class CampaignBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class CampaignCreate(CampaignBase):
    pass

class CampaignResponse(CampaignBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime

# QR Code Schemas
class QRCodeBase(BaseModel):
    name: str
    destination_url: HttpUrl
    is_dynamic: bool = True
    qr_design_settings: Dict[str, Any] = {}
    folder_id: Optional[uuid.UUID] = None
    campaign_id: Optional[uuid.UUID] = None
    expires_at: Optional[datetime] = None
    scan_limit: Optional[int] = None
    password_hash: Optional[str] = None
    custom_landing_config: Optional[Dict[str, Any]] = None

class QRCodeCreate(QRCodeBase):
    pass
    
class QRCodeUpdate(BaseModel):
    name: Optional[str] = None
    destination_url: Optional[HttpUrl] = None
    qr_design_settings: Optional[Dict[str, Any]] = None
    folder_id: Optional[uuid.UUID] = None
    campaign_id: Optional[uuid.UUID] = None
    expires_at: Optional[datetime] = None
    scan_limit: Optional[int] = None
    password_hash: Optional[str] = None

class QRCodeResponse(QRCodeBase):
    id: uuid.UUID
    short_id: str
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

# Analytics Schema
class ScanLogResponse(BaseModel):
    id: uuid.UUID
    qr_id: uuid.UUID
    ip_address: Optional[str]
    country: Optional[str]
    city: Optional[str]
    device_type: Optional[str]
    os: Optional[str]
    browser: Optional[str]
    scanned_at: datetime
