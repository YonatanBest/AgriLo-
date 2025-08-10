from fastapi import APIRouter, UploadFile, File, Form, Depends
import tempfile
from src.flows import diagnosis_flow
from src.auth.auth_utils import get_current_user

router = APIRouter(prefix="/api/crop-health", tags=["Crop Health"])



@router.post("/diagnose", dependencies=[Depends(get_current_user)])
async def analyze_crop_health(image: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await image.read())
        tmp_path = tmp.name

    result = await diagnosis_flow(tmp_path)
    return result