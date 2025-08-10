from fastapi import APIRouter, Query, HTTPException, Depends
from src.ext_apis.weather_api import fetch_weather_summary, simplify_weather_response
from src.auth.auth_utils import get_current_user
from src.services.llm_service import llm_service
from src.db.chat_models import WeatherCache, AITaskCache
from sqlalchemy.orm import Session
from src.db.chat_models import Base
from sqlalchemy import create_engine
import json
from datetime import datetime, timedelta
import os

router = APIRouter(prefix="/api/weather", tags=["Weather"])


def get_db_session():
    """Get database session"""
    from src.db import SessionLocal

    return SessionLocal()


def get_cached_weather(user_id: str, lat: float, lon: float, days: int) -> dict:
    """Get cached weather data if available and not expired"""
    db = get_db_session()
    try:
        # Check for existing cache entry
        cache_entry = (
            db.query(WeatherCache)
            .filter(
                WeatherCache.user_id == user_id,
                WeatherCache.lat == str(lat),
                WeatherCache.lon == str(lon),
                WeatherCache.days == days,
                WeatherCache.expires_at > datetime.utcnow(),
            )
            .first()
        )

        if cache_entry:
            print(f"Using cached weather data for user {user_id}")
            return json.loads(cache_entry.weather_data)
        return None
    except Exception as e:
        print(f"Error getting cached weather: {e}")
        return None
    finally:
        db.close()


def save_weather_cache(
    user_id: str, lat: float, lon: float, days: int, weather_data: dict
):
    """Save weather data to cache"""
    db = get_db_session()
    try:
        # Remove old cache entries for this user/location
        db.query(WeatherCache).filter(
            WeatherCache.user_id == user_id,
            WeatherCache.lat == str(lat),
            WeatherCache.lon == str(lon),
            WeatherCache.days == days,
        ).delete()

        # Create new cache entry
        expires_at = datetime.utcnow() + timedelta(hours=6)  # Cache for 6 hours
        cache_entry = WeatherCache(
            user_id=user_id,
            lat=str(lat),
            lon=str(lon),
            days=days,
            weather_data=json.dumps(weather_data),
            expires_at=expires_at,
        )

        db.add(cache_entry)
        db.commit()
        print(f"Saved weather cache for user {user_id}")
    except Exception as e:
        print(f"Error saving weather cache: {e}")
        db.rollback()
    finally:
        db.close()


def get_cached_ai_tasks(user_id: str, lat: float, lon: float, date: str) -> dict:
    """Get cached AI tasks if available and not expired"""
    db = get_db_session()
    try:
        # Check for existing cache entry
        cache_entry = (
            db.query(AITaskCache)
            .filter(
                AITaskCache.user_id == user_id,
                AITaskCache.lat == str(lat),
                AITaskCache.lon == str(lon),
                AITaskCache.date == date,
                AITaskCache.expires_at > datetime.utcnow(),
            )
            .first()
        )

        if cache_entry:
            print(f"Using cached AI tasks for user {user_id}, date {date}")
            return {
                "tasks": json.loads(cache_entry.tasks_data),
                "weather_context": json.loads(cache_entry.weather_context),
            }
        return None
    except Exception as e:
        print(f"Error getting cached AI tasks: {e}")
        return None
    finally:
        db.close()


def save_ai_task_cache(
    user_id: str, lat: float, lon: float, date: str, tasks: list, weather_context: dict
):
    """Save AI tasks to cache"""
    db = get_db_session()
    try:
        # Remove old cache entries for this user/date
        db.query(AITaskCache).filter(
            AITaskCache.user_id == user_id,
            AITaskCache.lat == str(lat),
            AITaskCache.lon == str(lon),
            AITaskCache.date == date,
        ).delete()

        # Create new cache entry
        expires_at = datetime.utcnow() + timedelta(hours=24)  # Cache for 24 hours
        cache_entry = AITaskCache(
            user_id=user_id,
            lat=str(lat),
            lon=str(lon),
            date=date,
            tasks_data=json.dumps(tasks),
            weather_context=json.dumps(weather_context),
            expires_at=expires_at,
        )

        db.add(cache_entry)
        db.commit()
        print(f"Saved AI task cache for user {user_id}, date {date}")
    except Exception as e:
        print(f"Error saving AI task cache: {e}")
        db.rollback()
    finally:
        db.close()


