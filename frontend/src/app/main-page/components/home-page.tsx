"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Sprout, Users, TrendingUp, AlertCircle, Brain, Target, Map, Leaf, Clock, Calendar, Thermometer, Droplets, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { apiService } from "@/lib/api"
import { formatRecommendation } from "@/utils/formatRecommendation"
import RecommendationDisplay from "@/components/RecommendationDisplay"

interface Crop {
  name: string;
  status: "current" | "planned";
}

interface CropRecommendation {
  crop_name: string;
  confidence: number;
  reasoning: string;
  planting_season: string;
  water_requirements: string;
}

interface CropRecommendationResponse {
  status: string;
  recommendation: string;
  soil_summary: any;
  weather_summary: any;
}

interface FertilizerRecommendationResponse {
  status: string;
  recommendation: string;
  soil_summary: any;
  weather_summary: any;
  deficiency_notes: string[];
  rotation_note: string;
  growth_stage_note: string;
}

export default function HomePage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [cropRecommendation, setCropRecommendation] = useState<CropRecommendationResponse | null>(null)
  const [fertilizerRecommendation, setFertilizerRecommendation] = useState<FertilizerRecommendationResponse | null>(null)
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [isLoadingFertilizer, setIsLoadingFertilizer] = useState(false)
  const [selectedCropForFertilizer, setSelectedCropForFertilizer] = useState<string>("")
  const [locationData, setLocationData] = useState<{lat: number, lon: number} | null>(null)
  const [currentMapView, setCurrentMapView] = useState<string>("satellite")
  const [mapEmbedUrl, setMapEmbedUrl] = useState<string | null>(null)
  const [isLoadingMap, setIsLoadingMap] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("overview") // overview, crops, fertilizer

  // Parse user's crops from the crops_grown array
  const parseUserCrops = (): Crop[] => {
    if (!user?.crops_grown) return []
    
    try {
      // If it's already an array, parse each crop string
      if (Array.isArray(user.crops_grown)) {
        return user.crops_grown.map(cropStr => {
          const [name, status] = cropStr.split(':')
          return {
            name: name || cropStr,
            status: (status as "current" | "planned") || "current"
          }
        })
      }
      
      // If it's a string, try to parse it as JSON
      const crops = JSON.parse(user.crops_grown)
      if (Array.isArray(crops)) {
        return crops.map(crop => {
          if (typeof crop === 'string') {
            const [name, status] = crop.split(':')
            return {
              name: name || crop,
              status: (status as "current" | "planned") || "current"
            }
          }
          return {
            name: crop.name || crop,
            status: crop.status || "current"
          }
        })
      }
      
      return []
    } catch (error) {
      console.error('Error parsing user crops:', error)
      return []
    }
  }

  const userCrops = parseUserCrops()
  
  // Separate current and planned crops
  const currentCrops = userCrops.filter(crop => crop.status === "current")
  const plannedCrops = userCrops.filter(crop => crop.status === "planned")

  // Parse location coordinates
  const parseLocation = () => {
    if (!user?.location) return null
    
    try {
      // Try to parse as coordinates
      const coords = user.location.split(',').map(coord => parseFloat(coord.trim()))
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        return { lat: coords[0], lon: coords[1] }
      }
      return null
    } catch (error) {
      console.error('Error parsing location:', error)
      return null
    }
  }

  // Get crop recommendations from backend
  const getCropRecommendations = async () => {
    if (!locationData) return
    
    setIsLoadingRecommendations(true)
    try {
      const result = await apiService.recommendCrops(
        locationData.lat,
        locationData.lon
      )
      setCropRecommendation(result)
    } catch (error) {
      console.error('Error getting crop recommendations:', error)
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

  // Get fertilizer recommendations from backend
  const getFertilizerRecommendations = async (cropName: string) => {
    if (!locationData) return
    
    setIsLoadingFertilizer(true)
    try {
      const result = await apiService.recommendFertilizer(
        locationData.lat,
        locationData.lon,
        cropName
      )
      setFertilizerRecommendation(result)
      setSelectedCropForFertilizer(cropName)
    } catch (error) {
      console.error('Error getting fertilizer recommendations:', error)
    } finally {
      setIsLoadingFertilizer(false)
    }
  }



  useEffect(() => {
    const location = parseLocation()
    if (location) {
      setLocationData(location)
    }
  }, [user])

  // Fetch detailed map view when location or view type changes
  useEffect(() => {
    const fetchDetailedMapView = async () => {
      if (!locationData) return
      
      setIsLoadingMap(true)
      try {
        const response = await apiService.getDetailedMapView(
          locationData.lat,
          locationData.lon,
          currentMapView
        )
        setMapEmbedUrl(response.embed_url)
      } catch (error) {
        console.error('Error fetching detailed map view:', error)
        // Fallback to basic satellite view
        try {
          const fallbackResponse = await apiService.getDetailedMapView(
            locationData.lat,
            locationData.lon,
            "satellite"
          )
          setMapEmbedUrl(fallbackResponse.embed_url)
        } catch (fallbackError) {
          console.error('Fallback map view also failed:', fallbackError)
        }
      } finally {
        setIsLoadingMap(false)
      }
    }
    
    fetchDetailedMapView()
  }, [locationData, currentMapView])

  // Debug: Log user data when it changes
  useEffect(() => {
    console.log('🏠 Home page - User data updated:', user)
    console.log('🌾 Crops data:', user?.crops_grown)
  }, [user])

  // Listen for section navigation from sidebar
  useEffect(() => {
    const handleSectionNavigation = (event: CustomEvent) => {
      if (event.detail?.section) {
        setActiveSection(event.detail.section);
      }
    }

    window.addEventListener('navigateToSection', handleSectionNavigation as EventListener);
    
    return () => {
      window.removeEventListener('navigateToSection', handleSectionNavigation as EventListener);
    }
  }, [])



  const getCropStatusColor = (status: string) => {
    return status === "current" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
  }

  const getCropStatusText = (status: string) => {
    return status === "current" ? t("currentlyGrowing") : t("planningToGrow")
  }

  const renderOverview = () => (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
              <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">{t("welcomeBack")}, {user?.name || t("farmer")}!</h1>
            </div>
        <p className="text-green-100">{t("yourVirtualFarmland")}</p>
        {locationData && (
          <div className="flex items-center gap-2 mt-3 text-green-100">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              {locationData.lat.toFixed(4)}, {locationData.lon.toFixed(4)}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Farmer's Crops Section */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Sprout className="h-5 w-5 text-green-600" />
               {t("yourCrops")}
            </CardTitle>
          </CardHeader>
           <CardContent>
             <Tabs defaultValue="current" className="w-full">
               <TabsList className="grid w-full grid-cols-2">
                 <TabsTrigger value="current" className="flex items-center gap-2">
                   <Leaf className="h-4 w-4" />
                   {t("currentlyGrowing")} ({currentCrops.length})
                 </TabsTrigger>
                 <TabsTrigger value="planned" className="flex items-center gap-2">
                   <Calendar className="h-4 w-4" />
                   {t("planningToGrow")} ({plannedCrops.length})
                 </TabsTrigger>
               </TabsList>
               
               <TabsContent value="current" className="mt-4">
                 {currentCrops.length > 0 ? (
              <div className="space-y-3">
                     {currentCrops.map((crop, index) => (
                       <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                         <div className="flex items-center gap-3">
                           <Leaf className="h-5 w-5 text-green-600" />
                           <div>
                             <p className="font-medium text-gray-900">{crop.name}</p>
                             <Badge className="bg-green-100 text-green-800">
                               {t("currentlyGrowing")}
                    </Badge>
                           </div>
                         </div>
                  </div>
                ))}
              </div>
            ) : (
                   <div className="text-center py-8 text-gray-500">
                     <Sprout className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                     <p>{t("noCurrentCrops")}</p>
                     <p className="text-sm mt-1">{t("addCurrentCropsToGetStarted")}</p>
              </div>
                 )}
               </TabsContent>
               
               <TabsContent value="planned" className="mt-4">
                 {plannedCrops.length > 0 ? (
                   <div className="space-y-3">
                     {plannedCrops.map((crop, index) => (
                       <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                         <div className="flex items-center gap-3">
                           <Calendar className="h-5 w-5 text-blue-600" />
                           <div>
                             <p className="font-medium text-gray-900">{crop.name}</p>
                             <Badge className="bg-blue-100 text-blue-800">
                               {t("planningToGrow")}
                             </Badge>
              </div>
                </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-center py-8 text-gray-500">
                     <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                     <p>{t("noPlannedCrops")}</p>
                     <p className="text-sm mt-1">{t("addPlannedCropsToGetStarted")}</p>
              </div>
            )}
               </TabsContent>
             </Tabs>
          </CardContent>
        </Card>

                                   {/* Detailed Location Map Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-green-600" />
                    {t("yourLocation")} - {t("detailedView")}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={currentMapView === "satellite" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentMapView("satellite")}
                      className="text-xs"
                    >
                      🛰️ {t("satellite")}
                    </Button>
                    <Button
                      variant={currentMapView === "roadmap" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentMapView("roadmap")}
                      className="text-xs"
                    >
                      🗺️ {t("roadmap")}
                    </Button>
                  </div>
              </div>
            </CardHeader>
            <CardContent>
              {locationData ? (
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg p-4 h-80 flex items-center justify-center relative overflow-hidden">
                    {mapEmbedUrl && !isLoadingMap ? (
                      <iframe
                        src={mapEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        title="Detailed Farm Location"
                        className="rounded-lg"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                          <p className="text-gray-600">
                            {isLoadingMap ? t("loadingDetailedView") : t("loadingMap")}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded-lg shadow-md text-sm font-medium text-gray-700">
                      📍 {locationData.lat.toFixed(6)}, {locationData.lon.toFixed(6)}
                    </div>
                                                             <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-lg shadow-md text-sm font-medium text-gray-700">
                      {currentMapView === "satellite" && t("satelliteView")}
                      {currentMapView === "roadmap" && t("roadmapView")}
                    </div>
                  </div>
                                    <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>{t("highDetailFarmView")}</strong> {t("exploreFarmLocation")}
                    </p>
                    <div className="flex justify-center gap-4 text-xs text-gray-500">
                      <span>🛰️ <strong>{t("satellite")}:</strong> {t("aerialImagery")}</span>
                      <span>🗺️ <strong>{t("roadmap")}:</strong> {t("standardMapView")}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>{t("locationNotSet")}</p>
                  <p className="text-sm mt-1">{t("updateLocationInSettings")}</p>
                </div>
              )}
            </CardContent>
          </Card>
      </div>

                    {/* AI Recommendations Section */}
       <div className="space-y-6">
         {/* Crop Recommendations */}
         <Card id="crop-section">
           <CardHeader>
             <div className="flex items-center justify-between">
               <CardTitle className="flex items-center gap-2">
                 <Brain className="h-5 w-5 text-green-600" />
                 {t("aiCropRecommendations")}
               </CardTitle>
               <Button
                 onClick={getCropRecommendations}
                 disabled={!locationData || isLoadingRecommendations}
                 className="bg-green-600 hover:bg-green-700"
               >
                 {isLoadingRecommendations ? (
                   <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                 ) : (
                   <Target className="h-4 w-4 mr-2" />
                 )}
                 {t("getRecommendations")}
               </Button>
             </div>
           </CardHeader>
           <CardContent>
             {cropRecommendation ? (
               <RecommendationDisplay
                 recommendation={formatRecommendation(cropRecommendation.recommendation, 'crop')}
                 soilSummary={cropRecommendation.soil_summary}
                 weatherSummary={cropRecommendation.weather_summary}
                 type="crop"
               />
             ) : (
               <div className="text-center py-8 text-gray-500">
                 <Brain className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                 <p>{t("noRecommendationsYet")}</p>
                 <p className="text-sm mt-1">{t("clickGetRecommendations")}</p>
            </div>
             )}
          </CardContent>
        </Card>

         {/* Fertilizer Recommendations */}
         <Card id="fertilizer-section">
           <CardHeader>
             <div className="flex items-center justify-between">
               <CardTitle className="flex items-center gap-2">
                 <Zap className="h-5 w-5 text-blue-600" />
                 {t("fertilizerRecommendations")}
               </CardTitle>
               <div className="flex gap-2">
                 <input
                   type="text"
                   placeholder={t("enterCropName")}
                   value={selectedCropForFertilizer}
                   onChange={(e) => setSelectedCropForFertilizer(e.target.value)}
                   className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                 />
                 <Button
                   onClick={() => getFertilizerRecommendations(selectedCropForFertilizer)}
                   disabled={!selectedCropForFertilizer.trim() || isLoadingFertilizer}
                   className="bg-blue-600 hover:bg-blue-700"
                 >
                   {isLoadingFertilizer ? (
                     <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                   ) : (
                     <Zap className="h-4 w-4 mr-2" />
                   )}
                   {t("getFertilizerPlan")}
                 </Button>
               </div>
            </div>
           </CardHeader>
           <CardContent>
             {fertilizerRecommendation ? (
               <RecommendationDisplay
                 recommendation={formatRecommendation(fertilizerRecommendation.recommendation, 'fertilizer')}
                 soilSummary={fertilizerRecommendation.soil_summary}
                 weatherSummary={fertilizerRecommendation.weather_summary}
                 type="fertilizer"
               />
             ) : (
               <div className="text-center py-8 text-gray-500">
                 <Zap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                 <p>{t("enterCropNameAndClick")}</p>
                 <p className="text-sm mt-1">{t("cropExamples")}</p>
            </div>
             )}
          </CardContent>
        </Card>
            </div>

      {/* Farmer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            {t("farmerInformation")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">{t("name")}</label>
                <p className="text-gray-900">{user?.name || t("notProvided")}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">{t("experience")}</label>
                <p className="text-gray-900">
                  {user?.years_experience ? `${user.years_experience} ${t("years")}` : t("notProvided")}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">{t("userType")}</label>
                <p className="text-gray-900">{user?.user_type || t("notProvided")}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">{t("mainGoal")}</label>
                <p className="text-gray-900">{user?.main_goal || t("notProvided")}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">{t("preferredLanguage")}</label>
                <p className="text-gray-900">{user?.preferred_language || t("notProvided")}</p>
            </div>
              <div>
                <label className="text-sm font-medium text-gray-600">{t("location")}</label>
                <p className="text-gray-900">{user?.location || t("notProvided")}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCropsSection = () => (
    <div className="space-y-6 p-6">
      {/* Crop Recommendations Only */}
      <Card id="crop-section">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-green-600" />
              {t("aiCropRecommendations")}
            </CardTitle>
            <Button
              onClick={getCropRecommendations}
              disabled={!locationData || isLoadingRecommendations}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoadingRecommendations ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Target className="h-4 w-4 mr-2" />
              )}
              {t("getRecommendations")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {cropRecommendation ? (
            <RecommendationDisplay
              recommendation={formatRecommendation(cropRecommendation.recommendation, 'crop')}
              soilSummary={cropRecommendation.soil_summary}
              weatherSummary={cropRecommendation.weather_summary}
              type="crop"
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>{t("noRecommendationsYet")}</p>
              <p className="text-sm mt-1">{t("clickGetRecommendations")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderFertilizerSection = () => (
    <div className="space-y-6 p-6">
      {/* Fertilizer Recommendations Only */}
      <Card id="fertilizer-section">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              {t("fertilizerRecommendations")}
            </CardTitle>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t("enterCropName")}
                value={selectedCropForFertilizer}
                onChange={(e) => setSelectedCropForFertilizer(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
              <Button
                onClick={() => getFertilizerRecommendations(selectedCropForFertilizer)}
                disabled={!selectedCropForFertilizer.trim() || isLoadingFertilizer}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoadingFertilizer ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                {t("getFertilizerPlan")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {fertilizerRecommendation ? (
            <RecommendationDisplay
              recommendation={formatRecommendation(fertilizerRecommendation.recommendation, 'fertilizer')}
              soilSummary={fertilizerRecommendation.soil_summary}
              weatherSummary={fertilizerRecommendation.weather_summary}
              type="fertilizer"
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Zap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>{t("enterCropNameAndClick")}</p>
              <p className="text-sm mt-1">{t("cropExamples")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  // Return based on active section
  if (activeSection === "crops") {
    return renderCropsSection()
  } else if (activeSection === "fertilizer") {
    return renderFertilizerSection()
  } else {
    return renderOverview()
  }
}
