from google.cloud import translate_v2 as translate
from deep_translator import GoogleTranslator, single_detection
from dotenv import load_dotenv
import os
import json
import base64
import tempfile
import logging

load_dotenv()
logger = logging.getLogger(__name__)


class TranslationServiceFallBack:
    def __init__(self):
        pass

    def detect_language(self, text: str) -> str:
        return single_detection(text, api_key=os.getenv("DETECT_LANGUAGE_API"))

    def translate_to_english(self, text: str) -> str:
        return GoogleTranslator(source="auto", target="en").translate(text)

    def translate_from_english(self, text: str, dest_lang: str) -> str:
        return GoogleTranslator(source="en", target=dest_lang).translate(text)


translation_fallback_service = TranslationServiceFallBack()


class GoogleCloudTranslate:
    def __init__(self):
        self.translate_client = None
        self.key_file_path = None
        self._initialize_client()

    def _initialize_client(self):
        """Initialize Google Cloud Translate client with proper error handling"""
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
                        self.translate_client = (
                            translate.Client.from_service_account_json(
                                self.key_file_path
                            )
                        )
                        logger.info(
                            "Google Cloud Translate client initialized successfully"
                        )
                        return
                    except Exception as e:
                        logger.error(
                            f"Failed to initialize Google Cloud Translate client: {e}"
                        )
                        self.translate_client = None

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
                        self.translate_client = (
                            translate.Client.from_service_account_json(
                                self.key_file_path
                            )
                        )
                        logger.info(
                            "Google Cloud Translate client initialized successfully"
                        )
                        return
                    except Exception as e:
                        logger.error(
                            f"Failed to initialize Google Cloud Translate client: {e}"
                        )
                        self.translate_client = None

                except Exception as e:
                    logger.error(f"Error reading local credentials file: {e}")

            # If both fail, use fallback
            logger.warning(
                "No valid Google Cloud credentials found. Using fallback translation service."
            )
            return

        except Exception as e:
            logger.error(
                f"Unexpected error during Google Cloud Translate initialization: {e}"
            )
            self.translate_client = None

    def detect_language(self, text: str) -> str:
        if self.translate_client:
            try:
                result = self.translate_client.detect_language(text)
                return result["language"]
            except Exception as e:
                logger.error(f"Google Cloud language detection failed: {e}")
                return translation_fallback_service.detect_language(text)
        else:
            return translation_fallback_service.detect_language(text)

    def translate_to_english(self, text: str) -> str:
        if self.translate_client:
            try:
                result = self.translate_client.translate(text, target_language="en")
                return result["translatedText"]
            except Exception as e:
                logger.error(f"Google Cloud translation to English failed: {e}")
                return translation_fallback_service.translate_to_english(text)
        else:
            return translation_fallback_service.translate_to_english(text)

    def translate_from_english(self, text: str, dest_lang: str) -> str:
        if self.translate_client:
            try:
                result = self.translate_client.translate(
                    text, source_language="en", target_language=dest_lang
                )
                return result["translatedText"]
            except Exception as e:
                logger.error(f"Google Cloud translation from English failed: {e}")
                return translation_fallback_service.translate_from_english(
                    text, dest_lang
                )
        else:
            return translation_fallback_service.translate_from_english(text, dest_lang)

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


# Initialize translation service with fallback handling
try:
    translation_service = GoogleCloudTranslate()
except Exception as e:
    logger.error(f"Failed to initialize Google Cloud Translate service: {e}")
    translation_service = translation_fallback_service
