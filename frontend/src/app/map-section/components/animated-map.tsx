"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Loader2, CheckCircle, AlertTriangle, Globe, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  address?: string
}

interface PhotonFeature {
  type: string
  properties: {
    name: string
    country: string
    state?: string
    city?: string
    postcode?: string
    countrycode: string
  }
  geometry: {
    type: string
    coordinates: [number, number] // [longitude, latitude]
  }
}

interface PhotonResponse {
  type: string
  features: PhotonFeature[]
}

export default function LocationDetectionPage() {
  const [isDetecting, setIsDetecting] = useState(false)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<PhotonFeature[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showManualInput, setShowManualInput] = useState(false)
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  // Supported languages for manual input
  const supportedLanguages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "am", name: "Amharic", flag: "🇪🇹" },
    { code: "no", name: "Norwegian", flag: "🇳🇴" },
    { code: "sw", name: "Swahili", flag: "🇹🇿" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "id", name: "Indonesian", flag: "🇮🇩" }
  ]

  // Redirect authenticated users to main page (only for existing users, not new registrations)
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Check if this is a new registration by looking for onboarding data
      const authData = sessionStorage.getItem('auth_data')
      
      // If we have onboarding data, continue with onboarding flow
      if (authData) {
        // New user with onboarding data - let them continue the flow
        return
      }
      
      // Existing user - redirect to main page
      router.push("/main-page")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
      setIsMobile(isMobileDevice)
    }
    
    checkMobile()
  }, [])

  const getLocation = () => {
    setIsDetecting(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.")
      setIsDetecting(false)
      return
    }

    // First try with high accuracy
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
        
        setLocationData(locationData)
        setIsDetecting(false)
        
        // Store location data in session storage
        sessionStorage.setItem('farmer_location', JSON.stringify(locationData))
        
        // Auto-proceed after 2 seconds
        setTimeout(() => {
          router.push("/language-selection")
        }, 2000)
      },
      (error) => {
        console.log("High accuracy location failed:", error)
        
        // If high accuracy fails, try with lower accuracy
        if (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE) {
          console.log("Trying with lower accuracy...")
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const locationData: LocationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
              }
              
              setLocationData(locationData)
              setIsDetecting(false)
              
              // Store location data in session storage
              sessionStorage.setItem('farmer_location', JSON.stringify(locationData))
              
              // Auto-proceed after 2 seconds
              setTimeout(() => {
                router.push("/language-selection")
              }, 2000)
            },
            (fallbackError) => {
              console.log("Lower accuracy also failed:", fallbackError)
              let errorMessage = "Unable to retrieve your location."
              switch (fallbackError.code) {
                case fallbackError.PERMISSION_DENIED:
                  errorMessage = "Location access denied. Please enable location services in your browser settings."
                  break
                case fallbackError.POSITION_UNAVAILABLE:
                  errorMessage = "Location information unavailable. Please check your GPS settings."
                  break
                case fallbackError.TIMEOUT:
                  errorMessage = "Location request timed out. Please try again or use manual input."
                  break
              }
              setError(errorMessage)
              setIsDetecting(false)
              setShowManualInput(true)
            },
            {
              enableHighAccuracy: false,
              timeout: 15000,
              maximumAge: 300000 // 5 minutes
            }
          )
      } else {
          let errorMessage = "Unable to retrieve your location."
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location services in your browser settings."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable. Please check your GPS settings."
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out. Please try again or use manual input."
              break
          }
          setError(errorMessage)
          setIsDetecting(false)
          setShowManualInput(true)
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 8000, // Reduced timeout
        maximumAge: 60000
      }
    )
  }

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}`)
      const data: PhotonResponse = await response.json()
      
      if (data.features && data.features.length > 0) {
        setSearchResults(data.features.slice(0, 5)) // Limit to 5 results
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error("Error searching location:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchInput = (value: string) => {
    setSearchQuery(value)
    if (value.trim()) {
      searchLocation(value)
    } else {
      setSearchResults([])
    }
  }

  const selectLocation = (feature: PhotonFeature) => {
    // Swap coordinates: Photon returns [longitude, latitude], we need [latitude, longitude]
    const [longitude, latitude] = feature.geometry.coordinates
    
    const locationData: LocationData = {
      latitude: latitude,
      longitude: longitude,
      accuracy: 100, // Default accuracy for manual input
      address: `${feature.properties.name}, ${feature.properties.country}`
    }
    
    setLocationData(locationData)
    setSearchQuery("")
    setSearchResults([])
    setShowManualInput(false)
    
    // Store location data in session storage
    sessionStorage.setItem('farmer_location', JSON.stringify(locationData))
    
    // Auto-proceed after 2 seconds
    setTimeout(() => {
      router.push("/language-selection")
    }, 2000)
  }

  const handleSkipLocation = () => {
    // This function is now disabled - location is mandatory
    // Users must either use GPS or manual input
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Location Required</h1>
          <p className="text-green-600 text-lg">We need your location to provide personalized farming advice</p>
        </div>

        {/* Location Detection Card */}
        <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-700 text-center">
              {isMobile ? "Enable Location Access" : "Location Detection"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {!isMobile && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Mobile Device Recommended</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Location detection works best on mobile devices. You can also manually enter your location.
                </p>
              </div>
            )}

            {isDetecting && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-green-700 font-medium">Detecting your location...</p>
                <p className="text-sm text-green-600 mt-2">Please allow location access when prompted</p>
              </div>
            )}

            {locationData && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-green-700 font-medium mb-2">Location Set!</p>
                <div className="bg-green-50 rounded-xl p-4 text-sm text-green-700">
                  <p><strong>Latitude:</strong> {locationData.latitude.toFixed(6)}</p>
                  <p><strong>Longitude:</strong> {locationData.longitude.toFixed(6)}</p>
                  {locationData.address && (
                    <p><strong>Address:</strong> {locationData.address}</p>
                  )}
                  <p><strong>Accuracy:</strong> ±{Math.round(locationData.accuracy)} meters</p>
                </div>
                <p className="text-sm text-green-600 mt-3">Proceeding to language selection...</p>
              </div>
            )}

            {error && !showManualInput && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-800">Location Error</span>
                  </div>
                  <p className="text-sm text-red-700">{error}</p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={getLocation}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={() => setShowManualInput(true)}
                    size="sm"
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    Enter Location Manually
                  </Button>
                </div>
              </div>
            )}

            {showManualInput && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Manual Location Input</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">
                    Enter your location in any of the 6 supported languages:
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {supportedLanguages.map((lang) => (
                      <Badge key={lang.code} variant="secondary" className="text-xs">
                        <span className="mr-1">{lang.flag}</span>
                        {lang.name}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Enter your location (e.g., Addis Ababa, Berlin, London)"
                        value={searchQuery}
                        onChange={(e) => handleSearchInput(e.target.value)}
                        className="pr-10"
                      />
                      {isSearching && (
                        <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-3 text-gray-400" />
                      )}
                    </div>
                    
                    {searchResults.length > 0 && (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {searchResults.map((feature, index) => (
                          <div
                            key={index}
                            onClick={() => selectLocation(feature)}
                            className="p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <div className="font-medium text-sm">{feature.properties.name}</div>
                            <div className="text-xs text-gray-600">
                              {feature.properties.city && `${feature.properties.city}, `}
                              {feature.properties.state && `${feature.properties.state}, `}
                              {feature.properties.country}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!isDetecting && !locationData && !error && !showManualInput && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-green-700 mb-4">
                    We'll use your location to provide:
                  </p>
                  <div className="space-y-2 text-sm text-green-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Local weather forecasts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Soil recommendations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Crop-specific advice</span>
                    </div>
                  </div>
                </div>

                {isMobile && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Mobile Device Detected</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Make sure location services are enabled on your device for the best experience.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={getLocation}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl"
                  >
                    <MapPin className="mr-2 h-5 w-5" />
                    {isMobile ? "Enable Location Access" : "Detect My Location"}
                  </Button>
                  
                  <Button
                    onClick={() => setShowManualInput(true)}
                    variant="outline"
                    className="w-full border-green-200 text-green-600 hover:bg-green-50 py-4 rounded-xl"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Enter Location Manually
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-green-600">
          <p>Your location is required to provide personalized farming advice</p>
          <p className="mt-1">You can change this later in settings</p>
        </div>
      </div>
    </div>
  )
}
