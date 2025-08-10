// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types for API responses
export interface User {
  user_id: string;
  name: string;
  email: string;
  location: string;
  preferred_language: string;
  crops_grown: string[];
  user_type: string;
  years_experience: number;
  main_goal: string;
  created_at: string;
  updated_at: string;
}



export interface ChatMessage {
  id: string;
  sender: 'user' | 'llm';
  message: string;
  timestamp: string;
}

export interface ChatSession {
  session_id: string;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  wind_speed: number;
  description: string;
}

export interface SoilData {
  soil_type?: string;
  texture_class?: string;
  ph?: number;
  nitrogen_total_g_per_kg?: number;
  phosphorous_extractable_ppm?: number;
  potassium_extractable_ppm?: number;
  magnesium_extractable_ppm?: number;
  calcium_extractable_ppm?: number;
  iron_extractable_ppm?: number;
  zinc_extractable_ppm?: number;
  sulphur_extractable_ppm?: number;
  carbon_total_g_per_kg?: number;
  carbon_organic_g_per_kg?: number;
  bulk_density_g_per_cm3?: number;
  stone_content_percent?: number;
  silt_content_percent?: number;
  clay_content_percent?: number;
  sand_content_percent?: number;
  cation_exchange_capacity_cmol_per_kg?: number;
  aluminium_extractable_ppm?: number;
}

export interface CropRecommendation {
  crop_name: string;
  confidence: number;
  reasoning: string;
  planting_season: string;
  water_requirements: string;
}

export interface SoilSummary {
  soil_type: string;
  texture_class: string;
  ph: number;
  nitrogen_total_g_per_kg: number;
  phosphorous_extractable_ppm: number;
  potassium_extractable_ppm: number;
  magnesium_extractable_ppm: number;
  calcium_extractable_ppm: number;
  iron_extractable_ppm: number;
  zinc_extractable_ppm: number;
  sulphur_extractable_ppm: number;
  carbon_total_g_per_kg: number;
  carbon_organic_g_per_kg: number;
  bulk_density_g_per_cm3: number;
  stone_content_percent: number;
  silt_content_percent: number;
  clay_content_percent: number;
  sand_content_percent: number;
  cation_exchange_capacity_cmol_per_kg: number;
  aluminium_extractable_ppm: number;
}

export interface WeatherSummary {
  period_start: string;
  period_end: string;
  avg_temperature_max: number;
  avg_temperature_min: number;
  min_temperature: number;
  max_temperature: number;
  total_rainfall_mm: number;
  avg_sunshine_hours: number;
  avg_wind_speed_kph: number;
  avg_evapotranspiration: number;
}

export interface CropRecommendationResponse {
  status: string;
  recommendation: string;
  soil_summary: SoilSummary;
  weather_summary: WeatherSummary;
}

export interface FertilizerRecommendationResponse {
  status: string;
  recommendation: string;
  soil_summary: SoilSummary;
  weather_summary: WeatherSummary;
  deficiency_notes: string[];
  rotation_note: string;
  growth_stage_note: string;
}

