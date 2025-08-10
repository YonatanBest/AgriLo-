import os
import base64
import json
import tempfile
import logging
from typing import Dict, Any, Optional
from google.cloud import texttospeech
from google.cloud.texttospeech import SynthesisInput, VoiceSelectionParams, AudioConfig
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)


class TTSService:
    def __init__(self):
        self.client = None
        self.key_file_path = None
        self._initialize_client()

        # Language to voice mapping
        self.voice_mapping = {
            "en": {
                "language_code": "en-US",
                "voice_name": "en-US-Neural2-F",  # Female voice
                "speaking_rate": 0.9,
            },
            "am": {
                "language_code": "am-ET",
                "voice_name": "am-ET-Standard-A",  # Amharic voice
                "speaking_rate": 1,
            },
            "no": {
                "language_code": "no-NO",
                "voice_name": "no-NO-Standard-A",  # Norwegian voice
                "speaking_rate": 1,
            },
            "sw": {
                "language_code": "sw-KE",
                "voice_name": "sw-KE-Standard-A",  # Swahili voice
                "speaking_rate": 1,
            },
            "es": {
                "language_code": "es-ES",
                "voice_name": "es-ES-Neural2-A",  # Spanish voice
                "speaking_rate": 1,
            },
            "id": {
                "language_code": "id-ID",
                "voice_name": "id-ID-Standard-A",  # Indonesian voice
                "speaking_rate": 1,
            },
        }

    def _initialize_client(self):
        """Initialize Google Cloud Text-to-Speech client with proper error handling"""
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
                        self.client = (
                            texttospeech.TextToSpeechClient.from_service_account_json(
                                self.key_file_path
                            )
                        )
                        logger.info(
                            "Google Cloud Text-to-Speech client initialized successfully"
                        )
                        return
                    except Exception as e:
                        logger.error(
                            f"Failed to initialize Google Cloud TTS client: {e}"
                        )
                        self.client = None

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
                        self.client = (
                            texttospeech.TextToSpeechClient.from_service_account_json(
                                self.key_file_path
                            )
                        )
                        logger.info(
                            "Google Cloud Text-to-Speech client initialized successfully"
                        )
                        return
                    except Exception as e:
                        logger.error(
                            f"Failed to initialize Google Cloud TTS client: {e}"
                        )
                        self.client = None

                except Exception as e:
                    logger.error(f"Error reading local credentials file: {e}")

            # If both fail, log warning
            logger.warning(
                "No valid Google Cloud credentials found. Text-to-speech will not work."
            )
            return

        except Exception as e:
            logger.error(
                f"Unexpected error during Google Cloud TTS initialization: {e}"
            )
            self.client = None

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

    def text_to_speech(self, text: str, language: str = "en") -> Dict[str, Any]:
        """
        Convert text to speech audio

        Args:
            text: Text to convert to speech
            language: Language code (en, am, no, sw, es, id)

        Returns:
            Dict containing audio data and metadata
        """
        try:
            if not self.client:
                return {
                    "success": False,
                    "error": "TTS client not initialized",
                    "language": language,
                }

            # Get voice configuration for the language
            voice_config = self.voice_mapping.get(language, self.voice_mapping["en"])

            # Create synthesis input
            synthesis_input = SynthesisInput(text=text)

            # Configure voice
            voice = VoiceSelectionParams(
                language_code=voice_config["language_code"],
                name=voice_config["voice_name"],
            )

            # Configure audio
            audio_config = AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3,
                speaking_rate=voice_config["speaking_rate"],
                pitch=0.0,
                volume_gain_db=0.0,
            )

            # Perform text-to-speech request
            response = self.client.synthesize_speech(
                input=synthesis_input, voice=voice, audio_config=audio_config
            )

            # Convert audio content to base64 for easy transmission
            audio_base64 = base64.b64encode(response.audio_content).decode("utf-8")

            return {
                "success": True,
                "audio_base64": audio_base64,
                "audio_format": "mp3",
                "language": language,
                "text_length": len(text),
                "duration_estimate": len(text.split()) * 0.5,  # Rough estimate
            }

        except Exception as e:
            print(f"❌ TTS Error: {str(e)}")
            return {"success": False, "error": str(e), "language": language}

    def get_available_voices(self, language_code: str = None) -> Dict[str, Any]:
        """
        Get available voices for a language

        Args:
            language_code: Optional language code to filter voices


        Returns:
            Dict containing available voices
        """
        try:
            if not self.client:
                return {
                    "success": False,
                    "error": "TTS client not initialized",
                }

            if language_code:
                voices = self.client.list_voices(language_code=language_code)
            else:
                voices = self.client.list_voices()

            return {
                "success": True,
                "voices": [
                    {
                        "name": voice.name,
                        "language_code": voice.language_codes[0],
                        "ssml_gender": voice.ssml_gender.name,
                    }
                    for voice in voices.voices
                ],
            }

        except Exception as e:
            print(f"❌ Error getting voices: {str(e)}")
            return {"success": False, "error": str(e)}


# Initialize TTS service with fallback handling
try:
    tts_service = TTSService()
except Exception as e:
    logger.error(f"Failed to initialize TTS service: {e}")
    tts_service = None
