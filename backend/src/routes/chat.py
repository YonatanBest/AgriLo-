import re
import requests
from fastapi import APIRouter, HTTPException, Query, Depends, UploadFile, File
from pydantic import BaseModel
from typing import Optional
from src.services.chat_service import chat_session_manager
from src.services.transalation_service import (
    translation_service,
    translation_fallback_service,
)
from src.services.llm_service import llm_service
from src.services.audio_service import audio_service
from src.services.tts_service import tts_service
from src.auth.auth_utils import get_current_user


def clean_text_for_tts(text: str) -> str:
    """
    Clean text for Text-to-Speech by removing formatting characters
    that should not be spoken aloud.
    """
    if not text:
        return text

    # Remove markdown formatting
    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)  # Remove **bold**
    text = re.sub(r"\*(.*?)\*", r"\1", text)  # Remove *italic*
    text = re.sub(r"__(.*?)__", r"\1", text)  # Remove __underline__
    text = re.sub(r"_(.*?)_", r"\1", text)  # Remove _italic_

    # Remove other formatting characters
    text = re.sub(r"`(.*?)`", r"\1", text)  # Remove `code`
    text = re.sub(r"~~(.*?)~~", r"\1", text)  # Remove ~~strikethrough~~
    text = re.sub(r"#+\s*", "", text)  # Remove markdown headers
    text = re.sub(r"\[(.*?)\]\(.*?\)", r"\1", text)  # Remove [link](url) -> link

    # Remove extra asterisks and formatting
    text = re.sub(r"\*+", "", text)  # Remove standalone asterisks
    text = re.sub(r"_+", "", text)  # Remove standalone underscores
    text = re.sub(r"`+", "", text)  # Remove standalone backticks

    # Clean up extra whitespace
    text = re.sub(r"\s+", " ", text)  # Replace multiple spaces with single space
    text = text.strip()  # Remove leading/trailing whitespace

    return text


def reverse_geocode(lat: float, lon: float) -> dict:
    """
    Takes latitude and longitude and returns the location info using Photon API.
    """
    try:
        url = "https://photon.komoot.io/reverse"
        params = {"lat": lat, "lon": lon}

        response = requests.get(url, params=params)
        response.raise_for_status()  # Throws error if status code is not 200

        data = response.json()

        if data["features"]:
            return data["features"][0]["properties"]
        else:
            return {"error": "No location found for given coordinates."}
    except Exception as e:
        return {"error": f"Failed to get location: {str(e)}"}


def clean_location_for_display(location: str) -> str:
    """
    Clean location string to remove GPS coordinates and return only the location name.
    """
    if not location:
        return "Unknown location"

    # Check if location contains coordinates (numbers with decimals)
    import re

    coord_pattern = r"([\d.-]+),\s*([\d.-]+)"
    match = re.search(coord_pattern, location)

    if match:
        try:
            lat = float(match.group(1))
            lon = float(match.group(2))

            # Get location name from coordinates
            location_info = reverse_geocode(lat, lon)

            if "error" not in location_info:
                # Build a readable location string
                location_parts = []

                if location_info.get("city"):
                    location_parts.append(location_info["city"])
                elif location_info.get("name"):
                    location_parts.append(location_info["name"])

                if location_info.get("district"):
                    location_parts.append(location_info["district"])

                if location_info.get("country"):
                    location_parts.append(location_info["country"])

                if location_parts:
                    return ", ".join(location_parts)
                else:
                    return "Unknown location"
            else:
                # Fallback: remove coordinates and clean up
                location = re.sub(r",?\s*lat:\s*[\d.-]+", "", location)
                location = re.sub(r",?\s*lon:\s*[\d.-]+", "", location)
                location = re.sub(r"\s*\([\d.-]+,\s*[\d.-]+\)", "", location)
                location = re.sub(r"\s*[\d.-]+,\s*[\d.-]+", "", location)

                # Clean up any remaining artifacts
                location = re.sub(r"\s+", " ", location)
                location = location.strip()
                location = re.sub(r"^,\s*", "", location)
                location = re.sub(r",\s*$", "", location)

                return location if location else "Unknown location"
        except (ValueError, Exception):
            # If coordinate parsing fails, just clean up the string
            location = re.sub(r",?\s*lat:\s*[\d.-]+", "", location)
            location = re.sub(r",?\s*lon:\s*[\d.-]+", "", location)
            location = re.sub(r"\s*\([\d.-]+,\s*[\d.-]+\)", "", location)
            location = re.sub(r"\s*[\d.-]+,\s*[\d.-]+", "", location)

            location = re.sub(r"\s+", " ", location)
            location = location.strip()
            location = re.sub(r"^,\s*", "", location)
            location = re.sub(r",\s*$", "", location)

            return location if location else "Unknown location"
    else:
        # No coordinates found, return as is
        return location.strip()


