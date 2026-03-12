from fastapi import APIRouter, Request, BackgroundTasks, HTTPException
from fastapi.responses import RedirectResponse
from supabase import Client
from datetime import datetime
import logging

from api.deps import global_supabase

router = APIRouter()
logger = logging.getLogger(__name__)

def log_scan_event(supabase: Client, qr_id: str, request: Request):
    try:
        ip_address = request.client.host
        user_agent = request.headers.get("user-agent", "")
        
        # Super basic parsing. In production parse user_agent properly (e.g. using 'user_agents' package)
        device_type = "mobile" if "Mobile" in user_agent else "desktop"
        os = "Unknown"
        if "Windows" in user_agent: os = "Windows"
        elif "Mac" in user_agent: os = "MacOS"
        elif "Linux" in user_agent: os = "Linux"
        elif "Android" in user_agent: os = "Android"
        elif "iOS" in user_agent or "iPhone" in user_agent: os = "iOS"
            
        browser = "Unknown"
        if "Chrome" in user_agent: browser = "Chrome"
        elif "Firefox" in user_agent: browser = "Firefox"
        elif "Safari" in user_agent: browser = "Safari"
        elif "Edge" in user_agent: browser = "Edge"

        scan_data = {
            "qr_id": qr_id,
            "ip_address": ip_address,
            "device_type": device_type,
            "os": os,
            "browser": browser,
            # For country/city you would normally use an IP lookup service (e.g. GeoIP)
        }
        
        # Use service role key or insert bypassing RLS in production
        # Assuming RLS policy allows inserts or we are using service role key here
        supabase.table("scan_logs").insert(scan_data).execute()
        
    except Exception as e:
        logger.error(f"Failed to log scan event: {e}")

@router.get("/{short_id}")
async def redirect_qr(
    short_id: str,
    request: Request,
    background_tasks: BackgroundTasks,
):
    supabase = global_supabase
    try:
        # Fetch QR code
        res = supabase.table("qr_codes").select("*").eq("short_id", short_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="QR Code not found")
            
        qr_code = res.data[0]
        
        # Check Status (Pause/Resume)
        if qr_code.get("status") == "paused":
            return "This QR code is currently paused by the owner."
            
        # Check Expiration
        if qr_code.get("expires_at"):
            expires_at = datetime.fromisoformat(qr_code["expires_at"].replace("Z", "+00:00"))
            if datetime.now(expires_at.tzinfo) > expires_at:
                return "This campaign has ended." # Or redirect to a standard "Expired" page

        # Check Scan limits (In a real scenario, you query count of scan_logs)
        if qr_code.get("scan_limit"):
             count_res = supabase.table("scan_logs").select("id", count="exact").eq("qr_id", qr_code["id"]).execute()
             current_scans = count_res.count if count_res.count else 0
             if current_scans >= qr_code["scan_limit"]:
                 return "This campaign has reached its scan limit."
                 
        # Password Protection Handling (Should redirect to a password entry page on the frontend ideally)
        if qr_code.get("password_hash"):
            # Redirect to frontend password validation page with the short_id
            return RedirectResponse(url=f"/protected/{short_id}")

        # Logscan in background
        background_tasks.add_task(log_scan_event, supabase, qr_code["id"], request)

        destination_url = qr_code["destination_url"]
        
        # Handle Custom Landing Page if configured instead of direct redirect
        if qr_code.get("custom_landing_config"):
            # Redirect to frontend custom landing page viewer
             return RedirectResponse(url=f"/landing/{short_id}")

        # Standard redirect
        return RedirectResponse(url=destination_url)
        
    except Exception as e:
        logger.error(f"Redirect error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