@router.get("/forecast")
async def get_weather_forecast(
    lat: float = Query(..., description="Latitude in decimal degrees"),
    lon: float = Query(..., description="Longitude in decimal degrees"),
    past_days: int = Query(7, description="Number of past days"),
    forecast_days: int = Query(7, description="Number of forecast days"),
    current_user=Depends(get_current_user),
):
    try:
        result = await fetch_weather_summary(lat, lon, past_days, forecast_days)
        return result
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.get("/calendar")
async def get_calendar_weather(
    lat: float = Query(..., description="Latitude in decimal degrees"),
    lon: float = Query(..., description="Longitude in decimal degrees"),
    days: int = Query(31, ge=1, le=90, description="Number of days to fetch"),
    current_user=Depends(get_current_user),
):
    """
    Get daily weather data for calendar view
    Returns weather codes and daily forecasts for the specified number of days
    """
    try:
        # Check for cached weather data first
        cached_weather = get_cached_weather(current_user.user_id, lat, lon, days)
        if cached_weather:
            print(f"Returning cached weather data for user {current_user.user_id}")
            return cached_weather

        # Get weather data for the specified number of days
        # OpenMeteo requires at least one of past_days or forecast_days to be > 0
        # For calendar view, we'll get forecast data (max 16 days)
        forecast_days = min(days, 16)  # OpenMeteo max forecast is 16 days
        weather_data = await fetch_weather_summary(
            lat, lon, past_days=0, forecast_days=forecast_days
        )

        # Map weather codes to human-readable descriptions and icons
        weather_code_mapping = {
            0: {"description": "Clear sky", "icon": "sunny", "condition": "clear"},
            1: {"description": "Mainly clear", "icon": "sunny", "condition": "clear"},
            2: {
                "description": "Partly cloudy",
                "icon": "partly-cloudy",
                "condition": "partly_cloudy",
            },
            3: {"description": "Overcast", "icon": "cloudy", "condition": "overcast"},
            45: {"description": "Foggy", "icon": "cloudy", "condition": "foggy"},
            48: {
                "description": "Depositing rime fog",
                "icon": "cloudy",
                "condition": "foggy",
            },
            51: {
                "description": "Light drizzle",
                "icon": "rainy",
                "condition": "light_rain",
            },
            53: {
                "description": "Moderate drizzle",
                "icon": "rainy",
                "condition": "moderate_rain",
            },
            55: {
                "description": "Dense drizzle",
                "icon": "rainy",
                "condition": "heavy_rain",
            },
            56: {
                "description": "Light freezing drizzle",
                "icon": "rainy",
                "condition": "light_rain",
            },
            57: {
                "description": "Dense freezing drizzle",
                "icon": "rainy",
                "condition": "heavy_rain",
            },
            61: {
                "description": "Slight rain",
                "icon": "rainy",
                "condition": "light_rain",
            },
            63: {
                "description": "Moderate rain",
                "icon": "rainy",
                "condition": "moderate_rain",
            },
            65: {
                "description": "Heavy rain",
                "icon": "rainy",
                "condition": "heavy_rain",
            },
            66: {
                "description": "Light freezing rain",
                "icon": "rainy",
                "condition": "light_rain",
            },
            67: {
                "description": "Heavy freezing rain",
                "icon": "rainy",
                "condition": "heavy_rain",
            },
            71: {
                "description": "Slight snow",
                "icon": "rainy",
                "condition": "light_snow",
            },
            73: {
                "description": "Moderate snow",
                "icon": "rainy",
                "condition": "moderate_snow",
            },
            75: {
                "description": "Heavy snow",
                "icon": "rainy",
                "condition": "heavy_snow",
            },
            77: {
                "description": "Snow grains",
                "icon": "rainy",
                "condition": "light_snow",
            },
            80: {
                "description": "Slight rain showers",
                "icon": "rainy",
                "condition": "light_rain",
            },
            81: {
                "description": "Moderate rain showers",
                "icon": "rainy",
                "condition": "moderate_rain",
            },
            82: {
                "description": "Violent rain showers",
                "icon": "rainy",
                "condition": "heavy_rain",
            },
            85: {
                "description": "Slight snow showers",
                "icon": "rainy",
                "condition": "light_snow",
            },
            86: {
                "description": "Heavy snow showers",
                "icon": "rainy",
                "condition": "heavy_snow",
            },
            95: {
                "description": "Thunderstorm",
                "icon": "rainy",
                "condition": "thunderstorm",
            },
            96: {
                "description": "Thunderstorm with slight hail",
                "icon": "rainy",
                "condition": "thunderstorm",
            },
            99: {
                "description": "Thunderstorm with heavy hail",
                "icon": "rainy",
                "condition": "thunderstorm",
            },
        }

        # Process daily weather data
        daily_weather = []
        dates = weather_data.get("date", [])
        weather_codes = weather_data.get("weather_code", [])
        temp_max = weather_data.get("temperature_2m_max", [])
        temp_min = weather_data.get("temperature_2m_min", [])
        rain_sum = weather_data.get("rain_sum", [])

        print(
            f"Weather data received: {len(dates)} dates, {len(weather_codes)} weather codes"
        )

        if not dates:
            raise Exception("No weather data received from OpenMeteo API")

        for i in range(len(dates)):
            weather_code = weather_codes[i] if i < len(weather_codes) else 0
            weather_info = weather_code_mapping.get(
                weather_code, weather_code_mapping[0]
            )

            daily_weather.append(
                {
                    "date": dates[i],
                    "weather_code": weather_code,
                    "weather_description": weather_info["description"],
                    "weather_icon": weather_info["icon"],
                    "weather_condition": weather_info["condition"],
                    "temperature_max": temp_max[i] if i < len(temp_max) else None,
                    "temperature_min": temp_min[i] if i < len(temp_min) else None,
                    "rain_sum": rain_sum[i] if i < len(rain_sum) else None,
                    "is_rainy": weather_code
                    in [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99],
                    "is_cloudy": weather_code in [2, 3, 45, 48],
                    "is_sunny": weather_code in [0, 1],
                }
            )

        # Save to cache
        result = {
            "status": "success",
            "daily_weather": daily_weather,
            "location": {"lat": lat, "lon": lon},
            "days_requested": days,
        }

        # Save to cache for future requests
        save_weather_cache(current_user.user_id, lat, lon, days, result)

        return result

    except Exception as e:
        print(f"Calendar weather error: {str(e)}")
        print(f"Parameters: lat={lat}, lon={lon}, days={days}")
        raise HTTPException(
            status_code=500, detail=f"Error fetching calendar weather: {str(e)}"
        )


