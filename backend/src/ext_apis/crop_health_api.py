from dotenv import load_dotenv
import os
import tempfile
from PIL import Image
import httpx
import asyncio
import time

load_dotenv()

def simplify_prediction_result(prediction: dict) -> dict:
    kindwise = prediction.get("kindwise_result", {})
    openepi_raw = prediction.get("openEPI_result", {})
    deepl_raw = prediction.get("deepl_result", {})

    # Process openEPI result
    openepi = {
        "healthy": openepi_raw.get("HLT", 0),
        "not_healthy": openepi_raw.get("NOT_HLT", 0),
    }

    # Process kindwise result
    diseases = []
    for suggestion in (
        kindwise.get("result", {}).get("disease", {}).get("suggestions", [])
    ):
        if suggestion.get("probability", 0) > 0.2:
            similar_images = [
                {"url": img["url"], "citation": img.get("citation", "")}
                for img in suggestion.get("similar_images", [])
            ]
            diseases.append(
                {
                    "name": suggestion["name"],
                    "probability": suggestion["probability"],
                    "scientific_name": suggestion["scientific_name"],
                    "similar_images": similar_images,
                }
            )

    crops = []
    for crop in kindwise.get("result", {}).get("crop", {}).get("suggestions", []):
        similar_images = [
            {"url": img["url"], "citation": img.get("citation", "")}
            for img in crop.get("similar_images", [])
        ]
        crops.append(
            {
                "name": crop["name"],
                "probability": crop["probability"],
                "scientific_name": crop["scientific_name"],
                "similar_images": similar_images,
            }
        )

    is_plant = kindwise.get("result", {}).get("is_plant", {}).get("binary", False)

    # Process deepl_raw result - filtered to useful fields
    deepl_data = deepl_raw.get("data", {})
    deepl_filtered = {
        "crops": deepl_data.get("crops", []),
        "diagnoses_detected": deepl_data.get("diagnoses_detected", False),
        "image_feedback": deepl_data.get("image_feedback", {}),
        "diagnoses": []
    }
    for diag in deepl_data.get("predicted_diagnoses", []):
        filtered_diag = {
            "common_name": diag.get("common_name"),
            "diagnosis_likelihood": diag.get("diagnosis_likelihood"),
            "scientific_name": diag.get("scientific_name"),
            "pathogen_class": diag.get("pathogen_class"),
            "symptoms_short": diag.get("symptoms_short", []),
            "preventive_measures": diag.get("preventive_measures", []),
            "treatment_chemical": diag.get("treatment_chemical"),
            "treatment_organic": diag.get("treatment_organic"),
            "trigger": diag.get("trigger"),
        }
        deepl_filtered["diagnoses"].append(filtered_diag)
        
        
    # print("after ------------------------------")
    # print(deepl_filtered)

    return {
        "kindwise": {"is_plant": is_plant, "diseases": diseases, "crops": crops},
        "openepi": openepi,
        "deepl": deepl_filtered,
    }




def ensure_min_resolution(image_path: str) -> str:
    MIN_SIZE = 200
    MAX_SIZE = 2000
    with Image.open(image_path) as img:
        width, height = img.size
        if width >= MIN_SIZE and height >= MIN_SIZE:
            return image_path
        scale = MIN_SIZE / min(width, height)
        new_width = int(width * scale)
        new_height = int(height * scale)
        if new_width > MAX_SIZE or new_height > MAX_SIZE:
            scale = min(MAX_SIZE / new_width, MAX_SIZE / new_height)
            new_width = int(new_width * scale)
            new_height = int(new_height * scale)
        resized_img = img.resize((new_width, new_height), Image.LANCZOS)
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
        resized_img.save(temp_file.name, format="JPEG")
        temp_file.close()
        return temp_file.name


async def async_openEPI_api(client, image_data, model_type="binary"):
    url = "https://api.openepi.io/crop-health/predictions/binary"
    if not url:
        raise ValueError("Invalid model type. Choose 'binary', 'single', or 'multi' for the openEPI api")
    try:
        response = await client.post(url, data=image_data, headers={"Content-Type": "image/jpeg"})
        response.raise_for_status()
        return {"api": "openEPI", "result": response.json()}
    except httpx.HTTPStatusError as e:
        print(f"HTTP error occurred: {e}")
        return {"api": "openEPI", "error": str(e), "details": e.response.text}
    except httpx.RequestError as e:
        print(f"Network error occurred: {e}")
        return {"api": "openEPI", "error": "Network error", "details": str(e)}
    except Exception as e:
        print(f"Unknown Error occurred: {e}")
        return {"api": "openEPI", "error": "Unexpected error", "details": str(e)}



