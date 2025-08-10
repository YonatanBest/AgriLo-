"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "am", name: "Amharic", flag: "🇪🇹" },
  { code: "no", name: "Norwegian", flag: "🇳🇴" },
  { code: "sw", name: "Swahili", flag: "🇹🇿" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
];

interface LanguageContextType {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Comprehensive translations for the home page
const translations = {
  en: {
    // Navigation
    products: "Products",
    solutions: "Solutions",
    aboutUs: "About-Us",
    letsContact: "Let's Contact",

    // Hero Section
    heroTitle: "Empowering Farmers with Intelligent AI Solutions",
    heroSubtitle:
      "Agrilo provides cutting-edge artificial intelligence to optimize crop yields, manage resources, and predict market trends for a more sustainable and profitable future.",
    getStarted: "Get Started",
    goToDashboard: "Go to Dashboard",
    learnMore: "Learn More",

    // Features Section
    keyFeatures: "Key Features",
    featuresSubtitle:
      "Our AI solutions are designed to address the most pressing challenges faced by modern farmers.",
    precisionFarming: "Precision Farming",
    precisionFarmingDesc:
      "Optimize planting, irrigation, and harvesting with data-driven insights.",
    diseaseDetection: "Disease Detection",
    diseaseDetectionDesc:
      "Early identification of crop diseases and pests to minimize losses.",
    weatherPrediction: "Weather Prediction",
    weatherPredictionDesc:
      "Accurate localized weather forecasts to plan farming activities effectively.",
    marketAnalysis: "Market Analysis",
    marketAnalysisDesc:
      "Predict market prices and demand to make informed selling decisions.",
    resourceOptimization: "Resource Optimization",
    resourceOptimizationDesc:
      "Efficiently manage water, fertilizer, and energy consumption.",
    sustainablePractices: "Sustainable Practices",
    sustainablePracticesDesc:
      "Promote eco-friendly farming methods for long-term environmental health.",

    // Language Selection
    selectLanguage: "Select Language",
    chooseYourLanguage: "Choose your preferred language",
    continue: "Continue",

    // About Section
    about_Us: "What we believe",
    aboutDescription:
      "At Agrilo, we believe in the power of technology to transform agriculture. Our team of AI specialists, agronomists, and data scientists are dedicated to building intelligent tools that empower farmers to make smarter decisions, increase productivity, and foster sustainable growth. We are committed to supporting the global farming community with innovative and accessible solutions.",

    // Main Page Navigation
    home: "Home",
    monitor: "Monitor",
    chat: "Chat",
    calendar: "Calendar",
    profile: "Profile",

    // Main Page Content
    farmManagement: "Farm Management",
    quickActions: "Quick Actions",
    cropDiagnosis: "Crop Diagnosis",
    askAIExpert: "Ask AI Expert",
    systemOnline: "System Online",
    pendingNotifications: "pending notifications",
    dashboard: "Dashboard",
    loading: "Loading...",

    // Alert Messages
    pestAlert:
      "🚨 AI detected potential pest activity in Field A. Schedule inspection today!",

    // User Info
    locationNotSet: "Location not set",
    user: "User",

    // Home Page
    welcomeBack: "Welcome back",
    farmer: "Farmer",
    yourVirtualFarmland: "Your virtual farmland awaits",
    yourCrops: "Your Crops",
    currentlyGrowing: "Currently Growing",
    planningToGrow: "Planning to Grow",
    noCropsYet: "No crops added yet",
    addCropsToGetStarted: "Add crops to get started",
    noCurrentCrops: "No current crops",
    addCurrentCropsToGetStarted: "Add current crops to get started",
    noPlannedCrops: "No planned crops",
    addPlannedCropsToGetStarted: "Add planned crops to get started",
    yourLocation: "Your Location",
    detailedView: "Detailed View",
    satellite: "Satellite",
    roadmap: "Roadmap",
    loadingDetailedView: "Loading detailed view...",
    loadingMap: "Loading map...",
    satelliteView: "🛰️ Satellite View",
    roadmapView: "🗺️ Roadmap View",
    highDetailFarmView: "High-Detail Farm View:",
    exploreFarmLocation: "Explore your farm location with maximum detail.",
    aerialImagery: "Aerial imagery",
    standardMapView: "Standard map view",
    fertilizerRecommendations: "Fertilizer Recommendations",
    enterCropName: "Enter crop name (e.g., maize, wheat, rice)",
    getFertilizerPlan: "Get Fertilizer Plan",
    enterCropNameAndClick:
      'Enter a crop name and click "Get Fertilizer Plan" to get recommendations',
    cropExamples: "Examples: maize, wheat, rice, beans, tomatoes",
    mapPlaceholder: "Map will be displayed here",
    aiCropRecommendations: "AI Crop Recommendations",
    getRecommendations: "Get Recommendations",
    confidence: "Confidence",
    noRecommendationsYet: "No recommendations yet",
    clickGetRecommendations:
      "Click 'Get Recommendations' to see AI suggestions",
    farmerInformation: "Farmer Information",
    name: "Name",
    experience: "Years of Experience",
    years: "years",
    userType: "User Type",
    mainGoal: "Main Goal",
    preferredLanguage: "Preferred Language",
    location: "Location",
    notProvided: "Not provided",
    soilInformation: "Soil Information",
    texture: "Texture",

    // Solution Section
    faqs: "FAQs",
    faq1q: "How does Agrilo's AI crop recommendation work?",
    faq1a:
      "Our AI analyzes your soil type, location, weather patterns, and farming goals to provide personalized crop recommendations that maximize yield and sustainability.",
    faq2q: "What data does Agrilo use for analysis?",
    faq2a:
      "We use soil composition data, weather forecasts, historical crop performance, market prices, and local agricultural practices to generate accurate recommendations.",
    faq3q: "Is Agrilo suitable for all types of farming?",
    faq3a:
      "Yes! Agrilo works for small-scale family farms, large commercial operations, and everything in between. Our recommendations adapt to your specific farming context.",
    feature1: "AI-Powered Crop Recommendations",
    feature2: "Real-Time Weather Integration",
    feature3: "Soil Analysis & Mapping",
    feature4: "Multi-Language Support",
    feature5: "Precision Farming Tools",
    aboutUsTitle: "About Agrilo Platform",
    aboutUsDescription:
      "Agrilo is a revolutionary agricultural technology platform that combines artificial intelligence, data science, and precision farming to help farmers make smarter decisions. Our platform analyzes soil conditions, weather patterns, and market trends to provide personalized crop recommendations that maximize yield while promoting sustainable farming practices.",
    aboutUsMission:
      "Empowering farmers worldwide with AI-driven agricultural insights for a sustainable future.",
    mission: "Mission",
    signIn: "Sign-in",

    // Auth Options Page
    createAccount: "Create Account",
    joinAgrilo: "Join Agrilo to start your smart farming journey",
    signInToContinue: "Sign in to continue your farming journey",
    signUp: "Sign Up",
    fullName: "Full Name",
    enterFullName: "Enter your full name",
    emailAddress: "Email Address",
    enterEmailAddress: "Enter your email address",
    password: "Password",
    enterPassword: "Enter your password",
    confirmPassword: "Confirm Password",
    confirmYourPassword: "Confirm your password",
    createAccountButton: "Create Account",
    signInButton: "Sign In",
    newUserSetup: "New User Setup",
    newUserSetupDesc:
      "New users will go through a quick setup process to personalize their experience.",
    backToHome: "Back to Home",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    emailRequired: "Email is required",
    invalidEmailFormat: "Invalid email format",
    passwordRequired: "Password is required",
    passwordMinLength: "Password must be at least 6 characters",
    nameRequired: "Name is required",
    confirmPasswordRequired: "Please confirm your password",
    passwordsDoNotMatch: "Passwords do not match",
    allFieldsRequired: "All fields are required",
    emailAndPasswordRequired: "Email and password are required",
    emailAlreadyRegistered:
      "This email is already registered. Please sign in instead.",
    signingIn: "Signing In...",
    creatingAccount: "Creating Account...",
    createPassword: "Create a password",

    // Chat Page
    aiAssistantWelcome:
      "Hello! I'm your AI farming assistant. How can I help you today? 🌱",
    aiAssistant: "AI Assistant",
    pleaseLoginToChat: "Please log in to start chatting with the AI assistant",
    connectionError:
      "Sorry, I'm having trouble connecting right now. Please try again later.",
    recording: "Recording...",
    tapStopButton: "Tap the red STOP button",
    clickStopButton: "Click the red STOP button",
    typeFarmingQuestion: "Type your farming question...",
    typeQuestionInLanguage: "Type your question in {language}...",
    youreOffline: "You're offline",
    stop: "STOP",
    processing: "Processing...",
    playing: "Playing...",
    liveChat: "Live Chat",
    availableLanguages: "Available Languages ({count})",
    quickQuestions: "Quick Questions",
    fertilizerForWheat: "What fertilizer for wheat?",
    fertilizerForWheatQuestion: "What fertilizer should I use for wheat crops?",
    bestTimeToPlantRice: "Best time to plant rice",
    bestTimeToPlantRiceQuestion:
      "When is the best time to plant rice in my region?",
    naturalPestControl: "Natural pest control",
    naturalPestControlQuestion:
      "How can I control pests naturally without chemicals?",
    soilPhTesting: "Soil pH testing",
    soilPhTestingQuestion: "What are the best methods for testing soil pH?",
    irrigationTips: "Irrigation tips",
    irrigationTipsQuestion:
      "What are the best irrigation scheduling tips for my crops?",
    cropRotation: "Crop rotation",
    cropRotationQuestion:
      "What are the benefits of crop rotation and how should I plan it?",
    diseasePrevention: "Disease prevention",
    diseasePreventionQuestion: "How can I prevent common crop diseases?",
    weatherImpact: "Weather impact",
    weatherImpactQuestion:
      "How does weather affect my crop growth and what should I do?",
    mediaRecorderNotSupported: "MediaRecorder not supported in this browser",
    noSupportedAudioFormat: "No supported audio format found",
    unknownError: "Unknown error",
    microphoneAccessError:
      "Error accessing microphone: {error}. Please check permissions and try again.",
    audioProcessingError:
      "Sorry, I couldn't process your audio message. Please try again or type your message.",
    speakMoreClearly:
      "Please speak more clearly and try again. Make sure you're close to your microphone.",
    noSpeechDetected:
      "I didn't hear anything. Please speak louder and try again.",
    unknownCrop: "unknown crop",
    unknownIssues: "unknown issues",
    unknown: "unknown",
    diagnosisMessageTemplate:
      "I just analyzed my {crop} and found {problems}. The crop health is {health} with {severity} severity. Can you help me understand what this means and what I should do next?",

    // Monitor Page
    cropMonitor: "🌱 Crop Monitor",
    addNewField: "+ Add New Field",
    healthDiagnosis: "🔬 Health Diagnosis",
    treatmentTracker: "📊 Treatment Tracker",
    aiDiagnosisResult: "🔬 AI Diagnosis Result",
    healthy: "Healthy",
    unhealthy: "Unhealthy",
    healthAssessment: "Health Assessment:",
    severity: "Severity:",
    status: "Status:",
    cropAppearsHealthy: "Crop Appears Healthy",
    issuesDetected: "Issues Detected",
    cropInformation: "Crop Information:",
    crop: "Crop:",
    scheduleTreatment: "Schedule Treatment",
    viewSimilarCases: "View Similar Cases",
    aiAnalysis: "AI Analysis:",
    healthScore: "Health Score:",
    healthyProbability: "Healthy Probability:",
    uploadImage: "Upload Image",
    takePhoto: "Take Photo",
    dragAndDropImage: "Drag and drop an image here, or click to select",
    supportedFormats: "Supported formats: JPG, PNG, WEBP",
    maxFileSize: "Max file size: 10MB",
    analyzingImage: "Analyzing image...",
    uploadImageToAnalyze: "Upload an image of your crop to analyze its health",
    noImageSelected: "No image selected",
    selectImageToAnalyze: "Select an image to analyze",
    treatmentHistory: "Treatment History",
    noTreatmentsYet: "No treatments recorded yet",
    addTreatment: "Add Treatment",
    treatmentType: "Treatment Type",
    field: "Field",
    date: "Date",
    applied: "Applied",
    upcoming: "Upcoming",
    pending: "Pending",
    completed: "Completed",
    fertilizer: "Fertilizer",
    pesticide: "Pesticide",
    irrigation: "Irrigation",
    pruning: "Pruning",
    harvesting: "Harvesting",
    other: "Other",
    cropHealthDiagnosis: "Crop Health Diagnosis",
    uploadOrCaptureImages:
      "Upload or capture images of your crop, leaf, or soil for AI analysis",
    useCamera: "Use camera",
    fromGallery: "From gallery",

    // Calendar Page
    smartFarmingCalendar: "Smart Farming Calendar",
    aiPoweredTaskManagement: "AI-powered task management and scheduling",
    refreshWeather: "Refresh Weather",
    refreshing: "Refreshing...",
    weatherDataForLocation: "Weather data for your location: {location}",
    coordinates: "Coordinates: {lat}, {lon}",
    usingDefaultLocation: "Using default location (Ethiopia)",
    updateLocationSettings:
      "Please update your location in settings for personalized weather data",
    loadingWeatherData: "Loading weather data...",
    weatherForecastLimited:
      "Note: Weather forecast is limited to 14 days due to API constraints",
    dataCached: "💾 Data is cached for faster loading",
    sun: "Sun",
    mon: "Mon",
    tue: "Tue",
    wed: "Wed",
    thu: "Thu",
    fri: "Fri",
    sat: "Sat",
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December",

    // Settings Page
    back: "Back",
    profileSettings: "Profile Settings",
    editProfile: "Edit Profile",
    cancel: "Cancel",
    personalInformation: "Personal Information",
    enterLocation: "Enter your location (e.g., coordinates or city)",
    farmingExperience: "Farming Experience",
    yearsOfExperience: "Years of Experience",
    cropsGrown: "Crops Grown",
    addCrop: "Add Crop",
    cropName: "Crop Name",
    current: "Current",
    planned: "Planned",
    saveChanges: "Save Changes",
    changesSaved: "Changes saved successfully!",
    errorSavingChanges: "Error saving changes. Please try again.",
    selectFarmingExperience: "Please select your farming experience",
    selectYearsExperience: "Please select years of experience",
    selectMainGoal: "Please select your main goal",

    // Calendar Page Additional
    loadAITasks: "Load AI Tasks",
    loadingAITasks: "Loading AI Tasks...",
    clearSky: "CLEAR SKY",

    // User Registration Page
    tellUsAboutFarming: "Tell Us About Your Farming",
    helpPersonalizeExperience: "Help us personalize your experience",
    aspiringFarmer: "Aspiring Farmer",
    beginnerFarmer: "Beginner (1-2 years)",
    experiencedFarmer: "Experienced (3-5 years)",
    explorerFarmer: "Explorer (5+ years)",
    increaseCropYield: "Increase Crop Yield",
    reduceFarmingCosts: "Reduce Farming Costs",
    sustainableFarming: "Sustainable Farming",
    organicFarming: "Organic Farming",
    betterMarketAccess: "Better Market Access",
    noCropsSelected: "No crops selected",
    selectedCrops: "Selected crops",
    continueToApp: "Continue to App",

    // Settings Page Additional
    farmingInformation: "Farming Information",
    noCropsCurrentlyGrowing: "No crops currently growing",
    noCropsPlanned: "No crops planned",
    addNewCrop: "Add New Crop",
    year: "year",
    loadingProfile: "Loading profile...",
  },
  am: {
    // Navigation
    products: "ምርቶች",
    solutions: "መፍትሄዎች",
    aboutUs: "ስለ እኛ",
    letsContact: "እንወያይ",

    // Hero Section
    heroTitle: "የአርሶ አደሮችን በዘመናዊ የአሰልጣኝ አይ ስልቶች እንዲያበረታቱ",
    heroSubtitle:
      "አግሪሎ የተሻሻለው የአሰልጣኝ አይ ቴክኖሎጂ ያቀርባል የዝርያ ምርትን ለማሳደግ፣ ሀብቶችን ለማስተዳደር እና የገበያ አዝማሚያዎችን ለመተንበይ ለተጨማሪ ዘላቂ እና ትርፋማ መስክ።",
    getStarted: "ጀምር",
    goToDashboard: "ወደ ዳሽቦርድ ይሂዱ",
    learnMore: "ተጨማሪ ይወቁ",

    // Features Section
    keyFeatures: "ዋና ባህሪያት",
    featuresSubtitle: "የእኛ የአይ ስልቶች የዘመናዊ አርሶ አደሮች የሚያጋጡ ችግሮችን ለመፍታት ተዘጋጅተዋል።",
    precisionFarming: "የትክክለኛ እርሻ",
    precisionFarmingDesc:
      "የመትከል፣ የውሃ ማጠጣት እና የመሰብሰብ ሂደትን በውሂብ ላይ የተመሰረተ ግንዛቤ ያሳድጉ።",
    diseaseDetection: "የበሽታ መለያ",
    diseaseDetectionDesc: "የዝርያ በሽታዎችን እና ጎጆዎችን በጊዜ ማወቅ ኪሳራዎችን ለመቀነስ።",
    weatherPrediction: "የአየር ሁኔታ ትንቢት",
    weatherPredictionDesc: "የእርሻ ስራዎችን ለመደራጀት ትክክለኛ የአየር ሁኔታ ትንቢት።",
    marketAnalysis: "የገበያ ትንተና",
    marketAnalysisDesc: "የገበያ ዋጋዎችን እና ፍላጎትን ትንበይ ለመረጃ ያለው የመሸጫ ውሳኔ ያድርጉ።",
    resourceOptimization: "የሀብት ማሻሻያ",
    resourceOptimizationDesc: "ውሃ፣ ማዳበሪያ እና የኢነርጂ ፍጆታን በቅልጡፍ ያስተዳድሩ።",
    sustainablePractices: "ዘላቂ ስራዎች",
    sustainablePracticesDesc:
      "ለረጅም ጊዜ የአካባቢ ጥበቃ የሚያገለግሉ የአካባቢ ደህንነት ያላቸው የእርሻ ዘዴዎችን ያስፋፉ።",

    // Language Selection
    selectLanguage: "ቋንቋ ይምረጡ",
    chooseYourLanguage: "የሚያሻዎትን ቋንቋ ይምረጡ",
    continue: "ቀጥል",

    // About Section
    about_Us: "ስለ እኛ",
    aboutDescription:
      "በአግሪሎ፣ ቴክኖሎጂ እርሻን ለመለወጥ ያለውን ኃይል እናምናለን። የእኛ የአይ ስፔሻሊስቶች፣ አግሮኖሚስቶች እና የውሂብ ሳይንቲስቶች ቡድን አርሶ አደሮች የተሻለ ውሳኔ እንዲያደርጉ፣ ምርታማነት እንዲጨምሩ እና ዘላቂ እድገት እንዲያሳድጉ የሚያስችሉ ዘመናዊ መሳሪያዎችን ለመገንባት ቁርጠኞች ናቸው። በዘመናዊ እና ተደራሽ መፍትሄዎች የዓለም አርሶ አደር ማህበረሰብን ለመደገፍ ቁርጠኞች ነን።",

    // Main Page Navigation
    home: "የመነሻ ገጽ",
    monitor: "መከታተል",
    chat: "ውይይት",
    calendar: "መዝገብ",
    profile: "መገለጫ",

    // Main Page Content
    farmManagement: "የእርሻ አስተዳደር",
    quickActions: "ፈጣን ድርጊቶች",
    cropDiagnosis: "የዝርያ ምርመራ",
    askAIExpert: "አይ ስፔሻሊስት ይጠይቁ",
    systemOnline: "ስርዓቱ በመስመር ላይ ነው",
    pendingNotifications: "የሚጠበቁ ማስታወቂያዎች",
    dashboard: "የመከወኛ ሰሌዳ",
    loading: "በመጫን ላይ...",

    // Alert Messages
    pestAlert: "🚨 አይ በግቢ ኤ ውስጥ የጎጆ እንቅስቃሴ እንደሚያውቅ አስተውሏል። ዛሬ ምርመራ ያዘጋጁ!",

    // User Info
    locationNotSet: "አካባቢ አልተዘጋጀም",
    user: "ተጠቃሚ",

    // Home Page
    welcomeBack: "እንደገና እንኳን ደስ አለዎት",
    farmer: "አርሶ አደር",
    yourVirtualFarmland: "የእርስዎ ምናባዊ እርሻ ያስተጋራዎታል",
    yourCrops: "የእርስዎ ዝርያዎች",
    currentlyGrowing: "አሁን ያለው",
    planningToGrow: "የሚያድገው",
    noCropsYet: "ገና ዝርያ አልተጨመረም",
    addCropsToGetStarted: "ዝርያዎችን ያክሉ ለመጀመር",
    noCurrentCrops: "አሁን ያለው ዝርያ የለም",
    addCurrentCropsToGetStarted: "አሁን ያለው ዝርያ ያክሉ ለመጀመር",
    noPlannedCrops: "የታቀደ ዝርያ የለም",
    addPlannedCropsToGetStarted: "የታቀደ ዝርያ ያክሉ ለመጀመር",
    yourLocation: "አካባቢዎ",
    detailedView: "ዝርዝር እይታ",
    satellite: "ሳተላይት",
    roadmap: "የመንገድ ካርታ",
    loadingDetailedView: "ዝርዝር እይታ በመጫን ላይ...",
    loadingMap: "ካርታ በመጫን ላይ...",
    satelliteView: "🛰️ ሳተላይት እይታ",
    roadmapView: "🗺️ የመንገድ ካርታ እይታ",
    highDetailFarmView: "የተሻሻለ የእርሻ እይታ:",
    exploreFarmLocation: "የእርስዎን እርሻ አካባቢ በከፍተኛ ዝርዝር ያስሱ።",
    aerialImagery: "የአየር ማስተዋል",
    standardMapView: "መደበኛ የካርታ እይታ",
    fertilizerRecommendations: "የሰብል ምግብ ምክሮች",
    enterCropName: "የዝርያ ስም ያስገቡ (ለምሳሌ፡ በቆሎ፣ ስንዴ፣ ሩዝ)",
    getFertilizerPlan: "የሰብል ምግብ እቅድ ያግኙ",
    enterCropNameAndClick: 'የዝርያ ስም ያስገቡ እና "የሰብል ምግብ እቅድ ያግኙ" ይጫኑ ምክሮችን ለመስጠት',
    cropExamples: "ምሳሌዎች: በቆሎ፣ ስንዴ፣ ሩዝ፣ ባንዲራ፣ ቲማቲም",
    mapPlaceholder: "ካርታ እዚህ ይታያል",
    aiCropRecommendations: "የአይ ዝርያ ምክር",
    getRecommendations: "ምክሮችን ያግኙ",
    confidence: "እምነት",
    noRecommendationsYet: "ገና ምክር የለም",
    clickGetRecommendations: "የአይ ምክሮችን ለማየት 'ምክሮችን ያግኙ' ይጫኑ",
    farmerInformation: "የአርሶ አደር መረጃ",

    // Solution Section
    faq1q: "የአግሪሎ የአይ ዝርያ ምክር እንዴት ይሰራል?",
    faq1a:
      "የእኛ አይ የእርስዎን የአፈር አይነት፣ አካባቢ፣ የአየር ሁኔታ ንድፍ እና የእርሻ ግቦች ያዳምጣል የግል ዝርያ ምክሮችን ለመስጠት የምርት እና ዘላቂነትን ያሳድጋል።",
    faq2q: "አግሪሎ ለመተንተን ምን ዓይነት ውሂብ ይጠቀማል?",
    faq2a:
      "የአፈር ውህደት ውሂብ፣ የአየር ሁኔታ ትንቢት፣ የታሪክ ዝርያ አድማጭ፣ የገበያ ዋጋዎች እና የአካባቢ እርሻ ስራዎችን እንጠቀማለን ትክክለኛ ምክሮችን ለመፍጠር።",
    faq3q: "አግሪሎ ለሁሉም ዓይነት እርሻ ተስማሚ ነው?",
    faq3a:
      "አዎ! አግሪሎ ለትንሽ የቤተሰብ እርሻዎች፣ ለትልልቅ የንግድ ስራዎች እና ለሁሉም መካከለኛ እርሻዎች ይሰራል። የእኛ ምክሮች ወደ የእርስዎ የተለየ የእርሻ አውድ ይስማማሉ።",
    feature1: "የአይ የተጎለበተ ዝርያ ምክሮች",
    feature2: "የተሟላ ጊዜ የአየር ሁኔታ ውህደት",
    feature3: "የአፈር ትንተና እና ካርታ ማውጫ",
    feature4: "የብዙ ቋንቋ ድጋፍ",
    feature5: "የትክክለኛ እርሻ መሳሪያዎች",
    aboutUsTitle: "ስለ አግሪሎ መድረኳ",
    aboutUsDescription:
      "አግሪሎ አርሶ አደሮች የተሻለ ውሳኔ እንዲያደርጉ የሚያገለግል የአይ፣ የውሂብ ሳይንስ እና የትክክለኛ እርሻ የሚያጣምር አብዮታዊ የእርሻ ቴክኖሎጂ መድረኳ ነው። የእኛ መድረኳ የአፈር ሁኔታዎችን፣ የአየር ሁኔታ ንድፍ እና የገበያ አዝማሚያዎችን ያዳምጣል የግል ዝርያ ምክሮችን ለመስጠት የምርት እና ዘላቂ እርሻ ስራዎችን ያሳድጋል።",
    aboutUsMission: "የዓለም አርሶ አደሮችን በአይ የተጎለበተ የእርሻ ግንዛቤ ለዘላቂ መስክ እንዲያበረታቱ።",
    mission: "ተልእኮ",
    signIn: "ግባ",

    // Auth Options Page
    createAccount: "መለያ ፍጠር",
    joinAgrilo: "የብልሽ እርሻ ጉዞዎን ለመጀመር አግሪሎ ላይ ይቀላቀሉ",
    signInToContinue: "የእርሻ ጉዞዎን ለመቀጠል ይግቡ",
    signUp: "ይመዝገቡ",
    fullName: "ሙሉ ስም",
    enterFullName: "ሙሉ ስምዎን ያስገቡ",
    emailAddress: "የኢሜይል አድራሻ",
    enterEmailAddress: "የኢሜይል አድራሻዎን ያስገቡ",
    password: "የይለፍ ቃል",
    enterPassword: "የይለፍ ቃልዎን ያስገቡ",
    confirmPassword: "የይለፍ ቃል ያረጋግጡ",
    confirmYourPassword: "የይለፍ ቃልዎን ያረጋግጡ",
    createAccountButton: "መለያ ፍጠር",
    signInButton: "ግባ",
    newUserSetup: "የአዲስ ተጠቃሚ ማዘጋጀት",
    newUserSetupDesc: "አዲስ ተጠቃሚዎች የግል ማስተማሪያ ሂደት ያለፍ ይሆናሉ።",
    backToHome: "ወደ መነሻ ገጽ ይመለሱ",
    alreadyHaveAccount: "የተመዘገቡ ነዎት?",
    dontHaveAccount: "መለያ የለዎትም?",
    emailRequired: "ኢሜይል ያስፈልጋል",
    invalidEmailFormat: "የማይሰራ የኢሜይል ቅርጸት",
    passwordRequired: "የይለፍ ቃል ያስፈልጋል",
    passwordMinLength: "የይለፍ ቃል ቢያንስ 6 ፊደላት ሊሆን ይገባል",
    nameRequired: "ስም ያስፈልጋል",
    confirmPasswordRequired: "የይለፍ ቃልዎን ያረጋግጡ",
    passwordsDoNotMatch: "የይለፍ ቃሎች አይጣጣሙም",
    allFieldsRequired: "ሁሉም መስኮች ያስፈልጋሉ",
    emailAndPasswordRequired: "ኢሜይል እና የይለፍ ቃል ያስፈልጋሉ",
    emailAlreadyRegistered: "ይህ ኢሜይል አስቀድሞ ተመዝግቧል። እባክዎ ይግቡ።",
    signingIn: "ይግባል...",
    creatingAccount: "መለያ ይፈጥራል...",
    createPassword: "የይለፍ ቃል ይፍጠሩ",

    // Chat Page
    aiAssistantWelcome: "ሰላም! የእርስዎ የአይ እርሻ ረዳት ነኝ። ዛሬ እንዴት ልረዳዎት እችላለሁ? 🌱",
    aiAssistant: "የአይ ረዳት",
    pleaseLoginToChat: "እባክዎ ከአይ ረዳት ጋር ለመወያየት ይግቡ",
    connectionError: "ይቅርታ፣ አሁን ለመገናኘት ችግር አለኝ። እባክዎ በኋላ ዳግም ይሞክሩ።",
    recording: "ይመዘገባል...",
    tapStopButton: "የቀይ ማቆሚያ ቁልፍ ይጫኑ",
    clickStopButton: "የቀይ ማቆሚያ ቁልፍ ይጫኑ",
    typeFarmingQuestion: "የእርሻ ጥያቄዎን ይፃፉ...",
    typeQuestionInLanguage: "ጥያቄዎን በ{language} ይፃፉ...",
    youreOffline: "ያለ መስመር ነዎት",
    stop: "አቁም",
    processing: "ይሰራል...",
    playing: "ይጫወታል...",
    liveChat: "የቀጥታ ውይይት",
    availableLanguages: "የሚገኙ ቋንቋዎች ({count})",
    quickQuestions: "ፈጣን ጥያቄዎች",
    fertilizerForWheat: "ለስንዴ ምን ዓይነት ማዳበሪያ?",
    fertilizerForWheatQuestion: "ለስንዴ ምርት ምን ዓይነት ማዳበሪያ ማጠቀም አለብኝ?",
    bestTimeToPlantRice: "ለሩዝ መትከል ምርጥ ጊዜ",
    bestTimeToPlantRiceQuestion: "በእንደዚህ አውድ ሩዝ መትከል ምርጥ ጊዜ መቼ ነው?",
    naturalPestControl: "የተፈጥሮ ጎጆ መቆጣጠሪያ",
    naturalPestControlQuestion: "ኬሚካላት ሳይጠቀም ጎጆዎችን እንዴት ልቆጣጠር እችላለሁ?",
    soilPhTesting: "የአፈር ፒኤች ምርመራ",
    soilPhTestingQuestion: "የአፈር ፒኤች ለመሞከር ምርጥ ዘዴዎች ምንድን ናቸው?",
    irrigationTips: "የውሃ ማጠጣት ምክሮች",
    irrigationTipsQuestion: "ለዝርያዎቼ ምርጥ የውሃ ማጠጣት ምርጫ ምክሮች ምንድን ናቸው?",
    cropRotation: "የዝርያ ማዞሪያ",
    cropRotationQuestion: "የዝርያ ማዞሪያ ጥቅሞች ምንድን ናቸው እና እንዴት ማዘጋጀት አለብኝ?",
    diseasePrevention: "የበሽታ መከላከል",
    diseasePreventionQuestion: "የተለመዱ የዝርያ በሽታዎችን እንዴት ልከላከል እችላለሁ?",
    weatherImpact: "የአየር ሁኔታ ተጽዕኖ",
    weatherImpactQuestion: "አየር ሁኔታ የዝርያ እድገቴን እንዴት ያጎላል እና ምን ማድረግ አለብኝ?",
    mediaRecorderNotSupported: "MediaRecorder በዚህ ብራውዘር አይደገፍም",
    noSupportedAudioFormat: "የሚደገፍ የድምፅ ቅርጸት አልተገኘም",
    unknownError: "የማይታወቅ ስህተት",
    microphoneAccessError:
      "የድምፅ መቀበያ ስህተት: {error}። እባክዎ ፈቃዶችን ያረጋግጡ እና ዳግም ይሞክሩ።",
    audioProcessingError:
      "ይቅርታ፣ የድምፅ መልእክትዎን ማስተካከል አልቻልኩም። እባክዎ ዳግም ይሞክሩ ወይም መልእክትዎን ይፃፉ።",
    speakMoreClearly:
      "እባክዎ የበለጠ ግልጽ ይናገሩ እና ዳግም ይሞክሩ። ከድምፅ መቀበያዎ አቅራቢያ መሆንዎን ያረጋግጡ።",
    noSpeechDetected: "ምንም አልሰማም። እባክዎ የበለጠ ያሰሙ እና ዳግም ይሞክሩ።",
    unknownCrop: "የማይታወቅ ዝርያ",
    unknownIssues: "የማይታወቁ ችግሮች",
    unknown: "የማይታወቅ",
    diagnosisMessageTemplate:
      "የ{crop} ምርመራ አደረግኩ እና {problems} አገኘሁ። የዝርያ ጥበቃ {health} ነው ከ{severity} ከባድነት ጋር። ይህ ምን ማለት እንደሆነ እና በመቀጠል ምን ማድረግ እንደሚገባ ልረዳኝ እችላለሁ?",

    // Monitor Page
    cropMonitor: "🌱 የዝርያ መከታተል",
    addNewField: "+ አዲስ መስክ አክል",
    healthDiagnosis: "🔬 የጥበቃ ምርመራ",
    treatmentTracker: "📊 የሕክምና መከታተል",
    aiDiagnosisResult: "🔬 የአይ ምርመራ ውጤት",
    healthy: "ጤናማ",
    unhealthy: "ያለጤና",
    healthAssessment: "የጥበቃ ግምገማ:",
    severity: "ከባድነት:",
    status: "ሁኔታ:",
    cropAppearsHealthy: "ዝርያው ጤናማ ይመስላል",
    issuesDetected: "ችግሮች ተገኝተዋል",
    cropInformation: "የዝርያ መረጃ:",
    crop: "ዝርያ:",
    scheduleTreatment: "ሕክምና ያቅዱ",
    viewSimilarCases: "ተመሳሳይ ጉዳዮችን ይመልከቱ",
    aiAnalysis: "የአይ ትንተና:",
    healthScore: "የጥበቃ ነጥብ:",
    healthyProbability: "የጤና እድል:",
    uploadImage: "ምስል ይጫኑ",
    takePhoto: "ፎቶ ያንሱ",
    dragAndDropImage: "ምስል እዚህ ይጎትቱ ወይም ለመምረጥ ይጫኑ",
    supportedFormats: "የሚደገፉ ቅርጸቶች: JPG, PNG, WEBP",
    maxFileSize: "የፋይል ከፍተኛ መጠን: 10MB",
    analyzingImage: "ምስል ተተንትያለሁ...",
    uploadImageToAnalyze: "የዝርያዎን ጥበቃ ለመተንተን ምስል ይጫኑ",
    noImageSelected: "ምስል አልተመረጠም",
    selectImageToAnalyze: "ለመተንተን ምስል ይምረጡ",
    treatmentHistory: "የሕክምና ታሪክ",
    noTreatmentsYet: "ገና ሕክምና አልተመዘገበም",
    addTreatment: "ሕክምና አክል",
    treatmentType: "የሕክምና አይነት",
    field: "መስክ",
    date: "ቀን",
    applied: "ተግብሯል",
    upcoming: "የሚመጣ",
    pending: "የሚጠበቅ",
    completed: "ተጠናቅቋል",
    fertilizer: "ማዳበሪያ",
    pesticide: "ጎጆ መስያያ",
    irrigation: "የውሃ ማጠጣት",
    pruning: "መቁረጥ",
    harvesting: "መሰብሰብ",
    other: "ሌላ",
    cropHealthDiagnosis: "የዝርያ ጥበቃ ምርመራ",
    uploadOrCaptureImages: "የዝርያዎን፣ ቅጠል ወይም አፈር ለአይ ትንተና ምስል ይጫኑ ወይም ይያዙ",
    useCamera: "ካሜራ ይጠቀሙ",
    fromGallery: "ከመደብ ያግኙ",

    // Calendar Page
    smartFarmingCalendar: "ዘመናዊ የእርሻ መዝገብ",
    aiPoweredTaskManagement: "የአይ የተጎለበተ የስራ አስተዳደር እና የጊዜ ማዘጋጀት",
    refreshWeather: "የአየር ሁኔታ ያድስ",
    refreshing: "ይደስታል...",
    weatherDataForLocation: "የአየር ሁኔታ ውሂብ ለአካባቢዎ: {location}",
    coordinates: "መጋጠሚያዎች: {lat}, {lon}",
    usingDefaultLocation: "የመደበኛ አካባቢ ጥቀም (ኢትዮጵያ)",
    updateLocationSettings: "የግል የአየር ሁኔታ ውሂብ ለማግኘት አካባቢዎን በቅንብሮች ያድስ",
    loadingWeatherData: "የአየር ሁኔታ ውሂብ ተጫንቷል...",
    weatherForecastLimited:
      "ማስታወሻ: የአየር ሁኔታ ትንቢት በAPI ገደቦች ምክንያት ወደ 14 ቀናት ውስን ነው",
    dataCached: "💾 ውሂብ ለፈጣን መጫን ተቀምጧል",
    sun: "እሁድ",
    mon: "ሰኞ",
    tue: "ማክሰኞ",
    wed: "ረቡዕ",
    thu: "ሐሙስ",
    fri: "ዓርብ",
    sat: "ቅዳ",
    january: "ጥር",
    february: "የካቲት",
    march: "መጋቢት",
    april: "ሚያዝያ",
    may: "ግንቦት",
    june: "ሰኔ",
    july: "ሐምሌ",
    august: "ነሐሴ",
    september: "መስከረም",
    october: "ጥቅምት",
    november: "ሕዳር",
    december: "ታህሳስ",

    // Settings Page
    back: "ወደ ኋላ",
    profileSettings: "የመገለጫ ቅንብሮች",
    editProfile: "መገለጫ ያስተካክሉ",
    cancel: "ሰርዝ",
    personalInformation: "የግል መረጃ",
    location: "አካባቢ",
    enterLocation: "አካባቢዎን ያስገቡ (ለምሳሌ፣ መጋጠሚያዎች ወይም ከተማ)",
    preferredLanguage: "የሚያሻዎት ቋንቋ",
    notProvided: "አልተሰጠም",
    farmingExperience: "የእርሻ ስራ ስሜት",
    yearsOfExperience: "የስራ ስሜት ዓመታት",
    mainGoal: "ዋና ግብ",
    cropsGrown: "የተጨማሩ ዝርያዎች",
    addCrop: "ዝርያ አክል",
    cropName: "የዝርያ ስም",
    current: "አሁን ያለው",
    planned: "የታቀደ",
    saveChanges: "ለውጦችን አስቀምጥ",
    changesSaved: "ለውጦች በተሳካት ለውጥ ተደርገዋል!",
    errorSavingChanges: "ለውጦችን ለማስቀመጥ ስህተት። እባክዎ ዳግም ይሞክሩ።",
    selectFarmingExperience: "እባክዎ የእርሻ ስራ ስሜትዎን ይምረጡ",
    selectYearsExperience: "እባክዎ የስራ ስሜት ዓመታትን ይምረጡ",
    selectMainGoal: "እባክዎ ዋና ግብዎን ይምረጡ",

    // Calendar Page Additional
    loadAITasks: "የአይ ስራዎችን ጫን",
    loadingAITasks: "የአይ ስራዎች ተጫንቷል...",
    clearSky: "ግማሽ አየር",

    // User Registration Page
    tellUsAboutFarming: "የግብርናዎ ስለ እንደሆነ ይንገሩን",
    helpPersonalizeExperience: "የእርስዎ ልምድ እንዲስተካከል ያግዙን",
    aspiringFarmer: "የሚፈልግ ገበሬ",
    beginnerFarmer: "ጀማሪ (1-2 ዓመት)",
    experiencedFarmer: "የተሞካረቀ (3-5 ዓመት)",
    explorerFarmer: "የተሞካረቀ (5+ ዓመት)",
    increaseCropYield: "የዕፅ ምርት ማሳደጊያ",
    reduceFarmingCosts: "የግብርና ወጪ መቀነስ",
    sustainableFarming: "ዘላቂ ግብርና",
    organicFarming: "የተፈጥሮ ግብርና",
    betterMarketAccess: "የተሻለ ገበያ መድረሻ",
    noCropsSelected: "ምንም ዕፅ አልተመረጠም",
    selectedCrops: "የተመረጡ ዕፆች",
    continueToApp: "ወደ መተግበሪያ ቀጥል",

    // Settings Page Additional
    farmingInformation: "የእርሻ መረጃ",
    noCropsCurrentlyGrowing: "አሁን ምንም ዝርያ አይተርምም",
    noCropsPlanned: "ምንም ዝርያ አልተዘጋጀም",
    addNewCrop: "አዲስ ዝርያ ያክሉ",
    year: "ዓመት",
    years: "ዓመታት",
    loadingProfile: "መገለጫ በመጫን ላይ...",
  },
  no: {
    // Navigation
    products: "Produkter",
    solutions: "Løsninger",
    aboutUs: "Om Oss",
    letsContact: "La Oss Kontakte",

    // Hero Section
    heroTitle: "Støtter Bønder med Intelligente AI-løsninger",
    heroSubtitle:
      "Agrilo tilbyr banebrytende kunstig intelligens for å optimalisere avling, administrere ressurser og forutsi markedsutvikling for en mer bærekraftig og lønnsom fremtid.",
    getStarted: "Kom i Gang",
    goToDashboard: "Gå til Dashbord",
    learnMore: "Lær Mer",

    // Features Section
    keyFeatures: "Hovedfunksjoner",
    featuresSubtitle:
      "Våre AI-løsninger er designet for å håndtere de mest presserende utfordringene som moderne bønder møter.",
    precisionFarming: "Presisjonslandbruk",
    precisionFarmingDesc:
      "Optimaliser planting, vanning og høsting med datadrevne innsikter.",
    diseaseDetection: "Sykdomsdeteksjon",
    diseaseDetectionDesc:
      "Tidlig identifikasjon av plantesykdommer og skadedyr for å minimere tap.",
    weatherPrediction: "Værvarsling",
    weatherPredictionDesc:
      "Nøyaktige lokale værmeldinger for å planlegge landbruksaktiviteter effektivt.",
    marketAnalysis: "Markedsanalyse",
    marketAnalysisDesc:
      "Forutsi markedspriser og etterspørsel for å ta informerte salgsbeslutninger.",
    resourceOptimization: "Ressursoptimalisering",
    resourceOptimizationDesc:
      "Administrer vann, gjødsel og energiforbruk effektivt.",
    sustainablePractices: "Bærekraftige Praksiser",
    sustainablePracticesDesc:
      "Fremme miljøvennlige landbruksmetoder for langsiktig miljøhelse.",

    // Language Selection
    selectLanguage: "Velg Språk",
    chooseYourLanguage: "Velg ditt foretrukne språk",
    continue: "Fortsett",

    // About Section
    about_Us: "Om Oss",
    aboutDescription:
      "Hos Agrilo tror vi på teknologiens kraft til å forvandle landbruket. Vårt team av AI-spesialister, agronomer og datavitenskapsmenn er dedikert til å bygge intelligente verktøy som styrker bønder til å ta smartere beslutninger, øke produktiviteten og fremme bærekraftig vekst. Vi er forpliktet til å støtte det globale landbrukssamfunnet med innovative og tilgjengelige løsninger.",

    // Main Page Navigation
    home: "Hjem",
    monitor: "Overvåk",
    chat: "Chat",
    calendar: "Kalender",
    profile: "Profil",

    // Main Page Content
    farmManagement: "Gårdsstyring",
    quickActions: "Hurtighandlinger",
    cropDiagnosis: "Avlingsdiagnose",
    askAIExpert: "Spør AI-ekspert",
    systemOnline: "System Online",
    pendingNotifications: "ventende varsler",
    dashboard: "Dashbord",
    loading: "Laster...",

    // Alert Messages
    pestAlert:
      "🚨 AI oppdaget potensiell skadeaktivitet i Aker. Planlegg inspeksjon i dag!",

    // User Info
    locationNotSet: "Plassering ikke satt",
    user: "Bruker",

    // Home Page
    welcomeBack: "Velkommen tilbake",
    farmer: "Bonde",
    yourVirtualFarmland: "Ditt virtuelle gårdsland venter",
    yourCrops: "Dine avlinger",
    currentlyGrowing: "Dyrker nå",
    planningToGrow: "Planlegger å dyrke",
    noCropsYet: "Ingen avlinger lagt til ennå",
    addCropsToGetStarted: "Legg til avlinger for å komme i gang",
    noCurrentCrops: "Ingen nåværende avlinger",
    addCurrentCropsToGetStarted:
      "Legg til nåværende avlinger for å komme i gang",
    noPlannedCrops: "Ingen planlagte avlinger",
    addPlannedCropsToGetStarted:
      "Legg til planlagte avlinger for å komme i gang",
    yourLocation: "Din plassering",
    detailedView: "Detaljert visning",
    satellite: "Satellitt",
    roadmap: "Vegkart",
    loadingDetailedView: "Laster detaljert visning...",
    loadingMap: "Laster kart...",
    satelliteView: "🛰️ Satellittvisning",
    roadmapView: "🗺️ Vegkartvisning",
    highDetailFarmView: "Høy-detaljert gårdsvisning:",
    exploreFarmLocation: "Utforsk gårdsplasseringen din med maksimal detalj.",
    aerialImagery: "Luftfotografi",
    standardMapView: "Standard kartvisning",
    fertilizerRecommendations: "Gjødselanbefalinger",
    enterCropName: "Skriv inn avlingsnavn (f.eks. mais, hvete, ris)",
    getFertilizerPlan: "Få gjødselplan",
    enterCropNameAndClick:
      'Skriv inn et avlingsnavn og klikk "Få gjødselplan" for å få anbefalinger',
    cropExamples: "Eksempler: mais, hvete, ris, bønner, tomater",
    mapPlaceholder: "Kart vil vises her",
    aiCropRecommendations: "AI-avlingsanbefalinger",
    getRecommendations: "Få anbefalinger",
    confidence: "Tillit",
    noRecommendationsYet: "Ingen anbefalinger ennå",
    clickGetRecommendations: "Klikk 'Få anbefalinger' for å se AI-forslag",
    farmerInformation: "Bondeinformasjon",
    name: "Navn",
    experience: "Års erfaring",
    years: "år",
    userType: "Brukertype",
    mainGoal: "Hovedmål",
    preferredLanguage: "Foretrukket språk",
    location: "Plassering",
    notProvided: "Ikke oppgitt",
    soilInformation: "Jordinformasjon",
    texture: "Tekstur",

    // Solution Section
    faqs: "FAQ",
    faq1q: "Hvordan fungerer Agrilos AI-avlingsanbefaling?",
    faq1a:
      "Vår AI analyserer din jordtype, plassering, værmønstre og landbruksmål for å gi personlige avlingsanbefalinger som maksimerer avling og bærekraft.",
    faq2q: "Hvilke data bruker Agrilo til analyse?",
    faq2a:
      "Vi bruker jordsammensetningsdata, værmeldinger, historisk avlingsytelse, markedspriser og lokale landbrukspraksis for å generere nøyaktige anbefalinger.",
    faq3q: "Er Agrilo egnet for alle typer landbruk?",
    faq3a:
      "Ja! Agrilo fungerer for småskala familiebruk, store kommersielle operasjoner og alt i mellom. Våre anbefalinger tilpasser seg din spesifikke landbrukskontekst.",
    feature1: "AI-drevne avlingsanbefalinger",
    feature2: "Sanntids værintegrasjon",
    feature3: "Jordanalyse og kartlegging",
    feature4: "Flerspråklig støtte",
    feature5: "Presisjonslandbruksverktøy",
    aboutUsTitle: "Om Agrilo-plattformen",
    aboutUsDescription:
      "Agrilo er en revolusjonerende landbruksteknologiplattform som kombinerer kunstig intelligens, datavitenskap og presisjonslandbruk for å hjelpe bønder med å ta smartere beslutninger. Plattformen vår analyserer jordforhold, værmønstre og markeds trender for å gi personlige avlingsanbefalinger som maksimerer avling samtidig som den fremmer bærekraftig landbruk.",
    aboutUsMission:
      "Å styrke bønder over hele verden med AI-drevne landbruksinnsikter for en bærekraftig fremtid.",
    mission: "Oppdrag",

    // Auth Options Page
    createAccount: "Opprett konto",
    joinAgrilo: "Bli med Agrilo for å starte din smarte landbruksreise",
    signInToContinue: "Logg inn for å fortsette din landbruksreise",
    signIn: "Logg inn",
    signUp: "Registrer deg",
    fullName: "Fullt navn",
    enterFullName: "Skriv inn ditt fulle navn",
    emailAddress: "E-postadresse",
    enterEmailAddress: "Skriv inn din e-postadresse",
    password: "Passord",
    enterPassword: "Skriv inn ditt passord",
    confirmPassword: "Bekreft passord",
    confirmYourPassword: "Bekreft ditt passord",
    createAccountButton: "Opprett konto",
    signInButton: "Logg inn",
    newUserSetup: "Ny brukeroppsett",
    newUserSetupDesc:
      "Nye brukere vil gå gjennom en rask oppsettprosess for å tilpasse opplevelsen.",
    backToHome: "Tilbake til hjem",
    alreadyHaveAccount: "Har du allerede en konto?",
    dontHaveAccount: "Har du ikke en konto?",
    emailRequired: "E-post er påkrevd",
    invalidEmailFormat: "Ugyldig e-postformat",
    passwordRequired: "Passord er påkrevd",
    passwordMinLength: "Passord må være minst 6 tegn",
    nameRequired: "Navn er påkrevd",
    confirmPasswordRequired: "Vennligst bekreft passordet ditt",
    passwordsDoNotMatch: "Passordene matcher ikke",
    allFieldsRequired: "Alle felt er påkrevd",
    emailAndPasswordRequired: "E-post og passord er påkrevd",
    emailAlreadyRegistered:
      "Denne e-posten er allerede registrert. Vennligst logg inn i stedet.",
    signingIn: "Logger inn...",
    creatingAccount: "Oppretter konto...",
    createPassword: "Opprett et passord",

    // Chat Page
    aiAssistantWelcome:
      "Hallo! Jeg er din AI-landbruksassistent. Hvordan kan jeg hjelpe deg i dag? 🌱",
    aiAssistant: "AI-assistent",
    pleaseLoginToChat:
      "Vennligst logg inn for å starte chatting med AI-assistenten",
    connectionError:
      "Beklager, jeg har problemer med å koble til akkurat nå. Vennligst prøv igjen senere.",
    recording: "Spiller inn...",
    tapStopButton: "Trykk på den røde STOP-knappen",
    clickStopButton: "Klikk på den røde STOP-knappen",
    typeFarmingQuestion: "Skriv spørsmålet ditt om landbruk...",
    typeQuestionInLanguage: "Skriv spørsmålet ditt på {language}...",
    youreOffline: "Du er offline",
    stop: "STOPP",
    processing: "Behandler...",
    playing: "Spiller...",
    liveChat: "Live Chat",
    availableLanguages: "Tilgjengelige språk ({count})",
    quickQuestions: "Hurtigspørsmål",
    fertilizerForWheat: "Hvilken gjødsel for hvete?",
    fertilizerForWheatQuestion:
      "Hvilken gjødsel bør jeg bruke for hveteavlinger?",
    bestTimeToPlantRice: "Beste tid å plante ris",
    bestTimeToPlantRiceQuestion: "Når er beste tid å plante ris i min region?",
    naturalPestControl: "Naturlig skadedyrkontroll",
    naturalPestControlQuestion:
      "Hvordan kan jeg kontrollere skadedyr naturlig uten kjemikalier?",
    soilPhTesting: "Jord pH-testing",
    soilPhTestingQuestion: "Hva er de beste metodene for å teste jord pH?",
    irrigationTips: "Vanningstips",
    irrigationTipsQuestion:
      "Hva er de beste vanningstipsene for avlingene mine?",
    cropRotation: "Avlingsrotasjon",
    cropRotationQuestion:
      "Hva er fordelene med avlingsrotasjon og hvordan bør jeg planlegge det?",
    diseasePrevention: "Sykdomsforebygging",
    diseasePreventionQuestion:
      "Hvordan kan jeg forebygge vanlige avlingssykdommer?",
    weatherImpact: "Værpåvirkning",
    weatherImpactQuestion:
      "Hvordan påvirker været avlingsveksten min og hva bør jeg gjøre?",
    mediaRecorderNotSupported: "MediaRecorder støttes ikke i denne nettleseren",
    noSupportedAudioFormat: "Ingen støttet lydformat funnet",
    unknownError: "Ukjent feil",
    microphoneAccessError:
      "Feil ved tilgang til mikrofon: {error}. Vennligst sjekk tillatelser og prøv igjen.",
    audioProcessingError:
      "Beklager, jeg kunne ikke behandle lydmeldingen din. Vennligst prøv igjen eller skriv meldingen din.",
    speakMoreClearly:
      "Vennligst snakk tydeligere og prøv igjen. Sørg for at du er nær mikrofonen din.",
    noSpeechDetected:
      "Jeg hørte ingenting. Vennligst snakk høyere og prøv igjen.",
    unknownCrop: "ukjent avling",
    unknownIssues: "ukjente problemer",
    unknown: "ukjent",
    diagnosisMessageTemplate:
      "Jeg analyserte nettopp {crop} og fant {problems}. Avlingshelsen er {health} med {severity} alvorlighetsgrad. Kan du hjelpe meg å forstå hva dette betyr og hva jeg bør gjøre videre?",

    // Monitor Page
    cropMonitor: "🌱 Avlingsmonitor",
    addNewField: "+ Legg til nytt felt",
    healthDiagnosis: "🔬 Helsediagnose",
    treatmentTracker: "📊 Behandlingssporing",
    aiDiagnosisResult: "🔬 AI-diagnoseresultat",
    healthy: "Sunn",
    unhealthy: "Usunn",
    healthAssessment: "Helsevurdering:",
    severity: "Alvorlighetsgrad:",
    status: "Status:",
    cropAppearsHealthy: "Avling ser sunn ut",
    issuesDetected: "Problemer oppdaget",
    cropInformation: "Avlingsinformasjon:",
    crop: "Avling:",
    scheduleTreatment: "Planlegg behandling",
    viewSimilarCases: "Se lignende tilfeller",
    aiAnalysis: "AI-analyse:",
    healthScore: "Helsescore:",
    healthyProbability: "Sunn sannsynlighet:",
    uploadImage: "Last opp bilde",
    takePhoto: "Ta bilde",
    dragAndDropImage: "Dra og slipp et bilde hit, eller klikk for å velge",
    supportedFormats: "Støttede formater: JPG, PNG, WEBP",
    maxFileSize: "Maks filstørrelse: 10MB",
    analyzingImage: "Analyserer bilde...",
    uploadImageToAnalyze:
      "Last opp et bilde av avlingen din for å analysere helsen",
    noImageSelected: "Ingen bilde valgt",
    selectImageToAnalyze: "Velg et bilde å analysere",
    treatmentHistory: "Behandlingshistorikk",
    noTreatmentsYet: "Ingen behandlinger registrert ennå",
    addTreatment: "Legg til behandling",
    treatmentType: "Behandlingstype",
    field: "Felt",
    date: "Dato",
    applied: "Påført",
    upcoming: "Kommende",
    pending: "Venter",
    completed: "Fullført",
    fertilizer: "Gjødsel",
    pesticide: "Insektmiddel",
    irrigation: "Vanning",
    pruning: "Beskjæring",
    harvesting: "Innhøsting",
    other: "Annet",
    cropHealthDiagnosis: "Avlingshelsediagnose",
    uploadOrCaptureImages:
      "Last opp eller ta bilder av avlingen, blad eller jord for AI-analyse",
    useCamera: "Bruk kamera",
    fromGallery: "Fra galleri",

    // Calendar Page
    smartFarmingCalendar: "Smart Landbrukskalender",
    aiPoweredTaskManagement: "AI-drevet oppgaveadministrasjon og planlegging",
    refreshWeather: "Oppdater været",
    refreshing: "Oppdaterer...",
    weatherDataForLocation: "Værdata for din plassering: {location}",
    coordinates: "Koordinater: {lat}, {lon}",
    usingDefaultLocation: "Bruker standardplassering (Norge)",
    updateLocationSettings:
      "Vennligst oppdater plasseringen din i innstillinger for personlig værdata",
    loadingWeatherData: "Laster værdata...",
    weatherForecastLimited:
      "Merk: Værmelding er begrenset til 14 dager på grunn av API-begrensninger",
    dataCached: "💾 Data er cachet for raskere lasting",
    sun: "Søn",
    mon: "Man",
    tue: "Tir",
    wed: "Ons",
    thu: "Tor",
    fri: "Fre",
    sat: "Lør",
    january: "Januar",
    february: "Februar",
    march: "Mars",
    april: "April",
    may: "Mai",
    june: "Juni",
    july: "Juli",
    august: "August",
    september: "September",
    october: "Oktober",
    november: "November",
    december: "Desember",

    // Settings Page
    back: "Tilbake",
    profileSettings: "Profilinnstillinger",
    editProfile: "Rediger profil",
    cancel: "Avbryt",
    personalInformation: "Personlig informasjon",
    enterLocation: "Skriv inn plasseringen din (f.eks. koordinater eller by)",
    farmingExperience: "Landbrukserfaring",
    yearsOfExperience: "Års erfaring",
    cropsGrown: "Dyrkede avlinger",
    addCrop: "Legg til avling",
    cropName: "Avlingsnavn",
    current: "Nåværende",
    planned: "Planlagt",
    saveChanges: "Lagre endringer",
    changesSaved: "Endringer lagret!",
    errorSavingChanges: "Feil ved lagring av endringer. Vennligst prøv igjen.",
    selectFarmingExperience: "Vennligst velg din landbrukserfaring",
    selectYearsExperience: "Vennligst velg års erfaring",
    selectMainGoal: "Vennligst velg ditt hovedmål",

    // Calendar Page Additional
    loadAITasks: "Last AI-oppgaver",
    loadingAITasks: "Laster AI-oppgaver...",
    clearSky: "KLAR Himmel",

    // User Registration Page
    tellUsAboutFarming: "Fortell oss om jordbruket ditt",
    helpPersonalizeExperience: "Hjelp oss å tilpasse din opplevelse",
    aspiringFarmer: "Aspirerende bonde",
    beginnerFarmer: "Nybegynner (1-2 år)",
    experiencedFarmer: "Erfaren (3-5 år)",
    explorerFarmer: "Utforsker (5+ år)",
    increaseCropYield: "Øke avling",
    reduceFarmingCosts: "Redusere jordbrukskostnader",
    sustainableFarming: "Bærekraftig jordbruk",
    organicFarming: "Økologisk jordbruk",
    betterMarketAccess: "Bedre markedsadgang",
    noCropsSelected: "Ingen avlinger valgt",
    selectedCrops: "Valgte avlinger",
    continueToApp: "Fortsett til app",

    // Settings Page Additional
    farmingInformation: "Landbruksinformasjon",
    noCropsCurrentlyGrowing: "Ingen avlinger dyrkes for øyeblikket",
    noCropsPlanned: "Ingen avlinger planlagt",
    addNewCrop: "Legg til ny avling",
    year: "år",
    loadingProfile: "Laster profil...",
  },
  sw: {
    // Navigation
    products: "Bidhaa",
    solutions: "Suluhisho",
    aboutUs: "Kuhusu Sisi",
    letsContact: "Tuwasiliane",

    // Hero Section
    heroTitle: "Kuwawezesha Wakulima na Suluhisho za AI za Busara",
    heroSubtitle:
      "Agrilo inatoa artificial intelligence ya kisasa kukarabati mavuno, kusimamia rasilimali, na kutabiri mwelekeo wa soko kwa mustakabali wa endelevu na wa faida.",
    getStarted: "Anza",
    goToDashboard: "Nenda kwenye Dashibodi",
    learnMore: "Jifunze Zaidi",

    // Features Section
    keyFeatures: "Vipengele Muhimu",
    featuresSubtitle:
      "Suluhisho zetu za AI zimeundwa kushughulikia changamoto muhimu zaidi zinazowakabili wakulima wa kisasa.",
    precisionFarming: "Kilimo cha Usahihi",
    precisionFarmingDesc:
      "Boresha kupanda, umwagiliaji, na kuvuna kwa ufahamu unaoendeshwa na data.",
    diseaseDetection: "Ugunduzi wa Magonjwa",
    diseaseDetectionDesc:
      "Utambulishaji wa mapema wa magonjwa ya mazao na wadudu kudumisha hasara.",
    weatherPrediction: "Utabiri wa Hali ya Hewa",
    weatherPredictionDesc:
      "Utabiri sahihi wa hali ya hewa ya ndani kupanga shughuli za kilimo kwa ufanisi.",
    marketAnalysis: "Uchambuzi wa Soko",
    marketAnalysisDesc:
      "Tahmini bei za soko na mahitaji kufanya maamuzi ya uuzaji yenye ufahamu.",
    resourceOptimization: "Boresha Rasilimali",
    resourceOptimizationDesc:
      "Simamia maji, mbolea, na matumizi ya nishati kwa ufanisi.",
    sustainablePractices: "Mazoea Endelevu",
    sustainablePracticesDesc:
      "Kuendeleza mbinu za kilimo zinazofaa mazingira kwa afya ya muda mrefu ya mazingira.",

    // Language Selection
    selectLanguage: "Chagua Lugha",
    chooseYourLanguage: "Chagua lugha unayopendelea",
    continue: "Endelea",

    // About Section
    about_Us: "Kuhusu Sisi",
    aboutDescription:
      "Katika Agrilo, tunamini nguvu ya teknolojia kubadilisha kilimo. Timu yetu ya wataalam wa AI, wataalam wa kilimo, na wanasayansi wa data wamejitolea kujenga zana za busara zinazowezesha wakulima kufanya maamuzi ya busara zaidi, kuongeza uzalishaji, na kukuza ukuaji endelevu. Tumejitolea kusaidia jamii ya kilimo ya ulimwengu kwa suluhisho za uvumbuzi na zinazopatikana.",

    // Main Page Navigation
    home: "Nyumbani",
    monitor: "Fuatilia",
    chat: "Ongea",
    calendar: "Kalenda",
    profile: "Wasifu",

    // Main Page Content
    farmManagement: "Usimamizi wa Shamba",
    quickActions: "Vitendo vya Haraka",
    cropDiagnosis: "Uchambuzi wa Mazao",
    askAIExpert: "Uliza Mtaalam wa AI",
    systemOnline: "Mfumo Unaendeshwa",
    pendingNotifications: "arifa zinazosubiri",
    dashboard: "Dashibodi",
    loading: "Inapakia...",

    // Alert Messages
    pestAlert:
      "🚨 AI imegundua shughuli za wadudu katika Shamba A. Panga ukaguzi leo!",

    // User Info
    locationNotSet: "Mahali haijatengwa",
    user: "Mtumiaji",

    // Home Page
    welcomeBack: "Karibu Tena",
    farmer: "Mkulima",
    yourVirtualFarmland: "Shamba lako la kimahesabu linakusubiri",
    yourCrops: "Mazao Yako",
    currentlyGrowing: "Inakua Sasa",
    planningToGrow: "Inapanga Kukua",
    noCropsYet: "Hakuna mazao yaliyoongezwa bado",
    addCropsToGetStarted: "Ongeza mazao kuanza",
    noCurrentCrops: "Hakuna mazao ya sasa",
    addCurrentCropsToGetStarted: "Ongeza mazao ya sasa kuanza",
    noPlannedCrops: "Hakuna mazao yaliyopangwa",
    addPlannedCropsToGetStarted: "Ongeza mazao yaliyopangwa kuanza",
    yourLocation: "Mahali Pako",
    detailedView: "Mtazamo wa Maelezo",
    satellite: "Satelaiti",
    roadmap: "Ramani ya Barabara",
    loadingDetailedView: "Inapakia mtazamo wa maelezo...",
    loadingMap: "Inapakia ramani...",
    satelliteView: "🛰️ Mtazamo wa Satelaiti",
    roadmapView: "🗺️ Mtazamo wa Ramani ya Barabara",
    highDetailFarmView: "Mtazamo wa Shamba wa Juu-Maelezo:",
    exploreFarmLocation:
      "Chunguza eneo la shamba lako kwa maelezo ya juu zaidi.",
    aerialImagery: "Picha za anga",
    standardMapView: "Mtazamo wa ramani wa kawaida",
    fertilizerRecommendations: "Ushauri wa Mbolea",
    enterCropName: "Weka jina la mazao (mfano: mahindi, ngano, mchele)",
    getFertilizerPlan: "Pata Mpango wa Mbolea",
    enterCropNameAndClick:
      'Weka jina la mazao na bonyeza "Pata Mpango wa Mbolea" kupata ushauri',
    cropExamples: "Mifano: mahindi, ngano, mchele, maharagwe, nyanya",
    mapPlaceholder: "Ramani itaonyeshwa hapa",
    aiCropRecommendations: "Ushauri wa Mazao wa AI",
    getRecommendations: "Pata Ushauri",
    confidence: "Uaminifu",
    noRecommendationsYet: "Hakuna ushauri bado",
    clickGetRecommendations: "Bonyeza 'Pata Ushauri' kuona mapendekezo ya AI",
    farmerInformation: "Maelezo ya Mkulima",
    name: "Jina",
    experience: "Miaka ya Uzoefu",
    years: "miaka",
    userType: "Aina ya Mtumiaji",
    mainGoal: "Lengo Kuu",
    preferredLanguage: "Lugha Inayopendelewa",
    location: "Mahali",
    notProvided: "Haijatolewa",
    soilInformation: "Maelezo ya Udongo",
    texture: "Muundo",

    // Solution Section
    faqs: "Maswali Yanayoulizwa Sana",
    faq1q: "Je, ushauri wa mazao wa AI wa Agrilo unafanyaje kazi?",
    faq1a:
      "AI yetu inachambua aina yako ya udongo, eneo, muundo wa hali ya hewa, na malengo ya kilimo kutoa ushauri wa mazao wa kibinafsi ambao huongeza mavuno na uendelevu.",
    faq2q: "Je, Agrilo inatumia data gani kwa uchambuzi?",
    faq2a:
      "Tunatumia data ya muundo wa udongo, utabiri wa hali ya hewa, utendaji wa mazao wa kihistoria, bei za soko, na mazoea ya kilimo ya ndani kutoa ushauri sahihi.",
    faq3q: "Je, Agrilo inafaa kwa aina zote za kilimo?",
    faq3a:
      "Ndiyo! Agrilo inafanya kazi kwa mashamba ya familia ya kiwango kidogo, shughuli za kibiashara kubwa, na kila kitu katikati. Ushauri wetu unajifunza kwa mazingira yako maalum ya kilimo.",
    feature1: "Ushauri wa Mazao Unaendeshwa na AI",
    feature2: "Muunganisho wa Hali ya Hewa ya Wakati Halisi",
    feature3: "Uchambuzi wa Udongo na Ramani",
    feature4: "Msaada wa Lugha Nyingi",
    feature5: "Zana za Kilimo cha Usahihi",
    aboutUsTitle: "Kuhusu Jukwaa la Agrilo",
    aboutUsDescription:
      "Agrilo ni jukwaa la teknolojia ya kilimo la mapinduzi ambalo linaunganisha akili ya bandia, sayansi ya data, na kilimo cha usahihi kusaidia wakulima kufanya maamuzi ya busara zaidi. Jukwaa letu linachambua hali ya udongo, muundo wa hali ya hewa, na mwelekeo wa soko kutoa ushauri wa mazao wa kibinafsi ambao huongeza mavuno wakati wa kuendeleza mazoea ya kilimo endelevu.",
    aboutUsMission:
      "Kuwawezesha wakulima ulimwenguni kote na ufahamu wa kilimo unaoendeshwa na AI kwa mustakabali endelevu.",
    mission: "Dhamira",

    // Auth Options Page
    createAccount: "Unda Akaunti",
    joinAgrilo: "Jiunge na Agrilo kuanza safari yako ya kilimo cha busara",
    signInToContinue: "Ingia kuendelea na safari yako ya kilimo",
    signIn: "Ingia",
    signUp: "Jisajili",
    fullName: "Jina Kamili",
    enterFullName: "Weka jina lako kamili",
    emailAddress: "Anwani ya Barua Pepe",
    enterEmailAddress: "Weka anwani yako ya barua pepe",
    password: "Nywila",
    enterPassword: "Weka nywila yako",
    confirmPassword: "Thibitisha Nywila",
    confirmYourPassword: "Thibitisha nywila yako",
    createAccountButton: "Unda Akaunti",
    signInButton: "Ingia",
    newUserSetup: "Mpangilio wa Mtumiaji Mpya",
    newUserSetupDesc:
      "Watumiaji wapya watapitia mchakato wa haraka wa kujipangilia ili kufanya uzoefu wao wa kibinafsi.",
    backToHome: "Rudi Nyumbani",
    alreadyHaveAccount: "Una akaunti tayari?",
    dontHaveAccount: "Huna akaunti?",
    emailRequired: "Barua pepe inahitajika",
    invalidEmailFormat: "Muundo wa barua pepe si sahihi",
    passwordRequired: "Nywila inahitajika",
    passwordMinLength: "Nywila lazima iwe na herufi 6 angalau",
    nameRequired: "Jina linahitajika",
    confirmPasswordRequired: "Tafadhali thibitisha nywila yako",
    passwordsDoNotMatch: "Nywila hazifanani",
    allFieldsRequired: "Sehemu zote zinahitajika",
    emailAndPasswordRequired: "Barua pepe na nywila zinahitajika",
    emailAlreadyRegistered:
      "Barua pepe hii imeshasajiliwa. Tafadhali ingia badala yake.",
    signingIn: "Inaingia...",
    creatingAccount: "Inaunda akaunti...",
    createPassword: "Unda nywila",

    // Chat Page
    aiAssistantWelcome:
      "Hujambo! Mimi ni msaidizi wako wa AI wa kilimo. Ninawezaje kukusaidia leo? 🌱",
    aiAssistant: "Msaidizi wa AI",
    pleaseLoginToChat: "Tafadhali ingia kuanza kuzungumza na msaidizi wa AI",
    connectionError:
      "Samahani, nina shida ya kuunganisha sasa. Tafadhali jaribu tena baadaye.",
    recording: "Inarekodi...",
    tapStopButton: "Gusa kitufe cha nyekundu cha STOP",
    clickStopButton: "Bofya kitufe cha nyekundu cha STOP",
    typeFarmingQuestion: "Andika swali lako la kilimo...",
    typeQuestionInLanguage: "Andika swali lako kwa {language}...",
    youreOffline: "Uko nje ya mtandao",
    stop: "SIMAMISHA",
    processing: "Inachakata...",
    playing: "Inacheza...",
    liveChat: "Mazungumzo ya Moja kwa Moja",
    availableLanguages: "Lugha Zinazopatikana ({count})",
    quickQuestions: "Maswali ya Haraka",
    fertilizerForWheat: "Mbolea gani kwa ngano?",
    fertilizerForWheatQuestion:
      "Mbolea gani ninapaswa kutumia kwa mazao ya ngano?",
    bestTimeToPlantRice: "Wakati bora wa kupanda mchele",
    bestTimeToPlantRiceQuestion:
      "Lini ni wakati bora wa kupanda mchele katika eneo langu?",
    naturalPestControl: "Udhibiti wa wadudu wa asili",
    naturalPestControlQuestion:
      "Ninawezaje kudhibiti wadudu kwa njia ya asili bila kemikali?",
    soilPhTesting: "Kupima pH ya udongo",
    soilPhTestingQuestion: "Je, ni njia bora za kupima pH ya udongo?",
    irrigationTips: "Vidokezo vya umwagiliaji",
    irrigationTipsQuestion:
      "Je, ni vidokezo bora vya ratiba ya umwagiliaji kwa mazao yangu?",
    cropRotation: "Mzunguko wa mazao",
    cropRotationQuestion:
      "Je, ni faida za mzunguko wa mazao na ninapaswa kuipanga vipi?",
    diseasePrevention: "Kuzuia magonjwa",
    diseasePreventionQuestion:
      "Ninawezaje kuzuia magonjwa ya kawaida ya mazao?",
    weatherImpact: "Athari ya hali ya hewa",
    weatherImpactQuestion:
      "Hali ya hewa inaathiri vipi ukuaji wa mazao yangu na ninapaswa kufanya nini?",
    mediaRecorderNotSupported: "MediaRecorder haionekani katika browser hii",
    noSupportedAudioFormat:
      "Hakuna muundo wa sauti unaoungwa mkono uliopatikana",
    unknownError: "Hitilafu isiyojulikana",
    microphoneAccessError:
      "Hitilafu ya kufikia kipaza sauti: {error}. Tafadhali angalia ruhusa na jaribu tena.",
    audioProcessingError:
      "Samahani, siwezi kuchakata ujumbe wako wa sauti. Tafadhali jaribu tena au andika ujumbe wako.",
    speakMoreClearly:
      "Tafadhali ongea kwa uwazi zaidi na jaribu tena. Hakikisha uko karibu na kipaza sauti chako.",
    noSpeechDetected:
      "Sikusikia chochote. Tafadhali ongea kwa sauti kubwa zaidi na jaribu tena.",
    unknownCrop: "mazao yasiyojulikana",
    unknownIssues: "masuala yasiyojulikana",
    unknown: "asiyojulikana",
    diagnosisMessageTemplate:
      "Nilichambua {crop} yangu na nikapata {problems}. Afya ya mazao ni {health} na ukali wa {severity}. Unaweza kunisaidia kuelewa hii inamaanisha nini na ninapaswa kufanya nini baadaye?",

    // Monitor Page
    cropMonitor: "🌱 Mfuatiliaji wa Mazao",
    addNewField: "+ Ongeza Shamba Jipya",
    healthDiagnosis: "🔬 Uchambuzi wa Afya",
    treatmentTracker: "📊 Mfuatiliaji wa Matibabu",
    aiDiagnosisResult: "🔬 Matokeo ya Uchambuzi wa AI",
    healthy: "Mwenye Afya",
    unhealthy: "Asiyo na Afya",
    healthAssessment: "Tathmini ya Afya:",
    severity: "Ukali:",
    status: "Hali:",
    cropAppearsHealthy: "Mazao Yanaonekana Yana Afya",
    issuesDetected: "Masuala Yamegunduliwa",
    cropInformation: "Maelezo ya Mazao:",
    crop: "Mazao:",
    scheduleTreatment: "Panga Matibabu",
    viewSimilarCases: "Tazama Kesi Zinazofanana",
    aiAnalysis: "Uchambuzi wa AI:",
    healthScore: "Alama ya Afya:",
    healthyProbability: "Uwezekano wa Afya:",
    uploadImage: "Pakia Picha",
    takePhoto: "Piga Picha",
    dragAndDropImage: "Buruta na uangushe picha hapa, au bofya kuchagua",
    supportedFormats: "Muundo unaoungwa mkono: JPG, PNG, WEBP",
    maxFileSize: "Ukubwa wa juu wa faili: 10MB",
    analyzingImage: "Inachambua picha...",
    uploadImageToAnalyze: "Pakia picha ya mazao yako kuchambua afya yake",
    noImageSelected: "Hakuna picha iliyochaguliwa",
    selectImageToAnalyze: "Chagua picha ya kuchambua",
    treatmentHistory: "Historia ya Matibabu",
    noTreatmentsYet: "Hakuna matibabu yaliyorekodiwa bado",
    addTreatment: "Ongeza Matibabu",
    treatmentType: "Aina ya Matibabu",
    field: "Shamba",
    date: "Tarehe",
    applied: "Iliyotumika",
    upcoming: "Inayokuja",
    pending: "Inayosubiri",
    completed: "Imekamilika",
    fertilizer: "Mbolea",
    pesticide: "Dawa ya wadudu",
    irrigation: "Umwagiliaji",
    pruning: "Kupogoa",
    harvesting: "Kuvuna",
    other: "Nyingine",
    cropHealthDiagnosis: "Uchambuzi wa Afya ya Mazao",
    uploadOrCaptureImages:
      "Pakia au upige picha za mazao, majani au udongo kwa uchambuzi wa AI",
    useCamera: "Tumia kamera",
    fromGallery: "Kutoka kwenye galeria",

    // Calendar Page
    smartFarmingCalendar: "Kalenda ya Kilimo cha Busara",
    aiPoweredTaskManagement: "Usimamizi wa kazi unaoendeshwa na AI na upangaji",
    refreshWeather: "Onyesha Hali ya Hewa",
    refreshing: "Inaonyesha...",
    weatherDataForLocation: "Data ya hali ya hewa kwa eneo lako: {location}",
    coordinates: "Viweko: {lat}, {lon}",
    usingDefaultLocation: "Inatumia eneo la kawaida (Tanzania)",
    updateLocationSettings:
      "Tafadhali sasisha eneo lako katika mipangilio kwa data ya hali ya hewa ya kibinafsi",
    loadingWeatherData: "Inapakia data ya hali ya hewa...",
    weatherForecastLimited:
      "Kumbuka: Utabiri wa hali ya hewa umepunguzwa hadi siku 14 kwa sababu ya vikwazo vya API",
    dataCached: "💾 Data imehifadhiwa kwa upakiaji wa haraka",
    sun: "Jumapili",
    mon: "Jumatatu",
    tue: "Jumanne",
    wed: "Jumatano",
    thu: "Alhamisi",
    fri: "Ijumaa",
    sat: "Jumamosi",
    january: "Januari",
    february: "Februari",
    march: "Machi",
    april: "Aprili",
    may: "Mei",
    june: "Juni",
    july: "Juli",
    august: "Agosti",
    september: "Septemba",
    october: "Oktoba",
    november: "Novemba",
    december: "Desemba",

    // Settings Page
    back: "Rudi Nyuma",
    profileSettings: "Mipangilio ya Wasifu",
    editProfile: "Hariri Wasifu",
    cancel: "Ghairi",
    personalInformation: "Maelezo ya Kibinafsi",
    enterLocation: "Weka eneo lako (kwa mfano, viweko au jiji)",
    farmingExperience: "Uzoefu wa Kilimo",
    yearsOfExperience: "Miaka ya Uzoefu",
    cropsGrown: "Mazao Yanayolimwa",
    addCrop: "Ongeza Mazao",
    cropName: "Jina la Mazao",
    current: "Sasa",
    planned: "Iliyopangwa",
    saveChanges: "Hifadhi Mabadiliko",
    changesSaved: "Mabadiliko yamehifadhiwa!",
    errorSavingChanges:
      "Hitilafu ya kuhifadhi mabadiliko. Tafadhali jaribu tena.",
    selectFarmingExperience: "Tafadhali chagua uzoefu wako wa kilimo",
    selectYearsExperience: "Tafadhali chagua miaka ya uzoefu",
    selectMainGoal: "Tafadhali chagua lengo lako kuu",

    // Calendar Page Additional
    loadAITasks: "Pakia Kazi za AI",
    loadingAITasks: "Inapakia Kazi za AI...",
    clearSky: "ANGA WAZURI",

    // User Registration Page
    tellUsAboutFarming: "Tuambie Kuhusu Kilimo Chako",
    helpPersonalizeExperience: "Tusaidie kuiboresha uzoefu wako",
    aspiringFarmer: "Mkulima wa Kujitahidi",
    beginnerFarmer: "Mwanzo (miaka 1-2)",
    experiencedFarmer: "Mwenye Uzoefu (miaka 3-5)",
    explorerFarmer: "Mtafiti (miaka 5+)",
    increaseCropYield: "Kuongeza Mavuno",
    reduceFarmingCosts: "Kupunguza Gharama za Kilimo",
    sustainableFarming: "Kilimo Endelevu",
    organicFarming: "Kilimo cha Asili",
    betterMarketAccess: "Ufikiaji Bora wa Soko",
    noCropsSelected: "Hakuna mazao yaliyochaguliwa",
    selectedCrops: "Mazao yaliyochaguliwa",
    continueToApp: "Endelea kwenye Programu",

    // Settings Page Additional
    farmingInformation: "Maelezo ya Kilimo",
    noCropsCurrentlyGrowing: "Hakuna mazao yanayokulima kwa sasa",
    noCropsPlanned: "Hakuna mazao yaliyopangwa",
    addNewCrop: "Ongeza Zao Mpya",
    year: "mwaka",
    loadingProfile: "Inapakia wasifu...",
  },
  es: {
    // Navigation
    products: "Productos",
    solutions: "Soluciones",
    aboutUs: "Sobre Nosotros",
    letsContact: "Contáctanos",

    // Hero Section
    heroTitle:
      "Empoderando a los Agricultores con Soluciones Inteligentes de IA",
    heroSubtitle:
      "Agrilo proporciona inteligencia artificial de vanguardia para optimizar rendimientos de cultivos, gestionar recursos y predecir tendencias del mercado para un futuro más sostenible y rentable.",
    getStarted: "Comenzar",
    goToDashboard: "Ir al Panel de Control",
    learnMore: "Saber Más",

    // Features Section
    keyFeatures: "Características Clave",
    featuresSubtitle:
      "Nuestras soluciones de IA están diseñadas para abordar los desafíos más apremiantes que enfrentan los agricultores modernos.",
    precisionFarming: "Agricultura de Precisión",
    precisionFarmingDesc:
      "Optimiza la siembra, riego y cosecha con información basada en datos.",
    diseaseDetection: "Detección de Enfermedades",
    diseaseDetectionDesc:
      "Identificación temprana de enfermedades de cultivos y plagas para minimizar pérdidas.",
    weatherPrediction: "Predicción del Clima",
    weatherPredictionDesc:
      "Pronósticos meteorológicos localizados precisos para planificar actividades agrícolas efectivamente.",
    marketAnalysis: "Análisis de Mercado",
    marketAnalysisDesc:
      "Predice precios del mercado y demanda para tomar decisiones de venta informadas.",
    resourceOptimization: "Optimización de Recursos",
    resourceOptimizationDesc:
      "Gestiona eficientemente el consumo de agua, fertilizantes y energía.",
    sustainablePractices: "Prácticas Sostenibles",
    sustainablePracticesDesc:
      "Promueve métodos agrícolas respetuosos con el medio ambiente para la salud ambiental a largo plazo.",

    // Language Selection
    selectLanguage: "Seleccionar Idioma",
    chooseYourLanguage: "Elige tu idioma preferido",
    continue: "Continuar",

    // About Section
    about_Us: "Sobre Nosotros",
    aboutDescription:
      "En Agrilo, creemos en el poder de la tecnología para transformar la agricultura. Nuestro equipo de especialistas en IA, agrónomos y científicos de datos están dedicados a construir herramientas inteligentes que empoderen a los agricultores para tomar decisiones más inteligentes, aumentar la productividad y fomentar el crecimiento sostenible. Estamos comprometidos a apoyar a la comunidad agrícola global con soluciones innovadoras y accesibles.",

    // Main Page Navigation
    home: "Inicio",
    monitor: "Monitorear",
    chat: "Chat",
    calendar: "Calendario",
    profile: "Perfil",

    // Main Page Content
    farmManagement: "Gestión de Finca",
    quickActions: "Acciones Rápidas",
    cropDiagnosis: "Diagnóstico de Cultivos",
    askAIExpert: "Preguntar al Experto IA",
    systemOnline: "Sistema En Línea",
    pendingNotifications: "notificaciones pendientes",
    dashboard: "Panel de Control",
    loading: "Cargando...",

    // Alert Messages
    pestAlert:
      "🚨 IA detectó actividad potencial de plagas en Campo A. ¡Programa inspección hoy!",

    // User Info
    locationNotSet: "Ubicación no establecida",
    user: "Usuario",

    // Home Page
    welcomeBack: "Bienvenido de Vuelta",
    farmer: "Agricultor",
    yourVirtualFarmland: "Tu terreno agrícola virtual te espera",
    yourCrops: "Tus Cultivos",
    currentlyGrowing: "Cultivando Actualmente",
    planningToGrow: "Planificando Cultivar",
    noCropsYet: "Aún no se han agregado cultivos",
    addCropsToGetStarted: "Agrega cultivos para comenzar",
    noCurrentCrops: "No hay cultivos actuales",
    addCurrentCropsToGetStarted: "Agrega cultivos actuales para comenzar",
    noPlannedCrops: "No hay cultivos planificados",
    addPlannedCropsToGetStarted: "Agrega cultivos planificados para comenzar",
    yourLocation: "Tu Ubicación",
    detailedView: "Vista Detallada",
    satellite: "Satélite",
    roadmap: "Mapa de Carreteras",
    loadingDetailedView: "Cargando vista detallada...",
    loadingMap: "Cargando mapa...",
    satelliteView: "🛰️ Vista de Satélite",
    roadmapView: "🗺️ Vista de Mapa de Carreteras",
    highDetailFarmView: "Vista de Finca de Alto Detalle:",
    exploreFarmLocation: "Explora la ubicación de tu finca con máximo detalle.",
    aerialImagery: "Imágenes aéreas",
    standardMapView: "Vista de mapa estándar",
    fertilizerRecommendations: "Recomendaciones de Fertilizantes",
    enterCropName: "Ingresa nombre del cultivo (ej. maíz, trigo, arroz)",
    getFertilizerPlan: "Obtener Plan de Fertilizantes",
    enterCropNameAndClick:
      'Ingresa un nombre de cultivo y haz clic en "Obtener Plan de Fertilizantes" para obtener recomendaciones',
    cropExamples: "Ejemplos: maíz, trigo, arroz, frijoles, tomates",
    mapPlaceholder: "El mapa se mostrará aquí",
    aiCropRecommendations: "Recomendaciones de Cultivos IA",
    getRecommendations: "Obtener Recomendaciones",
    confidence: "Confianza",
    noRecommendationsYet: "Aún no hay recomendaciones",
    clickGetRecommendations:
      "Haz clic en 'Obtener Recomendaciones' para ver sugerencias de IA",
    farmerInformation: "Información del Agricultor",
    name: "Nombre",
    experience: "Años de Experiencia",
    years: "años",
    userType: "Tipo de Usuario",
    mainGoal: "Objetivo Principal",
    preferredLanguage: "Idioma Preferido",
    location: "Ubicación",
    notProvided: "No proporcionado",
    soilInformation: "Información del Suelo",
    texture: "Textura",

    // Auth Options Page
    createAccount: "Crear Cuenta",
    joinAgrilo:
      "Únete a Agrilo para comenzar tu viaje de agricultura inteligente",
    signInToContinue: "Inicia sesión para continuar tu viaje agrícola",
    signIn: "Iniciar Sesión",
    signUp: "Registrarse",
    fullName: "Nombre Completo",
    enterFullName: "Ingresa tu nombre completo",
    emailAddress: "Dirección de Correo",
    enterEmailAddress: "Ingresa tu dirección de correo",
    password: "Contraseña",
    enterPassword: "Ingresa tu contraseña",
    confirmPassword: "Confirmar Contraseña",
    confirmYourPassword: "Confirma tu contraseña",
    createAccountButton: "Crear Cuenta",
    signInButton: "Iniciar Sesión",
    newUserSetup: "Configuración de Usuario Nuevo",
    newUserSetupDesc:
      "Los usuarios nuevos pasarán por un proceso de configuración rápida para personalizar su experiencia.",
    backToHome: "Volver al Inicio",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    dontHaveAccount: "¿No tienes una cuenta?",
    emailRequired: "El correo es requerido",
    invalidEmailFormat: "Formato de correo inválido",
    passwordRequired: "La contraseña es requerida",
    passwordMinLength: "La contraseña debe tener al menos 6 caracteres",
    nameRequired: "El nombre es requerido",
    confirmPasswordRequired: "Por favor confirma tu contraseña",
    passwordsDoNotMatch: "Las contraseñas no coinciden",
    allFieldsRequired: "Todos los campos son obligatorios",
    emailAndPasswordRequired:
      "El correo electrónico y la contraseña son obligatorios",
    emailAlreadyRegistered:
      "Este correo electrónico ya está registrado. Por favor, inicia sesión en su lugar.",
    signingIn: "Iniciando sesión...",
    creatingAccount: "Creando cuenta...",
    createPassword: "Crear contraseña",

    // Chat Page
    aiAssistantWelcome:
      "Hola! Soy tu asistente de agricultura de IA. ¿Cómo te puedo ayudar hoy? 🌱",
    aiAssistant: "Asistente de IA",
    pleaseLoginToChat:
      "Por favor, inicia sesión para empezar a chatear con el asistente de IA",
    connectionError:
      "Lo siento, tengo problemas para conectarse en este momento. Por favor, inténtalo de nuevo más tarde.",
    recording: "Grabando...",
    tapStopButton: "Presiona el botón rojo de STOP",
    clickStopButton: "Haz clic en el botón rojo de STOP",
    typeFarmingQuestion: "Escribe tu pregunta sobre agricultura...",
    typeQuestionInLanguage: "Escribe tu pregunta en {language}...",
    youreOffline: "Estás desconectado",
    stop: "DETENER",
    processing: "Procesando...",
    playing: "Reproduciendo...",
    liveChat: "Chat en vivo",
    availableLanguages: "Idiomas disponibles ({count})",
    quickQuestions: "Preguntas rápidas",
    fertilizerForWheat: "¿Qué fertilizante para trigo?",
    fertilizerForWheatQuestion: "¿Qué fertilizante debería usar para trigo?",
    bestTimeToPlantRice: "Mejor tiempo para plantar arroz",
    bestTimeToPlantRiceQuestion:
      "¿Cuándo es el mejor tiempo para plantar arroz en mi región?",
    naturalPestControl: "Control natural de plagas",
    naturalPestControlQuestion: "¿Cómo puedo controlar plagas sin químicos?",
    soilPhTesting: "Prueba de pH del suelo",
    soilPhTestingQuestion:
      "¿Cuáles son los mejores métodos para probar el pH del suelo?",
    irrigationTips: "Consejos de riego",
    irrigationTipsQuestion:
      "¿Cuáles son los mejores consejos de programación de riego para mis cultivos?",
    cropRotation: "Rotación de cultivos",
    cropRotationQuestion:
      "¿Cuáles son las ventajas de la rotación de cultivos y cómo debería planearlo?",
    diseasePrevention: "Prevención de enfermedades",
    diseasePreventionQuestion:
      "¿Cómo puedo prevenir enfermedades comunes en cultivos?",
    weatherImpact: "Efecto del clima",
    weatherImpactQuestion:
      "¿Cómo afecta el clima mi crecimiento de cultivos y qué debería hacer?",
    mediaRecorderNotSupported: "MediaRecorder no soportado en este navegador",
    noSupportedAudioFormat: "No se encontró formato de audio compatible",
    unknownError: "Error desconocido",
    microphoneAccessError:
      "Error al acceder al micrófono: {error}. Por favor, comprueba los permisos y vuelve a intentarlo.",
    audioProcessingError:
      "Lo siento, no pude procesar tu mensaje de audio. Por favor, inténtalo de nuevo o escribe tu mensaje.",
    speakMoreClearly:
      "Por favor, habla más claramente y vuelve a intentarlo. Asegúrate de estar cerca del micrófono.",
    noSpeechDetected:
      "No escuché nada. Por favor, habla más alto y vuelve a intentarlo.",
    unknownCrop: "cultivo desconocido",
    unknownIssues: "problemas desconocidos",
    unknown: "desconocido",
    diagnosisMessageTemplate:
      "Acabo de analizar mi {crop} y encontré {problems}. La salud del cultivo es {health} con {severity} gravedad. ¿Puedes ayudarme a entender qué significa esto y qué debería hacer a continuación?",

    // Monitor Page
    cropMonitor: "🌱 Monitor de Cultivos",
    addNewField: "+ Añadir nuevo campo",
    healthDiagnosis: "🔬 Diagnóstico de Salud",
    treatmentTracker: "📊 Seguimiento de Tratamiento",
    aiDiagnosisResult: "🔬 Resultado de Diagnóstico de IA",
    healthy: "Saludable",
    unhealthy: "No saludable",
    healthAssessment: "Evaluación de Salud:",
    severity: "Gravedad:",
    status: "Estado:",
    cropAppearsHealthy: "El cultivo parece saludable",
    issuesDetected: "Problemas detectados",
    cropInformation: "Información del Cultivo:",
    crop: "Cultivo:",
    scheduleTreatment: "Programar Tratamiento",
    viewSimilarCases: "Ver Casos Similares",
    aiAnalysis: "Análisis de IA:",
    healthScore: "Puntuación de Salud:",
    healthyProbability: "Probabilidad de Salud:",
    uploadImage: "Subir Imagen",
    takePhoto: "Tomar Foto",
    dragAndDropImage:
      "Arrastra y suelta una imagen aquí, o haz clic para seleccionar",
    supportedFormats: "Formatos admitidos: JPG, PNG, WEBP",
    maxFileSize: "Tamaño máximo del archivo: 10MB",
    analyzingImage: "Analizando imagen...",
    uploadImageToAnalyze:
      "Subir una imagen de tu cultivo para analizar su salud",
    noImageSelected: "No se seleccionó ninguna imagen",
    selectImageToAnalyze: "Seleccionar una imagen para analizar",
    treatmentHistory: "Historial de Tratamiento",
    noTreatmentsYet: "No se han registrado tratamientos todavía",
    addTreatment: "Añadir Tratamiento",
    treatmentType: "Tipo de Tratamiento",
    field: "Campo",
    date: "Fecha",
    applied: "Aplicado",
    upcoming: "Próximo",
    pending: "Pendiente",
    completed: "Completado",
    fertilizer: "Fertilizante",
    pesticide: "Insecticida",
    irrigation: "Riego",
    pruning: "Podado",
    harvesting: "Cosecha",
    other: "Otro",
    cropHealthDiagnosis: "Diagnóstico de Salud del Cultivo",
    uploadOrCaptureImages:
      "Subir o capturar imágenes de tu cultivo, hoja o suelo para análisis",
    useCamera: "Usar cámara",
    fromGallery: "Desde galería",

    // Calendar Page
    smartFarmingCalendar: "Calendario de Agricultura Inteligente",
    aiPoweredTaskManagement:
      "Administración de Tareas y Programación de Agricultura",
    refreshWeather: "Actualizar Clima",
    refreshing: "Actualizando...",
    weatherDataForLocation:
      "Datos meteorológicos para tu ubicación: {location}",
    coordinates: "Coordenadas: {lat}, {lon}",
    usingDefaultLocation: "Usando ubicación predeterminada (Etiopía)",
    updateLocationSettings:
      "Por favor, actualiza tus ajustes de ubicación en la configuración para datos meteorológicos personalizados",
    loadingWeatherData: "Cargando datos meteorológicos...",
    weatherForecastLimited:
      "Nota: El pronóstico meteorológico está limitado a 14 días debido a restricciones de API",
    dataCached: "💾 Datos almacenados para una carga más rápida",
    sun: "Sol",
    mon: "Lun",
    tue: "Mar",
    wed: "Mié",
    thu: "Jue",
    fri: "Vie",
    sat: "Sáb",
    january: "Enero",
    february: "Febrero",
    march: "Marzo",
    april: "Abril",
    may: "Mayo",
    june: "Junio",
    july: "Julio",
    august: "Agosto",
    september: "Septiembre",
    october: "Oktober",
    november: "Noviembre",
    december: "Diciembre",

    // Settings Page
    back: "Atrás",
    profileSettings: "Configuración de Perfil",
    editProfile: "Editar Perfil",
    cancel: "Cancelar",
    personalInformation: "Información Personal",
    enterLocation: "Introduce tu ubicación (coordenadas o ciudad)",
    farmingExperience: "Experiencia Agrícola",
    yearsOfExperience: "Años de Experiencia",
    cropsGrown: "Cultivos Cosechados",
    addCrop: "Añadir Cultivo",
    cropName: "Nombre del Cultivo",
    current: "Actual",
    planned: "Planificado",
    saveChanges: "Guardar Cambios",
    changesSaved: "Cambios guardados exitosamente!",
    errorSavingChanges:
      "Error al guardar cambios. Por favor, inténtalo de nuevo.",
    selectFarmingExperience: "Por favor, selecciona tu experiencia agrícola",
    selectYearsExperience: "Por favor, selecciona años de experiencia",
    selectMainGoal: "Por favor, selecciona tu objetivo principal",

    // Calendar Page Additional
    loadAITasks: "Cargar Tareas de IA",
    loadingAITasks: "Cargando Tareas de IA...",
    clearSky: "CIELO DESPEJADO",

    // User Registration Page
    tellUsAboutFarming: "Cuéntanos sobre tu agricultura",
    helpPersonalizeExperience: "Ayúdanos a personalizar tu experiencia",
    aspiringFarmer: "Agricultor aspirante",
    beginnerFarmer: "Principiante (1-2 años)",
    experiencedFarmer: "Experimentado (3-5 años)",
    explorerFarmer: "Explorador (5+ años)",
    increaseCropYield: "Aumentar rendimiento",
    reduceFarmingCosts: "Reducir costos agrícolas",
    sustainableFarming: "Agricultura sostenible",
    organicFarming: "Agricultura orgánica",
    betterMarketAccess: "Mejor acceso al mercado",
    noCropsSelected: "No hay cultivos seleccionados",
    selectedCrops: "Cultivos seleccionados",
    continueToApp: "Continuar a la app",

    // Settings Page Additional
    farmingInformation: "Información de Agricultura",
    noCropsCurrentlyGrowing: "No hay cultivos cultivándose actualmente",
    noCropsPlanned: "No hay cultivos planificados",
    addNewCrop: "Agregar Nuevo Cultivo",
    year: "año",
    loadingProfile: "Cargando perfil...",
  },
  id: {
    // Navigation
    products: "Produk",
    solutions: "Solusi",
    aboutUs: "Tentang Kami",
    letsContact: "Hubungi Kami",

    // Hero Section
    heroTitle: "Memberdayakan Petani dengan Solusi AI Cerdas",
    heroSubtitle:
      "Agrilo menyediakan artificial intelligence terkini untuk mengoptimalkan hasil panen, mengelola sumber daya, dan memprediksi tren pasar untuk masa depan yang lebih berkelanjutan dan menguntungkan.",
    getStarted: "Mulai",
    goToDashboard: "Pergi ke Dasbor",
    learnMore: "Pelajari Lebih Lanjut",

    // Features Section
    keyFeatures: "Fitur Utama",
    featuresSubtitle:
      "Solusi AI kami dirancang untuk mengatasi tantangan paling mendesak yang dihadapi petani modern.",
    precisionFarming: "Pertanian Presisi",
    precisionFarmingDesc:
      "Optimalkan penanaman, irigasi, dan panen dengan wawasan berbasis data.",
    diseaseDetection: "Deteksi Penyakit",
    diseaseDetectionDesc:
      "Identifikasi dini penyakit tanaman dan hama untuk meminimalkan kerugian.",
    weatherPrediction: "Prediksi Cuaca",
    weatherPredictionDesc:
      "Prakiraan cuaca lokal yang akurat untuk merencanakan aktivitas pertanian secara efektif.",
    marketAnalysis: "Analisis Pasar",
    marketAnalysisDesc:
      "Prediksi harga pasar dan permintaan untuk membuat keputusan penjualan yang informatif.",
    resourceOptimization: "Optimasi Sumber Daya",
    resourceOptimizationDesc:
      "Kelola konsumsi air, pupuk, dan energi secara efisien.",
    sustainablePractices: "Praktik Berkelanjutan",
    sustainablePracticesDesc:
      "Promosikan metode pertanian ramah lingkungan untuk kesehatan lingkungan jangka panjang.",

    // Language Selection
    selectLanguage: "Pilih Bahasa",
    chooseYourLanguage: "Pilih bahasa yang Anda sukai",
    continue: "Lanjutkan",

    // About Section
    about_Us: "Tentang Kami",
    aboutDescription:
      "Di Agrilo, kami percaya pada kekuatan teknologi untuk mengubah pertanian. Tim kami yang terdiri dari spesialis AI, agronom, dan ilmuwan data berdedikasi untuk membangun alat cerdas yang memberdayakan petani untuk membuat keputusan yang lebih cerdas, meningkatkan produktivitas, dan mendorong pertumbuhan berkelanjutan. Kami berkomitmen untuk mendukung komunitas pertanian global dengan solusi yang inovatif dan mudah diakses.",

    // Main Page Navigation
    home: "Beranda",
    monitor: "Monitor",
    chat: "Chat",
    calendar: "Kalender",
    profile: "Profil",

    // Main Page Content
    farmManagement: "Manajemen Pertanian",
    quickActions: "Aksi Cepat",
    cropDiagnosis: "Diagnosis Tanaman",
    askAIExpert: "Tanya Pakar AI",
    systemOnline: "Sistem Online",
    pendingNotifications: "notifikasi tertunda",
    dashboard: "Dasbor",
    loading: "Memuat...",

    // Alert Messages
    pestAlert:
      "🚨 AI mendeteksi aktivitas hama potensial di Ladang A. Jadwalkan inspeksi hari ini!",

    // User Info
    locationNotSet: "Lokasi belum diatur",
    user: "Pengguna",

    // Home Page
    welcomeBack: "Selamat Datang Kembali",
    farmer: "Petani",
    yourVirtualFarmland: "Lahan pertanian virtual Anda menanti",
    yourCrops: "Tanaman Anda",
    currentlyGrowing: "Sedang Ditanam",
    planningToGrow: "Merencanakan Menanam",
    noCropsYet: "Belum ada tanaman yang ditambahkan",
    addCropsToGetStarted: "Tambahkan tanaman untuk memulai",
    noCurrentCrops: "Tidak ada tanaman saat ini",
    addCurrentCropsToGetStarted: "Tambahkan tanaman saat ini untuk memulai",
    noPlannedCrops: "Tidak ada tanaman yang direncanakan",
    addPlannedCropsToGetStarted:
      "Tambahkan tanaman yang direncanakan untuk memulai",
    yourLocation: "Lokasi Anda",
    detailedView: "Tampilan Detail",
    satellite: "Satelit",
    roadmap: "Peta Jalan",
    loadingDetailedView: "Memuat tampilan detail...",
    loadingMap: "Memuat peta...",
    satelliteView: "🛰️ Tampilan Satelit",
    roadmapView: "🗺️ Tampilan Peta Jalan",
    highDetailFarmView: "Tampilan Lahan Pertanian Detail Tinggi:",
    exploreFarmLocation:
      "Jelajahi lokasi lahan pertanian Anda dengan detail maksimal.",
    aerialImagery: "Citra udara",
    standardMapView: "Tampilan peta standar",
    fertilizerRecommendations: "Rekomendasi Pupuk",
    enterCropName: "Masukkan nama tanaman (mis. jagung, gandum, beras)",
    getFertilizerPlan: "Dapatkan Rencana Pupuk",
    enterCropNameAndClick:
      'Masukkan nama tanaman dan klik "Dapatkan Rencana Pupuk" untuk mendapatkan rekomendasi',
    cropExamples: "Contoh: jagung, gandum, beras, kacang, tomat",
    mapPlaceholder: "Peta akan ditampilkan di sini",
    aiCropRecommendations: "Rekomendasi Tanaman AI",
    getRecommendations: "Dapatkan Rekomendasi",
    confidence: "Kepercayaan",
    noRecommendationsYet: "Belum ada rekomendasi",
    clickGetRecommendations:
      "Klik 'Dapatkan Rekomendasi' untuk melihat saran AI",
    farmerInformation: "Informasi Petani",
    name: "Nama",
    experience: "Tahun Pengalaman",
    years: "tahun",
    userType: "Jenis Pengguna",
    mainGoal: "Tujuan Utama",
    preferredLanguage: "Bahasa Pilihan",
    location: "Lokasi",
    notProvided: "Tidak disediakan",
    soilInformation: "Informasi Tanah",
    texture: "Tekstur",

    // Auth Options Page
    createAccount: "Buat Akun",
    joinAgrilo:
      "Bergabung dengan Agrilo untuk memulai perjalanan pertanian cerdas Anda",
    signInToContinue: "Masuk untuk melanjutkan perjalanan pertanian Anda",
    signIn: "Masuk",
    signUp: "Daftar",
    fullName: "Nama Lengkap",
    enterFullName: "Masukkan nama lengkap Anda",
    emailAddress: "Alamat Email",
    enterEmailAddress: "Masukkan alamat email Anda",
    password: "Kata Sandi",
    enterPassword: "Masukkan kata sandi Anda",
    confirmPassword: "Konfirmasi Kata Sandi",
    confirmYourPassword: "Konfirmasi kata sandi Anda",
    createAccountButton: "Buat Akun",
    signInButton: "Masuk",
    newUserSetup: "Pengaturan Pengguna Baru",
    newUserSetupDesc:
      "Pengguna baru akan melalui proses pengaturan cepat untuk menyesuaikan pengalaman mereka.",
    backToHome: "Kembali ke Beranda",
    alreadyHaveAccount: "Sudah punya akun?",
    dontHaveAccount: "Belum punya akun?",
    emailRequired: "Email diperlukan",
    invalidEmailFormat: "Format email tidak valid",
    passwordRequired: "Kata sandi diperlukan",
    passwordMinLength: "Kata sandi harus minimal 6 karakter",
    nameRequired: "Nama diperlukan",
    confirmPasswordRequired: "Silakan konfirmasi kata sandi Anda",
    passwordsDoNotMatch: "Kata sandi tidak cocok",
    allFieldsRequired: "Semua bidang wajib diisi",
    emailAndPasswordRequired: "Email dan kata sandi diperlukan",
    emailAlreadyRegistered:
      "Email ini sudah terdaftar. Silakan masuk ke akun lainnya.",
    signingIn: "Masuk...",
    creatingAccount: "Membuat akun...",
    createPassword: "Membuat kata sandi",

    // Chat Page
    aiAssistantWelcome:
      "Hallo! Saya adalah asisten pertanian AI Anda. Bagaimana saya bisa membantu Anda hari ini? ��",
    aiAssistant: "Asisten AI",
    pleaseLoginToChat:
      "Silakan masuk ke akun Anda untuk memulai percakapan dengan asisten AI",
    connectionError:
      "Maaf, saya sedang mengalami kesulitan untuk menghubungi Anda. Silakan coba lagi nanti.",
    recording: "Mencatat...",
    tapStopButton: "Klik tombol merah STOP",
    clickStopButton: "Klik tombol merah STOP",
    typeFarmingQuestion: "Tulis pertanyaan Anda tentang pertanian...",
    typeQuestionInLanguage: "Tulis pertanyaan Anda dalam {language}...",
    youreOffline: "Anda offline",
    stop: "BERHENTI",
    processing: "Memproses...",
    playing: "Memutar...",
    liveChat: "Chat Langsung",
    availableLanguages: "Bahasa yang Tersedia ({count})",
    quickQuestions: "Pertanyaan Cepat",
    fertilizerForWheat: "Pupuk apa yang cocok untuk padi?",
    fertilizerForWheatQuestion:
      "Pupuk apa yang sebaiknya saya gunakan untuk padi?",
    bestTimeToPlantRice: "Kapan waktu yang tepat untuk menanam padi?",
    bestTimeToPlantRiceQuestion:
      "Kapan waktu yang tepat untuk menanam padi di daerah saya?",
    naturalPestControl: "Kontrol hama alami",
    naturalPestControlQuestion:
      "Bagaimana saya bisa mengendalikan hama tanpa bahan kimia?",
    soilPhTesting: "Uji pH tanah",
    soilPhTestingQuestion: "Apa metode uji pH yang terbaik?",
    irrigationTips: "Tips Irigasi",
    irrigationTipsQuestion: "Apa tips irigasi yang terbaik untuk tanaman saya?",
    cropRotation: "Rotasi Tanaman",
    cropRotationQuestion:
      "Apa keuntungan dari rotasi tanaman dan bagaimana saya harus merencanakannya?",
    diseasePrevention: "Pencegahan Penyakit",
    diseasePreventionQuestion:
      "Bagaimana saya bisa mencegah penyakit tanaman umum?",
    weatherImpact: "Pengaruh Iklim",
    weatherImpactQuestion:
      "Bagaimana iklim mempengaruhi pertumbuhan tanaman saya dan apa yang sebaiknya saya lakukan?",
    mediaRecorderNotSupported: "MediaRecorder tidak didukung di browser ini",
    noSupportedAudioFormat: "Tidak ada format audio yang didukung",
    unknownError: "Kesalahan tidak diketahui",
    microphoneAccessError:
      "Kesalahan akses mikrofon: {error}. Silakan periksa izin dan coba lagi.",
    audioProcessingError:
      "Maaf, saya tidak bisa memproses pesan suara Anda. Silakan coba lagi atau ketik pesan Anda.",
    speakMoreClearly:
      "Silakan berbicara lebih jelas dan coba lagi. Pastikan Anda dekat dengan mikrofon Anda.",
    noSpeechDetected:
      "Saya tidak mendengar apa pun. Silakan berbicara lebih keras dan coba lagi.",
    unknownCrop: "tanaman tidak dikenal",
    unknownIssues: "masalah tidak diketahui",
    unknown: "tidak diketahui",
    diagnosisMessageTemplate:
      "Saya baru saja menganalisis {crop} saya dan menemukan {problems}. Kesehatan tanaman adalah {health} dengan {severity} tingkat keparahan. Dapatkah Anda membantu saya memahami apa artinya ini dan apa yang sebaiknya saya lakukan selanjutnya?",

    // Monitor Page
    cropMonitor: "🌱 Monitor Tanaman",
    addNewField: "+ Tambahkan Lapangan Baru",
    healthDiagnosis: "🔬 Diagnosis Kesehatan",
    treatmentTracker: "📊 Pencatatan Pengobatan",
    aiDiagnosisResult: "🔬 Hasil Diagnosis AI",
    healthy: "Sehat",
    unhealthy: "Tidak Sehat",
    healthAssessment: "Penilaian Kesehatan:",
    severity: "Tingkat Keparahan:",
    status: "Status:",
    cropAppearsHealthy: "Tanaman Terlihat Sehat",
    issuesDetected: "Masalah Terdeteksi",
    cropInformation: "Informasi Tanaman:",
    crop: "Tanaman:",
    scheduleTreatment: "Perencanaan Pengobatan",
    viewSimilarCases: "Lihat Kasus Serupa",
    aiAnalysis: "Analisis AI:",
    healthScore: "Skor Kesehatan:",
    healthyProbability: "Probabilitas Kesehatan:",
    uploadImage: "Unggah Gambar",
    takePhoto: "Ambil Foto",
    dragAndDropImage: "Gambar atau klik untuk memilih",
    supportedFormats: "Format yang Didukung: JPG, PNG, WEBP",
    maxFileSize: "Ukuran file maksimal: 10MB",
    analyzingImage: "Menganalisis gambar...",
    uploadImageToAnalyze:
      "Unggah gambar tanaman Anda untuk menganalisis kesehatannya",
    noImageSelected: "Tidak ada gambar yang dipilih",
    selectImageToAnalyze: "Pilih gambar untuk dianalisis",
    treatmentHistory: "Sejarah Pengobatan",
    noTreatmentsYet: "Belum ada pengobatan yang direkam",
    addTreatment: "Tambahkan Pengobatan",
    treatmentType: "Jenis Pengobatan",
    field: "Lapangan",
    date: "Tanggal",
    applied: "Diterapkan",
    upcoming: "Datang",
    pending: "Tertunda",
    completed: "Selesai",
    fertilizer: "Pupuk",
    pesticide: "Insektisida",
    irrigation: "Irigasi",
    pruning: "Pemotongan",
    harvesting: "Panen",
    other: "Lainnya",
    cropHealthDiagnosis: "Diagnosis Kesehatan Tanaman",
    uploadOrCaptureImages:
      "Unggah atau ambil gambar tanaman, daun, atau tanah untuk analisis",
    useCamera: "Gunakan kamera",
    fromGallery: "Dari galeri",

    // Calendar Page
    smartFarmingCalendar: "Kalender Pertanian Cerdas",
    aiPoweredTaskManagement: "Manajemen Tugas dan Perencanaan Pertanian",
    refreshWeather: "Memperbarui Cuaca",
    refreshing: "Memperbarui...",
    weatherDataForLocation: "Data Cuaca untuk Lokasi Anda: {location}",
    coordinates: "Koordinat: {lat}, {lon}",
    usingDefaultLocation: "Menggunakan lokasi default (Etiopia)",
    updateLocationSettings:
      "Silakan perbarui pengaturan lokasi Anda di pengaturan untuk data cuaca yang disesuaikan",
    loadingWeatherData: "Memuat data cuaca...",
    weatherForecastLimited:
      "Catatan: Proyeksi cuaca terbatas hingga 14 hari karena batasan API",
    dataCached: "💾 Data disimpan untuk pemuatan yang lebih cepat",
    sun: "Matahari",
    mon: "Senin",
    tue: "Selasa",
    wed: "Rabu",
    thu: "Kamis",
    fri: "Jumat",
    sat: "Sabtu",
    january: "Januari",
    february: "Februari",
    march: "Maret",
    april: "April",
    may: "Mei",
    june: "Juni",
    july: "Juli",
    august: "Agustus",
    september: "September",
    october: "Oktober",
    november: "November",
    december: "Desember",

    // Settings Page
    back: "Kembali",
    profileSettings: "Pengaturan Profil",
    editProfile: "Ubah Profil",
    cancel: "Batal",
    personalInformation: "Informasi Pribadi",
    enterLocation: "Masukkan lokasi Anda (misalnya koordinat atau kota)",
    farmingExperience: "Pengalaman Pertanian",
    yearsOfExperience: "Tahun Pengalaman",
    cropsGrown: "Tanaman Dikembangkan",
    addCrop: "Tambahkan Tanaman",
    cropName: "Nama Tanaman",
    current: "Sekarang",
    planned: "Direncanakan",
    saveChanges: "Simpan Perubahan",
    changesSaved: "Perubahan berhasil disimpan!",
    errorSavingChanges: "Gagal menyimpan perubahan. Silakan coba lagi.",
    selectFarmingExperience: "Silakan pilih pengalaman pertanian Anda",
    selectYearsExperience: "Silakan pilih tahun pengalaman",
    selectMainGoal: "Silakan pilih tujuan utama Anda",

    // Calendar Page Additional
    loadAITasks: "Muat Tugas AI",
    loadingAITasks: "Memuat Tugas AI...",
    clearSky: "LANGIT CERAH",

    // User Registration Page
    tellUsAboutFarming: "Ceritakan Tentang Pertanian Anda",
    helpPersonalizeExperience: "Bantu kami menyesuaikan pengalaman Anda",
    aspiringFarmer: "Petani Beraspirasi",
    beginnerFarmer: "Pemula (1-2 tahun)",
    experiencedFarmer: "Berpengalaman (3-5 tahun)",
    explorerFarmer: "Penjelajah (5+ tahun)",
    increaseCropYield: "Meningkatkan hasil panen",
    reduceFarmingCosts: "Mengurangi biaya pertanian",
    sustainableFarming: "Pertanian berkelanjutan",
    organicFarming: "Pertanian organik",
    betterMarketAccess: "Akses pasar yang lebih baik",
    noCropsSelected: "Tidak ada tanaman yang dipilih",
    selectedCrops: "Tanaman yang dipilih",
    continueToApp: "Lanjutkan ke Aplikasi",

    // Settings Page Additional
    farmingInformation: "Informasi Pertanian",
    noCropsCurrentlyGrowing: "Tidak ada tanaman yang sedang ditanam saat ini",
    noCropsPlanned: "Tidak ada tanaman yang direncanakan",
    addNewCrop: "Tambahkan Tanaman Baru",
    year: "tahun",
    loadingProfile: "Memuat profil...",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem("agrilo_preferred_language");
    if (
      savedLanguage &&
      SUPPORTED_LANGUAGES.find((lang) => lang.code === savedLanguage)
    ) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (language: string) => {
    setSelectedLanguage(language);
    localStorage.setItem("agrilo_preferred_language", language);
  };

  const t = (
    key: string,
    variables?: Record<string, string | number>
  ): string => {
    const currentTranslations =
      translations[selectedLanguage as keyof typeof translations] ||
      translations.en;
    let translation =
      currentTranslations[key as keyof typeof currentTranslations] || key;

    // If variables are provided, interpolate them into the translation
    if (variables) {
      Object.entries(variables).forEach(([variable, value]) => {
        const placeholder = `{${variable}}`;
        translation = translation.replace(
          new RegExp(placeholder, "g"),
          String(value) || ""
        );
      });
    }

    return translation;
  };

  const value: LanguageContextType = {
    selectedLanguage,
    setSelectedLanguage: handleSetLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