@router.get("/ai-tasks")
async def get_ai_task_recommendations(
    lat: float = Query(..., description="Latitude in decimal degrees"),
    lon: float = Query(..., description="Longitude in decimal degrees"),
    date: str = Query(..., description="Date in YYYY-MM-DD format"),
    current_user=Depends(get_current_user),
):
    """
    Get AI-powered task recommendations for a specific date
    Uses LLM to generate personalized farming tasks based on weather and user context
    """
    try:
        # Check for cached AI tasks first
        cached_tasks = get_cached_ai_tasks(current_user.user_id, lat, lon, date)
        if cached_tasks:
            print(
                f"Returning cached AI tasks for user {current_user.user_id}, date {date}"
            )
            return {
                "status": "success",
                "date": date,
                "weather": cached_tasks["weather_context"],
                "tasks": cached_tasks["tasks"],
                "ai_generated": True,
                "cached": True,
            }

        # Get weather data for the specific date
        weather_data = await fetch_weather_summary(
            lat, lon, past_days=0, forecast_days=16
        )

        # Find weather data for the specific date
        target_date = None
        for i, date_str in enumerate(weather_data.get("date", [])):
            if date_str == date:
                target_date = {
                    "date": date_str,
                    "weather_code": (
                        weather_data.get("weather_code", [])[i]
                        if i < len(weather_data.get("weather_code", []))
                        else 0
                    ),
                    "temperature_max": (
                        weather_data.get("temperature_2m_max", [])[i]
                        if i < len(weather_data.get("temperature_2m_max", []))
                        else None
                    ),
                    "temperature_min": (
                        weather_data.get("temperature_2m_min", [])[i]
                        if i < len(weather_data.get("temperature_2m_min", []))
                        else None
                    ),
                    "rain_sum": (
                        weather_data.get("rain_sum", [])[i]
                        if i < len(weather_data.get("rain_sum", []))
                        else None
                    ),
                }
                break

        if not target_date:
            raise Exception(f"No weather data found for date: {date}")

        # Get user context
        # Handle crops_grown as string (from database) and convert to list
        user_crops_str = current_user.crops_grown if current_user.crops_grown else ""
        user_crops = user_crops_str.split(",") if user_crops_str else []
        # Clean up the crops list (remove empty strings, whitespace, and status indicators)
        user_crops = []
        for crop in user_crops_str.split(",") if user_crops_str else []:
            crop_clean = crop.strip()
            if crop_clean:
                # Remove status indicators like ":current" or ":planned"
                if ":" in crop_clean:
                    crop_clean = crop_clean.split(":")[0]
                user_crops.append(crop_clean)

        user_experience = (
            current_user.years_experience if current_user.years_experience else 0
        )
        user_type = current_user.user_type if current_user.user_type else "farmer"
        user_goal = (
            current_user.main_goal if current_user.main_goal else "general farming"
        )

        # Debug user data
        print(f"User crops_grown (raw): {current_user.crops_grown}")
        print(f"User crops_grown (type): {type(current_user.crops_grown)}")
        print(f"User crops (processed): {user_crops}")
        print(f"User experience: {user_experience}")
        print(f"User type: {user_type}")
        print(f"User goal: {user_goal}")

        # Build context for LLM
        context = {
            "date": date,
            "location": {"lat": lat, "lon": lon},
            "weather": target_date,
            "user_profile": {
                "crops_grown": user_crops,
                "years_experience": user_experience,
                "user_type": user_type,
                "main_goal": user_goal,
            },
        }

        # Create LLM prompt for task recommendations
        prompt = f"""
You are an expert agricultural advisor. Generate personalized farming task recommendations for a farmer based on the following information:

**Date:** {date}
**Location:** {lat}, {lon}
**Weather Conditions:**
- Temperature: {target_date['temperature_max']}°C (max), {target_date['temperature_min']}°C (min)
- Rain: {target_date['rain_sum']} mm
- Weather Code: {target_date['weather_code']}

**Farmer Profile:**
- Crops: {', '.join(user_crops) if user_crops else 'Not specified'}
- Experience: {user_experience} years
- Type: {user_type}
- Goal: {user_goal}

Generate 3-5 specific, actionable farming tasks for this date. Consider:
1. Weather conditions and their impact on farming activities
2. The farmer's specific crops and experience level
3. Seasonal timing and best practices
4. Preventive measures based on weather forecasts

Format your response as a JSON array with the following structure:
[
  {{
    "task": "Task description",
    "time": "Recommended time (e.g., '8:00 AM')",
    "priority": "high/medium/low",
    "field": "Field name or 'All Fields'",
    "category": "irrigation/fertilization/pest-control/monitoring/harvesting/maintenance",
    "description": "Detailed explanation of why this task is recommended",
    "estimated_duration": "Estimated time (e.g., '2 hours')",
    "ai_reasoning": "AI's reasoning for this recommendation"
  }}
]

Focus on practical, actionable advice that a farmer can implement immediately.
"""

        # Call LLM for task recommendations
        llm_result = llm_service.send_message(prompt)
        llm_response = llm_result.get("response", "")

        if not llm_response:
            print(f"LLM service error: {llm_result.get('error', 'Unknown error')}")
            # Fallback to basic tasks
            tasks = create_fallback_tasks(target_date, user_crops)
            # Save fallback tasks to cache
            save_ai_task_cache(current_user.user_id, lat, lon, date, tasks, target_date)
            return {
                "status": "success",
                "date": date,
                "weather": target_date,
                "tasks": tasks,
                "ai_generated": False,
            }

        # Parse LLM response
        try:
            # Extract JSON from LLM response
            import re

            json_match = re.search(r"\[.*\]", llm_response, re.DOTALL)
            if json_match:
                tasks_json = json_match.group()
                tasks = json.loads(tasks_json)
            else:
                # Fallback: create basic tasks based on weather
                tasks = create_fallback_tasks(target_date, user_crops)
                # Save fallback tasks to cache
                save_ai_task_cache(
                    current_user.user_id, lat, lon, date, tasks, target_date
                )

        except Exception as parse_error:
            print(f"Error parsing LLM response: {parse_error}")
            print(f"LLM response: {llm_response}")
            # Fallback to basic tasks
            tasks = create_fallback_tasks(target_date, user_crops)
            # Save fallback tasks to cache
            save_ai_task_cache(current_user.user_id, lat, lon, date, tasks, target_date)

        # Save to cache for future requests
        save_ai_task_cache(current_user.user_id, lat, lon, date, tasks, target_date)

        return {
            "status": "success",
            "date": date,
            "weather": target_date,
            "tasks": tasks,
            "ai_generated": True,
        }

    except Exception as e:
        print(f"AI task recommendation error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating AI task recommendations: {str(e)}",
        )


