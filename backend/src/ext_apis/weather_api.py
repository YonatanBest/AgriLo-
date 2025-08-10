import httpx
from statistics import mean


async def fetch_weather_summary(
    latitude: float, longitude: float, past_days: int = 7, forecast_days: int = 0
) -> dict:
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": [
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "sunshine_duration",
            "rain_sum",
            "wind_speed_10m_max",
            "et0_fao_evapotranspiration",
        ],
        "past_days": past_days,
        "forecast_days": forecast_days,
        "timezone": "auto",
    }

    print(f"Weather API request: {url}")
    print(f"Weather API params: {params}")

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.get(url, params=params)
        print(f"Weather API response status: {response.status_code}")

        if response.status_code != 200:
            error_text = await response.text()
            print(f"Weather API error response: {error_text}")
            raise Exception(
                f"OpenMeteo API error: {response.status_code} - {error_text}"
            )

        data = response.json()
        print(f"Weather API response data keys: {list(data.keys())}")

    # Extract daily data
    daily = data.get("daily", {})
    summary = {
        "date": daily.get("time", []),
        "weather_code": daily.get("weather_code", []),
        "temperature_2m_max": daily.get("temperature_2m_max", []),
        "temperature_2m_min": daily.get("temperature_2m_min", []),
        "sunshine_duration": daily.get("sunshine_duration", []),
        "rain_sum": daily.get("rain_sum", []),
        "wind_speed_10m_max": daily.get("wind_speed_10m_max", []),
        "et0_fao_evapotranspiration": daily.get("et0_fao_evapotranspiration", []),
    }
    return summary


def simplify_weather_response(weather: dict) -> dict:
    """
    Simplifies the weather API response for LLM use.
    Returns a summary with averages, totals, and period covered.
    """

    def safe_mean(values):
        vals = [v for v in values if v is not None]
        return round(mean(vals), 2) if vals else None

    def safe_sum(values):
        vals = [v for v in values if v is not None]
        return round(sum(vals), 2) if vals else None

    def safe_min(values):
        vals = [v for v in values if v is not None]
        return round(min(vals), 2) if vals else None

    def safe_max(values):
        vals = [v for v in values if v is not None]
        return round(max(vals), 2) if vals else None

    dates = weather.get("date", [])
    tmax = weather.get("temperature_2m_max", [])
    tmin = weather.get("temperature_2m_min", [])
    rain = weather.get("rain_sum", [])
    sunshine = weather.get("sunshine_duration", [])
    wind = weather.get("wind_speed_10m_max", [])
    et0 = weather.get("et0_fao_evapotranspiration", [])

    summary = {
        "period_start": dates[0] if dates else None,
        "period_end": dates[-1] if dates else None,
        "avg_temperature_max": safe_mean(tmax),
        "avg_temperature_min": safe_mean(tmin),
        "min_temperature": safe_min(tmin),
        "max_temperature": safe_max(tmax),
        "total_rainfall_mm": safe_sum(rain),
        "avg_sunshine_hours": (
            round(safe_mean(sunshine) / 3600, 2) if sunshine else None
        ),  # convert seconds to hours
        "avg_wind_speed_kph": safe_mean(wind),
        "avg_evapotranspiration": safe_mean(et0),
    }
    return summary