async def async_kindwise_api(client, image_path, image_data, latitude=49.5, longitude=45, similar_images=True):
    url = "https://crop.kindwise.com/api/v1/identification"
    headers = {"Api-Key": os.getenv("KINDWISE_API_KEY")}
    form_data = {"latitude": str(latitude), "longitude": str(longitude), "similar_images": str(similar_images).lower()}
    files = {"images": (image_path, image_data, "image/jpeg")}
    try:
        response = await client.post(url, headers=headers, data=form_data, files=files)
        response.raise_for_status()
        result = response.json()
        if isinstance(result, dict) and "error" in result:
            return {"api": "kindwise", "error": result["error"]}
        return {"api": "kindwise", "result": result}
    except httpx.HTTPStatusError as e:
        print(f"HTTP error occurred: {e}")
        return {"api": "kindwise", "error": str(e), "details": e.response.text}
    except httpx.RequestError as e:
        print(f"Network error occurred: {e}")
        return {"api": "kindwise", "error": "Network error", "details": str(e)}
    except Exception as e:
        print(f"Unknown Error occurred: {e}")
        return {"api": "kindwise", "error": "Unexpected error", "details": str(e)}
    
    

async def async_deepl_analyze_leaf(client, image_path, lat, lon, language="en"):
    valid_image_path = ensure_min_resolution(image_path)
    params = {"api_key": os.getenv("DEEPL_API_KEY"), "language": language, "lat": lat, "lon": lon}
    try:
        with open(valid_image_path, "rb") as img_file:
            files = {"image": (valid_image_path, img_file, "image/jpeg")}
            response = await client.post("https://api.deepleaf.io/analyze", params=params, files=files)
        if response.status_code != 200:
            return {"api": "deepl", "error": f"Request failed: {response.status_code}", "details": response.text}
        return {"api": "deepl", "result": response.json()}
    except FileNotFoundError:
        return {"api": "deepl", "error": "Image file not found"}
    except httpx.HTTPStatusError as e:
        return {"api": "deepl", "error": str(e), "details": e.response.text}
    except httpx.RequestError as e:
        return {"api": "deepl", "error": "Network error", "details": str(e)}
    except Exception as e:
        return {"api": "deepl", "error": "Unexpected error", "details": str(e)}
    finally:
        if valid_image_path != image_path:
            try:
                os.remove(valid_image_path)
            except Exception:
                pass



async def predict_crop_health(image_path: str, model_type: str = "binary", latitude: float = 49.5, longitude: float = 45, similar_images: bool = True) -> dict:
    try:
        with open(image_path, "rb") as f:
            image_data = f.read()
    except FileNotFoundError:
        raise RuntimeError("Image file not found")
    
    
    begin_time = time.time()

    async with httpx.AsyncClient() as client:
        tasks = [
            async_openEPI_api(client, image_data, model_type),
            async_kindwise_api(client, image_path, image_data, latitude, longitude, similar_images),
            async_deepl_analyze_leaf(client, image_path, latitude, longitude)
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Extract results and check for errors
        openEPI_result = {}
        kindwise_result = {}
        deepl_result = {}
        kindwise_failed = False
        deepl_failed = False

        for result in results:
            if result["api"] == "openEPI":
                openEPI_result = result.get("result", {})
                if "error" in result:
                    print(f"[OpenEPI Failed] {result['error']}: {result.get('details', '')}")
            elif result["api"] == "kindwise":
                kindwise_result = result.get("result", {})
                if "error" in result:
                    kindwise_failed = True
                    print(f"[Kindwise Failed] {result['error']}: {result.get('details', '')}")
            elif result["api"] == "deepl":
                deepl_result = result.get("result", {})
                if "error" in result:
                    deepl_failed = True
                    print(f"[DeepLeaf Failed] {result['error']}: {result.get('details', '')}")

        if kindwise_failed and deepl_failed:
            raise RuntimeError("Both Kindwise and DeepLeaf APIs failed. Unable to analyze crop health.")


        # print("before ------------------")
        
        # print(deepl_result)
        
        ans = simplify_prediction_result({
            "kindwise_result": kindwise_result,
            "openEPI_result": openEPI_result,
            "deepl_result": deepl_result
        })
        
        
        print("total time it takes",  time.time() - begin_time)
        # print()
        # print()
        
        # print("after ------------------")
        # print()
        # print(ans["deepl"])

        return ans


