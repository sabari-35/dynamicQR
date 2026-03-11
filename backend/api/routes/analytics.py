from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from typing import List, Dict, Any

from api.deps import get_current_user, get_supabase_client, User
from api.schemas import ScanLogResponse

router = APIRouter()

@router.get("/dashboard", response_model=Dict[str, Any])
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client)
):
    try:
        # Get total QR codes
        qr_res = supabase.table("qr_codes").select("id", count="exact").eq("user_id", current_user.id).execute()
        total_qrs = qr_res.count if qr_res.count else 0
        
        # Get total scans for user's QR codes
        # In Supabase, doing a join count is slightly tricky via postgrest.
        # So we fetch user's qr_ids, then count scan logs
        qrs = supabase.table("qr_codes").select("id").eq("user_id", current_user.id).execute()
        qr_ids = [qr['id'] for qr in qrs.data]
        
        total_scans = 0
        if qr_ids:
             scan_res = supabase.table("scan_logs").select("id", count="exact").in_("qr_id", qr_ids).execute()
             total_scans = scan_res.count if scan_res.count else 0
             
        # Active campaigns
        camp_res = supabase.table("campaigns").select("id", count="exact").eq("user_id", current_user.id).execute()
        total_campaigns = camp_res.count if camp_res.count else 0

        return {
            "total_qrs": total_qrs,
            "total_scans": total_scans,
            "active_campaigns": total_campaigns
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/qr/{qr_id}/scans", response_model=List[ScanLogResponse])
def get_qr_scans(
    qr_id: str,
    current_user: User = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client)
):
    try:
        # verify ownership
        check = supabase.table("qr_codes").select("id").eq("id", qr_id).eq("user_id", current_user.id).execute()
        if not check.data:
            raise HTTPException(status_code=404, detail="QR Code not found")
            
        res = supabase.table("scan_logs").select("*").eq("qr_id", qr_id).order("scanned_at", desc=True).limit(100).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
