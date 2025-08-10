import os
import base64
import json
import tempfile
import logging
from typing import Optional, Dict, Any
from google.cloud import speech_v1
from pathlib import Path
from dotenv import load_dotenv
from src.services.transalation_service import (
    translation_service,
    translation_fallback_service,
)

load_dotenv()
logger = logging.getLogger(__name__)


class AudioService:
    def __init__(self):
        self.speech_client = None
        self.key_file_path = None
        self._initialize_client()

    def _initialize_client(self):
        """Initialize Google Cloud Speech client with proper error handling"""
        try:
            # First try environment variable (for Railway deployment)
            key_b64 = os.getenv("GCP_CREDENTIALS_B64")

            if key_b64:
                # Decode base64 credentials
                try:
                    key_json = base64.b64decode(key_b64).decode("utf-8")
                    # Validate JSON
                    json.loads(key_json)

                    # Create temporary file with proper encoding
                    temp_file = tempfile.NamedTemporaryFile(
                        delete=False, suffix=".json", mode="w", encoding="utf-8"
                    )
                    temp_file.write(key_json)
                    temp_file.close()
                    self.key_file_path = temp_file.name
                    logger.info(
                        "Using credentials from GCP_CREDENTIALS_B64 environment variable"
                    )

                    # Initialize Google Cloud client
                    try:
                        self.speech_client = (
                            speech_v1.SpeechClient.from_service_account_json(
                                self.key_file_path
                            )
                        )
                        logger.info(
                            "Google Cloud Speech client initialized successfully"
                        )
                        return
                    except Exception as e:
                        logger.error(
                            f"Failed to initialize Google Cloud Speech client: {e}"
                        )
                        self.speech_client = None

                except Exception as e:
                    logger.error(f"Failed to decode base64 credentials: {e}")

            # If environment variable fails, try local file (for development)
            key_path = os.path.join(os.path.dirname(__file__), "../../", "gcp_key.json")
            key_path = os.path.abspath(key_path)

            if os.path.exists(key_path):
                try:
                    # Validate JSON
                    with open(key_path, "r", encoding="utf-8") as f:
                        json.load(f)
                    self.key_file_path = key_path
                    logger.info(f"Using credentials from local file: {key_path}")

                    # Initialize Google Cloud client
                    try:
                        self.speech_client = (
                            speech_v1.SpeechClient.from_service_account_json(
                                self.key_file_path
                            )
                        )
                        logger.info(
                            "Google Cloud Speech client initialized successfully"
                        )
                        return
                    except Exception as e:
                        logger.error(
                            f"Failed to initialize Google Cloud Speech client: {e}"
                        )
                        self.speech_client = None

                except Exception as e:
                    logger.error(f"Error reading local credentials file: {e}")

            # If both fail, log warning
            logger.warning(
                "No valid Google Cloud credentials found. Speech-to-text will not work."
            )
            return


        except Exception as e:
            logger.error(
                f"Unexpected error during Google Cloud Speech initialization: {e}"
            )
            self.speech_client = None

    def __del__(self):
        """Clean up temporary file on object destruction"""
        if self.key_file_path and os.path.exists(self.key_file_path):
            # Only delete if it's a temporary file (not a local credential file)
            if self.key_file_path.startswith(tempfile.gettempdir()):
                try:
                    os.unlink(self.key_file_path)
                except Exception as e:
                    logger.warning(
                        f"Failed to clean up temporary credentials file: {e}"
                    )

    def detect_audio_language(self, audio_content: bytes) -> str:
        """
        Detect the language of audio content
        """
        try:
            if not self.speech_client:
                logger.warning("Speech client not initialized, defaulting to English")
                return "en"

            sample_text = self._extract_sample_text(audio_content)
            if sample_text:
                print(f"📝 Sample text for language detection: '{sample_text}'")
                try:
                    detected_lang = translation_service.detect_language(sample_text)
                    print(f"🌍 Translation service detected: {detected_lang}")
                except Exception:
                    detected_lang = translation_fallback_service.detect_language(
                        sample_text
                    )
                    print(f"🌍 Fallback service detected: {detected_lang}")
                return detected_lang
            else:
                print("⚠️  No sample text extracted, defaulting to English")
                return "en"  # Default to English if detection fails
        except Exception as e:
            print(f"Error detecting audio language: {e}")
            return "en"

    def _extract_sample_text(self, audio_content: bytes) -> Optional[str]:
        """
        Extract a small sample of text from audio for language detection
        """
        try:
            if not self.speech_client:
                return None

            # Create audio object
            audio = speech_v1.RecognitionAudio(content=audio_content)

            # Configure recognition for a short sample
            config = speech_v1.RecognitionConfig(
                encoding=speech_v1.RecognitionConfig.AudioEncoding.WEBM_OPUS,
                sample_rate_hertz=48000,  # WebM OPUS typically uses 48kHz
                language_code="en-US",  # Start with English
                max_alternatives=1,
                enable_automatic_punctuation=True,
            )

            response = self.speech_client.recognize(config=config, audio=audio)

            if response.results:
                return response.results[0].alternatives[0].transcript
            return None
        except Exception as e:
            print(f"Error extracting sample text: {e}")
            return None

    def speech_to_text(
        self, audio_content: bytes, language_code: str = "en-US"
    ) -> Dict[str, Any]:
        """
        Convert speech to text using Google Cloud Speech-to-Text
        Args:
            audio_content: Raw audio bytes
            language_code: Language code (e.g., "en-US", "hi-IN", "pa-IN")
        Returns:
            Dict with transcribed text and confidence score
        """
        try:
            if not self.speech_client:
                return {
                    "success": False,
                    "error": "Speech client not initialized",
                    "text": "",
                    "confidence": 0.0,
                }

            # Create audio object
            audio = speech_v1.RecognitionAudio(content=audio_content)


            # Configure recognition for WebM/OPUS format
            config = speech_v1.RecognitionConfig(
                encoding=speech_v1.RecognitionConfig.AudioEncoding.WEBM_OPUS,
                sample_rate_hertz=48000,  # WebM OPUS typically uses 48kHz
                language_code=language_code,
                max_alternatives=1,
                enable_automatic_punctuation=True,
                enable_word_time_offsets=False,
                enable_word_confidence=True,
            )

            # Perform recognition
            response = self.speech_client.recognize(config=config, audio=audio)

            if not response.results:
                return {
                    "success": False,
                    "error": "No speech detected",
                    "text": "",
                    "confidence": 0.0,
                }

            # Get the best result
            result = response.results[0]
            is_final = getattr(
                result, "is_final", True
            )  # Default to True if field doesn't exist

            if is_final:
                transcript = result.alternatives[0].transcript
                confidence = result.alternatives[0].confidence

                return {
                    "success": True,
                    "text": transcript,
                    "confidence": confidence,
                    "language_code": language_code,
                }
            else:
                return {
                    "success": False,
                    "error": "Speech recognition not final",
                    "text": "",
                    "confidence": 0.0,
                }

        except Exception as e:
            print(f"Error in speech_to_text: {e}")
            return {"success": False, "error": str(e), "text": "", "confidence": 0.0}

    def process_audio_message(self, audio_content: bytes) -> Dict[str, Any]:
        """
        Process audio message: detect language and convert to text
        Args:
            audio_content: Raw audio bytes
        Returns:
            Dict with transcribed text, detected language, and confidence
        """
        try:
            # First, try to detect language from a small sample
            detected_lang = self.detect_audio_language(audio_content)
            print(f"🌍 Detected language: {detected_lang}")

            # Map detected language to Speech API language codes
            lang_mapping = {
                "en": "en-US",  # English
                "am": "am-ET",  # Amharic
                "no": "no-NO",  # Norwegian
                "sw": "sw-KE",  # Swahili
                "es": "es-ES",  # Spanish
                "id": "id-ID",  # Indonesian
            }

            speech_lang_code = lang_mapping.get(detected_lang, "en-US")
            print(f"🎤 Using speech language code: {speech_lang_code}")

            # Try WebM OPUS format with detected language
            result = self._try_speech_recognition(
                audio_content, "webm_opus", speech_lang_code
            )

            if not result["success"]:
                # Fallback to LINEAR16 format with detected language
                result = self._try_speech_recognition(
                    audio_content, "linear16", speech_lang_code
                )

            if not result["success"]:
                # Final fallback to FLAC format with detected language
                result = self._try_speech_recognition(
                    audio_content, "flac", speech_lang_code
                )

            # Add detected language to result
            result["detected_language"] = detected_lang

            return result

        except Exception as e:
            print(f"Error processing audio message: {e}")
            return {
                "success": False,
                "error": str(e),
                "text": "",
                "confidence": 0.0,
                "detected_language": "en",
            }


    def process_audio_message_with_language(
        self, audio_content: bytes, language: str
    ) -> Dict[str, Any]:
        """
        Process audio message with specified language
        Args:
            audio_content: Raw audio bytes
            language: Language code (en, am, no, sw, es, id)
        Returns:
            Dict with transcribed text, detected language, and confidence
        """
        try:
            # Map language code to Speech API language codes
            lang_mapping = {
                "en": "en-US",  # English
                "am": "am-ET",  # Amharic
                "no": "no-NO",  # Norwegian
                "sw": "sw-KE",  # Swahili
                "es": "es-ES",  # Spanish
                "id": "id-ID",  # Indonesian
            }

            speech_lang_code = lang_mapping.get(language, "en-US")
            print(f"🎤 Using specified language code: {speech_lang_code}")

            # Try WebM OPUS format with specified language
            result = self._try_speech_recognition(
                audio_content, "webm_opus", speech_lang_code
            )

            if not result["success"]:
                # Fallback to LINEAR16 format with specified language
                result = self._try_speech_recognition(
                    audio_content, "linear16", speech_lang_code
                )

            if not result["success"]:
                # Final fallback to FLAC format with specified language
                result = self._try_speech_recognition(
                    audio_content, "flac", speech_lang_code
                )

            # Add specified language to result
            result["detected_language"] = language

            return result

        except Exception as e:
            print(f"Error processing audio message with language: {e}")
            return {
                "success": False,
                "error": str(e),
                "text": "",
                "confidence": 0.0,
                "detected_language": language,
            }

    def _try_speech_recognition(
        self, audio_content: bytes, format_type: str, language_code: str = "en-US"
    ) -> Dict[str, Any]:
        """
        Try speech recognition with different audio formats
        """
        try:
            if not self.speech_client:
                return {
                    "success": False,
                    "error": "Speech client not initialized",
                    "text": "",
                    "confidence": 0.0,
                }

            # Create audio object
            audio = speech_v1.RecognitionAudio(content=audio_content)

            print(f"🔍 Trying format: {format_type} with language: {language_code}")


            # Configure based on format type
            if format_type == "webm_opus":
                config = speech_v1.RecognitionConfig(
                    encoding=speech_v1.RecognitionConfig.AudioEncoding.WEBM_OPUS,
                    sample_rate_hertz=48000,
                    language_code=language_code,
                    max_alternatives=1,
                    enable_automatic_punctuation=True,
                    enable_word_time_offsets=False,
                    enable_word_confidence=True,
                )
            elif format_type == "linear16":
                config = speech_v1.RecognitionConfig(
                    encoding=speech_v1.RecognitionConfig.AudioEncoding.LINEAR16,
                    sample_rate_hertz=16000,
                    language_code=language_code,
                    max_alternatives=1,
                    enable_automatic_punctuation=True,
                    enable_word_time_offsets=False,
                    enable_word_confidence=True,
                )
            elif format_type == "flac":
                config = speech_v1.RecognitionConfig(
                    encoding=speech_v1.RecognitionConfig.AudioEncoding.FLAC,
                    sample_rate_hertz=16000,
                    language_code=language_code,
                    max_alternatives=1,
                    enable_automatic_punctuation=True,
                    enable_word_time_offsets=False,
                    enable_word_confidence=True,
                )
            else:
                return {"success": False, "error": f"Unsupported format: {format_type}"}

            # Perform recognition
            response = self.speech_client.recognize(config=config, audio=audio)

            if not response.results:
                return {
                    "success": False,
                    "error": "No speech detected",
                    "text": "",
                    "confidence": 0.0,
                }

            # Get the best result
            result = response.results[0]
            is_final = getattr(result, "is_final", True)

            if is_final:
                transcript = result.alternatives[0].transcript
                confidence = result.alternatives[0].confidence

                print(f"✅ Success with format: {format_type}")
                print(f"📝 Transcript: {transcript}")
                print(f"📈 Confidence: {confidence}")

                return {
                    "success": True,
                    "text": transcript,
                    "confidence": confidence,
                    "format_used": format_type,
                }
            else:
                return {
                    "success": False,
                    "error": "Speech recognition not final",
                    "text": "",
                    "confidence": 0.0,
                }

        except Exception as e:
            print(f"❌ Format {format_type} failed: {str(e)}")
            return {
                "success": False,
                "error": f"Format {format_type} failed: {str(e)}",
                "text": "",
                "confidence": 0.0,
            }

    def _detect_language_from_text(self, text: str) -> str:
        """
        Detect language from transcribed text using translation service
        """
        try:
            # Use existing translation service for language detection
            try:
                detected_lang = translation_service.detect_language(text)
            except Exception:
                # Fallback to fallback service if main service fails
                detected_lang = translation_fallback_service.detect_language(text)

            # Map detected language to Speech API language codes
            lang_mapping = {
                "en": "en-US",  # English
                "am": "am-ET",  # Amharic
                "no": "no-NO",  # Norwegian
                "sw": "sw-KE",  # Swahili
                "es": "es-ES",  # Spanish
                "id": "id-ID",  # Indonesian
            }

            return lang_mapping.get(detected_lang, "en-US")


        except Exception as e:
            print(f"Error detecting language from text: {e}")
            return "en-US"


# Initialize audio service with fallback handling
try:
    audio_service = AudioService()
except Exception as e:
    logger.error(f"Failed to initialize Audio service: {e}")
    audio_service = None