// API Service Class
class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/api/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.token = response.access_token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.access_token);
    }
    
    return response;
  }



  async completeRegistration(userData: any): Promise<{ user: User; access_token: string; token_type: string }> {
    const response = await this.request<{ user: User; access_token: string; token_type: string }>('/api/user/complete-registration', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Set the token automatically after successful registration
    this.token = response.access_token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.access_token);
    }
    
    return response;
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    return await this.request<User>(`/api/user/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<User> {
    return await this.request<User>('/api/user/me');
  }

  logout(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Chat methods
  async startChatSession(userId?: string): Promise<ChatSession> {
    return await this.request<ChatSession>('/api/chat/start-session', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  async sendChatMessage(sessionId: string, message: string, preferredLanguage?: string): Promise<{ response: string }> {
    // Prefer the current UI language from session storage if not provided
    let lang = preferredLanguage;
    if (!lang && typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('agrilo_preferred_language');
      if (saved) lang = saved;
    }
    let url = `/api/chat/send-message?session_id=${sessionId}`;
    if (lang) {
      url += `&preferred_language=${encodeURIComponent(lang)}`;
    }
    
    return await this.request<{ response: string }>(url, {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, message }),
    });
  }

  async sendVoiceMessage(sessionId: string, message: string, preferredLanguage?: string): Promise<{ 
    response: string; 
    audio_base64?: string; 
    audio_format?: string; 
    language: string; 
    tts_success: boolean; 
  }> {
    // Prefer the current UI language from session storage if not provided
    let lang = preferredLanguage;
    if (!lang && typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('agrilo_preferred_language');
      if (saved) lang = saved;
    }
    let url = `/api/chat/send-voice-message?session_id=${sessionId}`;
    if (lang) {
      url += `&preferred_language=${encodeURIComponent(lang)}`;
    }
    
    return await this.request<{ 
      response: string; 
      audio_base64?: string; 
      audio_format?: string; 
      language: string; 
      tts_success: boolean; 
    }>(url, {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, message }),
    });
  }

  async sendAudioMessage(sessionId: string, audioFile: File, language?: string): Promise<{
    response: string;
    transcribed_text: string;
    detected_language: string;
    confidence: number;
    original_language: string;
  }> {
    const formData = new FormData();
    formData.append('audio_file', audioFile);
    
    // Prefer the current UI language from session storage if not provided
    let lang = language;
    if (!lang && typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('agrilo_preferred_language');
      if (saved) lang = saved;
    }
    let url = `${this.baseUrl}/api/chat/send-audio-message?session_id=${sessionId}`;
    if (lang) {
      url += `&language=${encodeURIComponent(lang)}`;
    }
    
    const headers: Record<string, string> = {};
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async sendImageMessage(
    sessionId: string,
    imageFile: File,
    preferredLanguage?: string
  ): Promise<{
    action?: string;
    response: string;
    structured_insight?: any;
    similar_images?: any;
  }> {
    const formData = new FormData();
    formData.append('image', imageFile);
    // Backend expects these exact field names for multipart form
    formData.append('session_id_form', sessionId);
    // message_form is optional; omit or send empty

    // Prefer the current UI language from session storage if not provided
    let lang = preferredLanguage;
    if (!lang && typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('agrilo_preferred_language');
      if (saved) lang = saved;
    }
    let url = `${this.baseUrl}/api/chat/send-message`;
    if (lang) {
      url += `?preferred_language=${encodeURIComponent(lang)}`;
    }

    const headers: Record<string, string> = {};
    if (this.token) { headers.Authorization = `Bearer ${this.token}`; }

    const resp = await fetch(url, { method: 'POST', headers, body: formData });
    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      throw new Error(`HTTP ${resp.status}: ${text}`);
    }
    return await resp.json();
  }

  async voiceConversation(sessionId: string, audioFile: File, language?: string): Promise<{
    response: string;
    transcribed_text: string;
    detected_language: string;
    confidence: number;
    original_language: string;
    audio_base64?: string;
    audio_format?: string;
    tts_success: boolean;
  }> {
    const formData = new FormData();
    formData.append('audio_file', audioFile);
    
    // Prefer the current UI language from session storage if not provided
    let lang = language;
    if (!lang && typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('agrilo_preferred_language');
      if (saved) lang = saved;
    }
    let url = `${this.baseUrl}/api/chat/voice-conversation?session_id=${sessionId}`;
    if (lang) {
      url += `&language=${encodeURIComponent(lang)}`;
    }
    
    const headers: Record<string, string> = {};
    if (this.token) { headers.Authorization = `Bearer ${this.token}`; }
    const response = await fetch(url, { method: 'POST', headers, body: formData });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    return await response.json();
  }

  // Streaming voice conversation using SSE
  async voiceConversationStream(
    sessionId: string,
    audioFile: File,
    language: string | undefined,
    handlers: {
      onDetectedLanguage?: (data: { detected_language: string; confidence: number; original_language: string; transcribed_text: string }) => void;
      onResponseText?: (data: { response: string }) => void;
      onAudio?: (data: { audio_base64?: string; audio_format?: string; language?: string; tts_success?: boolean }) => void;
      onDone?: () => void;
      onError?: (error: any) => void;
    }
  ): Promise<void> {
    const formData = new FormData();
    formData.append('audio_file', audioFile);

    // Prefer the current UI language from session storage if not provided
    let lang = language;
    if (!lang && typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('agrilo_preferred_language');
      if (saved) lang = saved;
    }
    let url = `${this.baseUrl}/api/chat/voice-conversation?session_id=${sessionId}&stream=true`;
    if (lang) { url += `&language=${encodeURIComponent(lang)}`; }

    const headers: Record<string, string> = {};
    if (this.token) { headers.Authorization = `Bearer ${this.token}`; }

    try {
      const response = await fetch(url, { method: 'POST', headers, body: formData });
      if (!response.ok || !response.body) {
        const text = await response.text().catch(() => '');
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Parse SSE blocks separated by double newlines
        let sepIndex;
        while ((sepIndex = buffer.indexOf('\n\n')) !== -1) {
          const block = buffer.slice(0, sepIndex);
          buffer = buffer.slice(sepIndex + 2);

          const lines = block.split('\n');
          const eventLine = lines.find(l => l.startsWith('event:')) || '';
          const dataLine = lines.find(l => l.startsWith('data:')) || '';
          const event = eventLine.replace('event:', '').trim();
          const dataRaw = dataLine.replace('data:', '').trim();

          let data: any = {};
          try { data = dataRaw ? JSON.parse(dataRaw) : {}; } catch {}

          if (event === 'detected_language' && handlers.onDetectedLanguage) handlers.onDetectedLanguage(data);
          else if (event === 'response_text' && handlers.onResponseText) handlers.onResponseText(data);
          else if (event === 'audio' && handlers.onAudio) handlers.onAudio(data);
          else if (event === 'done' && handlers.onDone) handlers.onDone();
          else if (event === 'error' && handlers.onError) handlers.onError(data);
        }
      }
    } catch (err) {
      if (handlers.onError) handlers.onError(err);
      else throw err;
    }
  }

  async getChatHistory(sessionId: string): Promise<{ messages: ChatMessage[] }> {
    return await this.request<{ messages: ChatMessage[] }>(`/api/chat/history?session_id=${sessionId}`);
  }

  // Weather methods
  async getWeatherForecast(latitude: number, longitude: number): Promise<WeatherData> {
    return await this.request<WeatherData>(`/api/weather/forecast?lat=${latitude}&lon=${longitude}`);
  }

  // Soil methods
  async getSoilData(latitude: number, longitude: number): Promise<SoilData> {
    return await this.request<SoilData>(`/api/soil/summary?lat=${latitude}&lon=${longitude}`);
  }

  // Crop recommendation methods
  async getCropRecommendations(
    soilData: SoilData,
    weatherData: WeatherData,
    location: string
  ): Promise<CropRecommendation[]> {
    return await this.request<CropRecommendation[]>('/api/recommend/crops', {
      method: 'POST',
      body: JSON.stringify({
        soil_data: soilData,
        weather_data: weatherData,
        location,
      }),
    });
  }

  async recommendCrops(
    lat: number,
    lon: number,
    depth: string = "0-20",
    topK: number = 5,
    pastDays: number = 30,
    forecastDays: number = 16
  ): Promise<CropRecommendationResponse> {
    return await this.request<CropRecommendationResponse>(
      `/api/recommend/crops?lat=${lat}&lon=${lon}&depth=${depth}&top_k=${topK}&past_days=${pastDays}&forecast_days=${forecastDays}`
    );
  }

  async recommendFertilizer(
    lat: number,
    lon: number,
    targetCrop: string,
    depth: string = "0-20",
    topK: number = 5,
    pastDays: number = 30,
    forecastDays: number = 0
  ): Promise<FertilizerRecommendationResponse> {
    return await this.request<FertilizerRecommendationResponse>(
      `/api/recommend/fertilizer?lat=${lat}&lon=${lon}&target_crop=${targetCrop}&depth=${depth}&top_k=${topK}&past_days=${pastDays}&forecast_days=${forecastDays}`
    );
  }

  // Crop health methods
  async analyzeCropHealth(imageFile: File): Promise<{
    insight: string;
    raw_results: {
      kindwise: {
        is_plant: boolean;
        diseases: Array<{
          name: string;
          probability: number;
          scientific_name: string;
          similar_images: Array<{
            url: string;
            citation: string;
          }>;
        }>;
        crops: Array<{
          name: string;
          probability: number;
          scientific_name: string;
          similar_images: Array<{
            url: string;
            citation: string;
          }>;
        }>;
      };
      openepi: {
        healthy: number;
        not_healthy: number;
      };
      deepl: {
        crops: any[];
        diagnoses_detected: boolean;
        image_feedback: any;
        diagnoses: any[];
      };
    };
  }> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const headers: Record<string, string> = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    const response = await fetch(`${this.baseUrl}/api/crop-health/diagnose`, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    return await response.json();
  }

  // Fertilizer agent methods
  async getFertilizerRecommendation(
    cropType: string,
    soilData: SoilData,
    currentStage: string
  ): Promise<{
    fertilizer_type: string;
    application_rate: string;
    timing: string;
    notes: string[];
  }> {
    return await this.request<{
      fertilizer_type: string;
      application_rate: string;
      timing: string;
      notes: string[];
    }>('/api/fertilizer-agent/recommend', {
      method: 'POST',
      body: JSON.stringify({
        crop_type: cropType,
        soil_data: soilData,
        current_stage: currentStage,
      }),
    });
  }

  async getGoogleMapsApiKey(): Promise<{ api_key: string }> {
    return await this.request<{ api_key: string }>('/api/maps/api-key');
  }

  async getGoogleMapsEmbedUrl(lat: number, lon: number, zoom: number = 18, maptype: string = "satellite"): Promise<{ embed_url: string }> {
    return await this.request<{ embed_url: string }>(`/api/maps/embed?lat=${lat}&lon=${lon}&zoom=${zoom}&maptype=${maptype}`);
  }

  async getDetailedMapView(lat: number, lon: number, viewType: string = "satellite"): Promise<{ embed_url: string }> {
    return await this.request<{ embed_url: string }>(`/api/maps/detailed-view?lat=${lat}&lon=${lon}&view_type=${viewType}`);
  }

  // Calendar Weather API
  async getCalendarWeather(lat: number, lon: number, days: number = 31): Promise<any> {
    return await this.request<any>(`/api/weather/calendar?lat=${lat}&lon=${lon}&days=${days}`);
  }

  // AI Task Recommendations API
  async getAITaskRecommendations(lat: number, lon: number, date: string): Promise<any> {
    return await this.request<any>(`/api/weather/ai-tasks?lat=${lat}&lon=${lon}&date=${date}`);
  }
}

// Create and export the API service instance
export const apiService = new ApiService(API_BASE_URL);

// Utility functions for common API operations
export const apiUtils = {
  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  },

  // Get stored token
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },

  // Clear all stored data
  clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  },
}; 