from dotenv import load_dotenv
from pathlib import Path

# Load .env from the backend directory
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)


from fastapi import FastAPI, APIRouter
from src.routes.crop_health import router as crop_health_router
from src.routes.soil_data import router as soil_router
from src.routes.weather_forecast import router as weather_router
from src.routes.recommend import router as recommend_router
from src.routes.chat import router as chat_router
from src.routes.user import router as user_router
from src.routes.maps import router as maps_router


from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


origins = [
   "*"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(crop_health_router)
app.include_router(soil_router)
app.include_router(weather_router)
app.include_router(recommend_router)
app.include_router(chat_router)
app.include_router(user_router)
app.include_router(maps_router)
