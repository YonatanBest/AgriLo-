from pydantic import BaseModel
from typing import Optional


class SoilRequest(BaseModel):
    latitude: float
    longitude: float
    depth: Optional[str] = "0-5cm"
    


class SoilResponse(BaseModel):
    latitude: float
    longitude: float
    depth: str
    ph: Optional[float]
    nitrogen: Optional[float]
    clay: Optional[float]
