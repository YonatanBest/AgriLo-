from fastapi import APIRouter, Depends, HTTPException, Request
from src.auth.auth_utils import get_current_user
import os
import httpx

router = APIRouter(prefix="/api/maps", tags=["Maps"])


@router.get("/api-key")
def get_google_maps_api_key(current_user_id: str = Depends(get_current_user)):
    """
    Get Google Maps API key for frontend use - requires authentication
    """
    api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500, detail="Google Maps API key not configured"
        )

    return {"api_key": api_key}


@router.get("/embed")
async def get_google_maps_embed(
    lat: float,
    lon: float,
    zoom: int = 18,  # Much higher zoom for detail
    maptype: str = "satellite",
    current_user_id: str = Depends(get_current_user),
):
    """
    Proxy endpoint for Google Maps embed - more secure as API key stays server-side
    """
    api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500, detail="Google Maps API key not configured"
        )

    # Construct the embed URL with higher zoom and detail
    embed_url = f"https://www.google.com/maps/embed/v1/place"
    params = {"key": api_key, "q": f"{lat},{lon}", "zoom": zoom, "maptype": maptype}

    query_string = "&".join([f"{k}={v}" for k, v in params.items()])
    full_url = f"{embed_url}?{query_string}"

    return {"embed_url": full_url}


@router.get("/detailed-view")
async def get_detailed_map_view(
    lat: float,
    lon: float,
    view_type: str = "satellite",  
    current_user_id: str = Depends(get_current_user),
):
    """
    Get detailed map view with multiple options for different detail levels
    """
    api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500, detail="Google Maps API key not configured"
        )

    embed_url = f"https://www.google.com/maps/embed/v1/place"

    maptype_mapping = {
        "satellite": "satellite",
        "roadmap": "roadmap",  
    }

    params = {
        "key": api_key,
        "q": f"{lat},{lon}",
        "zoom": 20,  
        "maptype": maptype_mapping.get(view_type, "satellite"),
    }

    query_string = "&".join([f"{k}={v}" for k, v in params.items()])
    full_url = f"{embed_url}?{query_string}"

    return {"embed_url": full_url}
