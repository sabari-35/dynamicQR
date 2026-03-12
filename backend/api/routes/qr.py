from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from supabase import Client
import uuid

from core.utils import generate_short_id
from api.deps import get_current_user, get_supabase_client, User
from api.schemas import QRCodeCreate, QRCodeResponse, QRCodeUpdate
from core.config import settings

router = APIRouter()

@router.post("/", response_model=QRCodeResponse)
def create_qr_code(
    qr_in: QRCodeCreate,
    current_user: User = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client)
):
    short_id = generate_short_id(6)
    qr_data = qr_in.model_dump()
    
    # Store string versions
    qr_data["destination_url"] = str(qr_data["destination_url"])
    if qr_data.get("folder_id"):
        qr_data["folder_id"] = str(qr_data["folder_id"])
    if qr_data.get("campaign_id"):
        qr_data["campaign_id"] = str(qr_data["campaign_id"])
    if qr_data.get("expires_at"):
        qr_data["expires_at"] = qr_data["expires_at"].isoformat()

    qr_data["short_id"] = short_id
    qr_data["user_id"] = str(current_user.id)
    qr_data["status"] = qr_data.get("status", "active")
    qr_data["qr_type"] = qr_data.get("qr_type", "website")

    try:
        res = supabase.table("qr_codes").insert(qr_data).execute()
        if not res.data:
            raise HTTPException(status_code=400, detail="Failed to create QR code")
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[QRCodeResponse])
def get_qr_codes(
    current_user: User = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client)
):
    try:
        res = supabase.table("qr_codes").select("*").eq("user_id", current_user.id).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{id}", response_model=QRCodeResponse)
def get_qr_code(
    id: str,
    current_user: User = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client)
):
    try:
        res = supabase.table("qr_codes").select("*").eq("id", id).eq("user_id", current_user.id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="QR Code not found")
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{id}", response_model=QRCodeResponse)
def update_qr_code(
    id: str,
    qr_in: QRCodeUpdate,
    current_user: User = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client)
):
    update_data = qr_in.model_dump(exclude_unset=True)
    if "destination_url" in update_data:
        update_data["destination_url"] = str(update_data["destination_url"])
    if "folder_id" in update_data and update_data["folder_id"]:
        update_data["folder_id"] = str(update_data["folder_id"])
    if "campaign_id" in update_data and update_data["campaign_id"]:
        update_data["campaign_id"] = str(update_data["campaign_id"])
    if "expires_at" in update_data and update_data["expires_at"]:
         update_data["expires_at"] = update_data["expires_at"].isoformat()

    try:
        res = supabase.table("qr_codes").update(update_data).eq("id", id).eq("user_id", current_user.id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="QR Code not found")
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{id}", response_model=dict)
def delete_qr_code(
    id: str,
    current_user: User = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client)
):
    try:
        res = supabase.table("qr_codes").delete().eq("id", id).eq("user_id", current_user.id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="QR Code not found")
        return {"detail": "QR Code deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