router = APIRouter(prefix="/api/chat", tags=["Chat"])


class StartSessionRequest(BaseModel):
    user_id: Optional[str] = None


class SendMessageRequest(BaseModel):
    session_id: str
    message: str


class SendAudioMessageRequest(BaseModel):
    session_id: str


@router.post("/start-session")
def start_session(req: StartSessionRequest, current_user=Depends(get_current_user)):
    session = chat_session_manager.start_session(user_id=req.user_id)
    return {"session_id": session.session_id, "created_at": session.created_at}


@router.post("/send-message")
async def send_message(
    req: SendMessageRequest,
    preferred_language: Optional[str] = Query(
        None, description="Preferred language for conversation"
    ),
    current_user=Depends(get_current_user),
):
    session = chat_session_manager.get_session(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Use preferred language if provided, otherwise detect
    if preferred_language:
        user_lang = preferred_language
        print(f"🌍 Using preferred language: {user_lang}")
    else:
        # Detect language using main service, fallback if error
        try:
            user_lang = translation_service.detect_language(req.message)
        except Exception:
            user_lang = translation_fallback_service.detect_language(req.message)
        print(f"🌍 Detected language: {user_lang}")

    message_for_llm = req.message
    needs_translation = user_lang != "en"
    if needs_translation:
        try:
            message_for_llm = translation_service.translate_to_english(req.message)
        except Exception:
            message_for_llm = translation_fallback_service.translate_to_english(
                req.message
            )

    # Add user message
    chat_session_manager.add_message(
        req.session_id, sender="user", message=message_for_llm
    )

    messages_formatted = "\n".join(
        [f"{m.sender}: {m.message}" for m in session.messages[-10:]]
    )

    # Get farmer's personalized information
    farmer_info = f"""
Farmer Profile:
- Name: {current_user.name}
- Location: {clean_location_for_display(current_user.location)}
- Experience: {current_user.years_experience} years
- User Type: {current_user.user_type}
- Main Goal: {current_user.main_goal}
- Preferred Language: {current_user.preferred_language}
- Crops Grown: {current_user.crops_grown}
"""

    prompt = f"""You are an agricultural assistant AI helping farmers with their questions.
Respond directly to the user's query with helpful agricultural information.
Do not mention that you're playing a role or waiting for input.
If the user greets you, respond with a friendly greeting and offer to help with agricultural topics.

{farmer_info}

Conversation history:
{messages_formatted}

current user message:
{message_for_llm}

Respond as the agricultural assistant, taking into account the farmer's specific profile, location, experience level, and crops. Provide personalized advice that considers their farming context."""

    llm_response = llm_service.send_message(prompt)
    llm_text = llm_response.get("response", "")

    chat_session_manager.add_message(req.session_id, sender="llm", message=llm_text)
    # Translate LLM response back if needed
    if needs_translation and llm_text:
        try:
            llm_text = translation_service.translate_from_english(llm_text, user_lang)
        except Exception:
            llm_text = translation_fallback_service.translate_from_english(
                llm_text, user_lang
            )

    return {"response": llm_text}


@router.post("/send-voice-message")
async def send_voice_message(
    req: SendMessageRequest,
    preferred_language: Optional[str] = Query(
        None, description="Preferred language for conversation"
    ),
    current_user=Depends(get_current_user),
):
    """
    Send a message and get both text and audio response
    """
    session = chat_session_manager.get_session(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Use preferred language if provided, otherwise detect
    if preferred_language:
        user_lang = preferred_language
        print(f"🌍 Using preferred language: {user_lang}")
    else:
        # Detect language using main service, fallback if error
        try:
            user_lang = translation_service.detect_language(req.message)
        except Exception:
            user_lang = translation_fallback_service.detect_language(req.message)
        print(f"🌍 Detected language: {user_lang}")

    message_for_llm = req.message
    needs_translation = user_lang != "en"
    if needs_translation:
        try:
            message_for_llm = translation_service.translate_to_english(req.message)
        except Exception:
            message_for_llm = translation_fallback_service.translate_to_english(
                req.message
            )

    # Add user message
    chat_session_manager.add_message(
        req.session_id, sender="user", message=message_for_llm
    )

    messages_formatted = "\n".join(
        [f"{m.sender}: {m.message}" for m in session.messages[-10:]]
    )

    # Get farmer's personalized information
    farmer_info = f"""
Farmer Profile:
- Name: {current_user.name}
- Location: {clean_location_for_display(current_user.location)}
- Experience: {current_user.years_experience} years
- User Type: {current_user.user_type}
- Main Goal: {current_user.main_goal}
- Preferred Language: {current_user.preferred_language}
- Crops Grown: {current_user.crops_grown}
"""

    prompt = f"""You are an agricultural assistant AI helping farmers with their questions.
Respond directly to the user's query with helpful agricultural information.
Do not mention that you're playing a role or waiting for input.
If the user greets you, respond with a friendly greeting and offer to help with agricultural topics.

{farmer_info}

Conversation history:
{messages_formatted}

current user message:
{message_for_llm}

Respond as the agricultural assistant, taking into account the farmer's specific profile, location, experience level, and crops. Provide personalized advice that considers their farming context."""

    llm_response = llm_service.send_message(prompt)
    llm_text = llm_response.get("response", "")

    chat_session_manager.add_message(req.session_id, sender="llm", message=llm_text)

    # Translate LLM response back if needed
    if needs_translation and llm_text:
        try:
            llm_text = translation_service.translate_from_english(llm_text, user_lang)
        except Exception:
            llm_text = translation_fallback_service.translate_from_english(
                llm_text, user_lang
            )

    # Clean text for TTS to remove formatting characters
    cleaned_text = clean_text_for_tts(llm_text)

    # Convert text to speech
    tts_result = tts_service.text_to_speech(cleaned_text, user_lang)

    return {
        "response": llm_text,
        "audio_base64": tts_result.get("audio_base64"),
        "audio_format": tts_result.get("audio_format"),
        "language": user_lang,
        "tts_success": tts_result.get("success", False),
    }


@router.post("/send-audio-message")
async def send_audio_message(
    session_id: str,
    audio_file: UploadFile = File(...),
    language: Optional[str] = Query(
        None, description="Language code (en, am, no, sw, es, id)"
    ),
    current_user=Depends(get_current_user),
):
    """
    Send audio message and get LLM response
    """
    # Validate file type
    if not audio_file.content_type or not audio_file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be an audio file")

    # Read audio content
    try:
        audio_content = await audio_file.read()
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error reading audio file: {str(e)}"
        )

    # Get chat session
    session = chat_session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Process audio to text with specified language or auto-detect
    if language:
        # Use the specified language for speech recognition
        print(f"🎤 Using specified language: {language}")
        audio_result = audio_service.process_audio_message_with_language(
            audio_content, language
        )
    else:
        # Auto-detect language
        print(f"🎤 Auto-detecting language")
        audio_result = audio_service.process_audio_message(audio_content)

    if not audio_result["success"]:
        raise HTTPException(
            status_code=400,
            detail=f"Audio processing failed: {audio_result.get('error', 'Unknown error')}",
        )

    transcribed_text = audio_result["text"]
    detected_language = audio_result["detected_language"]
    confidence = audio_result["confidence"]

    # If confidence is too low, return error (lowered threshold for farmers)
    if confidence < 0.2:
        raise HTTPException(
            status_code=400,
            detail=f"Audio quality too low (confidence: {confidence:.2f}). Please speak more clearly.",
        )

    # Use the specified language or detected language
    user_lang = language if language else detected_language
    print(f"🎤 Using language: {user_lang}")

    message_for_llm = transcribed_text
    needs_translation = user_lang != "en"

    if needs_translation:
        try:
            message_for_llm = translation_service.translate_to_english(transcribed_text)
        except Exception:
            message_for_llm = translation_fallback_service.translate_to_english(
                transcribed_text
            )

    # Add user message to chat session
    chat_session_manager.add_message(session_id, sender="user", message=message_for_llm)

    # Format conversation history
    messages_formatted = "\n".join(
        [f"{m.sender}: {m.message}" for m in session.messages[-10:]]
    )

    # Get farmer's personalized information
    farmer_info = f"""
Farmer Profile:
- Name: {current_user.name}
- Location: {clean_location_for_display(current_user.location)}
- Experience: {current_user.years_experience} years
- User Type: {current_user.user_type}
- Main Goal: {current_user.main_goal}
- Preferred Language: {current_user.preferred_language}
- Crops Grown: {current_user.crops_grown}
"""

    # Use the same prompt as text messages
    prompt = f"""You are an agricultural assistant AI helping farmers with their questions.
Respond directly to the user's query with helpful agricultural information.
Do not mention that you're playing a role or waiting for input.
If the user greets you, respond with a friendly greeting and offer to help with agricultural topics.

{farmer_info}

Conversation history:
{messages_formatted}

current user message:
{message_for_llm}

Respond as the agricultural assistant, taking into account the farmer's specific profile, location, experience level, and crops. Provide personalized advice that considers their farming context."""

    # Get LLM response
    llm_response = llm_service.send_message(prompt)
    llm_text = llm_response.get("response", "")

    # Add LLM response to chat session
    chat_session_manager.add_message(session_id, sender="llm", message=llm_text)

    # Translate LLM response back if needed
    if needs_translation and llm_text:
        try:
            llm_text = translation_service.translate_from_english(llm_text, user_lang)
        except Exception:
            llm_text = translation_fallback_service.translate_from_english(
                llm_text, user_lang
            )

    return {
        "response": llm_text,
        "transcribed_text": transcribed_text,
        "detected_language": detected_language,
        "confidence": confidence,
        "original_language": user_lang,
    }


@router.post("/voice-conversation")
async def voice_conversation(
    session_id: str,
    audio_file: UploadFile = File(...),
    language: Optional[str] = Query(
        None, description="Language code (en, am, no, sw, es, id)"
    ),
    current_user=Depends(get_current_user),
):
    """
    Real-time voice conversation: Speak to AI and get voice response
    """
    # Validate file type
    if not audio_file.content_type or not audio_file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be an audio file")

    # Read audio content
    try:
        audio_content = await audio_file.read()
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error reading audio file: {str(e)}"
        )

    # Get chat session
    session = chat_session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Process audio to text with specified language or auto-detect
    if language:
        print(f"🎤 Using specified language: {language}")
        audio_result = audio_service.process_audio_message_with_language(
            audio_content, language
        )
    else:
        print(f"🎤 Auto-detecting language")
        audio_result = audio_service.process_audio_message(audio_content)

    if not audio_result["success"]:
        raise HTTPException(
            status_code=400,
            detail=f"Audio processing failed: {audio_result.get('error', 'Unknown error')}",
        )

    transcribed_text = audio_result["text"]
    detected_language = audio_result["detected_language"]
    confidence = audio_result["confidence"]

    # If confidence is too low, return error
    if confidence < 0.2:
        raise HTTPException(
            status_code=400,
            detail=f"Audio quality too low (confidence: {confidence:.2f}). Please speak more clearly.",
        )

    # Use the specified language or detected language
    user_lang = language if language else detected_language
    print(f"🎤 Using language: {user_lang}")

    message_for_llm = transcribed_text
    needs_translation = user_lang != "en"

    if needs_translation:
        try:
            message_for_llm = translation_service.translate_to_english(transcribed_text)
        except Exception:
            message_for_llm = translation_fallback_service.translate_to_english(
                transcribed_text
            )

    # Add user message to chat session
    chat_session_manager.add_message(session_id, sender="user", message=message_for_llm)

    # Format conversation history
    messages_formatted = "\n".join(
        [f"{m.sender}: {m.message}" for m in session.messages[-10:]]
    )

    # Get farmer's personalized information
    farmer_info = f"""
Farmer Profile:
- Name: {current_user.name}
- Location: {clean_location_for_display(current_user.location)}
- Experience: {current_user.years_experience} years
- User Type: {current_user.user_type}
- Main Goal: {current_user.main_goal}
- Preferred Language: {current_user.preferred_language}
- Crops Grown: {current_user.crops_grown}
"""

    # Use the same prompt as text messages
    prompt = f"""You are an agricultural assistant AI helping farmers with their questions.
Respond directly to the user's query with helpful agricultural information.
Do not mention that you're playing a role or waiting for input.
If the user greets you, respond with a friendly greeting and offer to help with agricultural topics.

{farmer_info}

Conversation history:
{messages_formatted}

current user message:
{message_for_llm}

Respond as the agricultural assistant, taking into account the farmer's specific profile, location, experience level, and crops. Provide personalized advice that considers their farming context."""

    # Get LLM response
    llm_response = llm_service.send_message(prompt)
    llm_text = llm_response.get("response", "")

    # Add LLM response to chat session
    chat_session_manager.add_message(session_id, sender="llm", message=llm_text)

    # Translate LLM response back if needed
    if needs_translation and llm_text:
        try:
            llm_text = translation_service.translate_from_english(llm_text, user_lang)
        except Exception:
            llm_text = translation_fallback_service.translate_from_english(
                llm_text, user_lang
            )

    # Clean text for TTS to remove formatting characters
    cleaned_text = clean_text_for_tts(llm_text)

    # Convert AI response to speech
    print(f"🔊 Converting text to speech for language: {user_lang}")
    print(f"🔊 Text to convert: {cleaned_text[:100]}...")

    tts_result = tts_service.text_to_speech(cleaned_text, user_lang)

    print(f"🔊 TTS result: {tts_result}")

    return {
        "response": llm_text,
        "transcribed_text": transcribed_text,
        "detected_language": detected_language,
        "confidence": confidence,
        "original_language": user_lang,
        "audio_base64": tts_result.get("audio_base64"),
        "audio_format": tts_result.get("audio_format"),
        "tts_success": tts_result.get("success", False),
    }


@router.get("/history")
def get_history(session_id: str = Query(...), current_user=Depends(get_current_user)):
    history = chat_session_manager.get_history(session_id)
    if history is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"messages": [m.dict() for m in history]}
