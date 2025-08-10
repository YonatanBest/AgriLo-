# routes/soil.py
from fastapi import APIRouter, Query, HTTPException
from src.ext_apis.soil_api import get_soil_summary_async

router = APIRouter(prefix="/api/soil", tags=["Soil"])


@router.get("/summary")
async def get_soil_summary(
    lat: float = Query(..., description="Latitude in decimal degrees"),
    lon: float = Query(..., description="Longitude in decimal degrees"),
    depth: str = Query("0-20", description="Soil depth range (e.g., '0-20')"),
    top_k: int = Query(5, description="Number of top probable soil types to retrieve"),
):
    try:
        summary = await get_soil_summary_async(lat, lon, depth, top_k)
        return {"status": "success", "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