def create_fallback_tasks(weather_data: dict, user_crops: list) -> list:
    """Create fallback tasks when LLM fails"""
    tasks = []

    # Basic weather-based tasks
    if weather_data.get("rain_sum", 0) > 5:
        tasks.append(
            {
                "task": "Check drainage systems",
                "time": "8:00 AM",
                "priority": "high",
                "field": "All Fields",
                "category": "maintenance",
                "description": "Heavy rain expected - ensure proper drainage",
                "estimated_duration": "1 hour",
                "ai_reasoning": "Rain expected - prevent waterlogging",
            }
        )

    if weather_data.get("temperature_max", 0) > 30:
        tasks.append(
            {
                "task": "Increase irrigation",
                "time": "6:00 AM",
                "priority": "high",
                "field": "All Fields",
                "category": "irrigation",
                "description": "High temperature - crops need more water",
                "estimated_duration": "2 hours",
                "ai_reasoning": "High temperature increases water demand",
            }
        )

    # Add crop-specific tasks if available
    if user_crops:
        for crop in user_crops[:2]:  # Limit to 2 crops
            tasks.append(
                {
                    "task": f"Monitor {crop} health",
                    "time": "4:00 PM",
                    "priority": "medium",
                    "field": "Field A",
                    "category": "monitoring",
                    "description": f"Regular health check for {crop}",
                    "estimated_duration": "30 minutes",
                    "ai_reasoning": f"Regular monitoring for {crop} is essential",
                }
            )

    return tasks
