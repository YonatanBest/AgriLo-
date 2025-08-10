"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Sprout, 
  Brain, 
  Leaf, 
  ArrowRight, 
  CheckCircle,
  Plus,
  X
} from "lucide-react"
import { useRouter } from "next/navigation"

const commonCrops = [
  { 
    name: "Rice", 
    icon: "🌾", 
    scientificName: "Oryza sativa",
    stages: ["Seedling", "Vegetative", "Flowering", "Ripening", "Harvest"]
  },
  { 
    name: "Wheat", 
    icon: "🌾", 
    scientificName: "Triticum aestivum",
    stages: ["Germination", "Tillering", "Stem Extension", "Heading", "Ripening"]
  },
  { 
    name: "Corn/Maize", 
    icon: "🌽", 
    scientificName: "Zea mays",
    stages: ["Germination", "Vegetative", "Tasseling", "Silking", "Maturity"]
  },
  { 
    name: "Cotton", 
    icon: "🧶", 
    scientificName: "Gossypium hirsutum",
    stages: ["Germination", "Vegetative", "Square Formation", "Flowering", "Boll Development"]
  },
  { 
    name: "Sugarcane", 
    icon: "🎋", 
    scientificName: "Saccharum officinarum",
    stages: ["Germination", "Tillering", "Grand Growth", "Maturity", "Harvest"]
  },
  { 
    name: "Potato", 
    icon: "🥔", 
    scientificName: "Solanum tuberosum",
    stages: ["Sprouting", "Vegetative", "Tuber Initiation", "Tuber Bulking", "Maturity"]
  },
  { 
    name: "Tomato", 
    icon: "🍅", 
    scientificName: "Solanum lycopersicum",
    stages: ["Germination", "Vegetative", "Flowering", "Fruit Setting", "Ripening"]
  },
  { 
    name: "Onion", 
    icon: "🧅", 
    scientificName: "Allium cepa",
    stages: ["Germination", "Vegetative", "Bulb Formation", "Maturity", "Harvest"]
  },
  { 
    name: "Chilli", 
    icon: "🌶️", 
    scientificName: "Capsicum annuum",
    stages: ["Germination", "Vegetative", "Flowering", "Fruit Setting", "Ripening"]
  },
  { 
    name: "Pulses", 
    icon: "🫘", 
    scientificName: "Various legumes",
    stages: ["Germination", "Vegetative", "Flowering", "Pod Formation", "Maturity"]
  },
]

const soilTypes = [
  "Clay Loam",
  "Sandy Loam", 
  "Silt Loam",
  "Clay",
  "Sandy",
  "Loamy Sand",
  "Silty Clay",
  "Silty Clay Loam"
]

const seasons = [
  "Kharif (Monsoon)",
  "Rabi (Winter)", 
  "Zaid (Summer)",
  "All Year Round"
]

export default function CropRecommendationPage() {
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [currentCrops, setCurrentCrops] = useState<string[]>([])
  const [selectedCrops, setSelectedCrops] = useState<Array<{
    name: string;
    stage: string;
    icon: string;
  }>>([])
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [customCropName, setCustomCropName] = useState("")
  const [customCropIcon, setCustomCropIcon] = useState("🌱")
  const [showCustomCropInput, setShowCustomCropInput] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Mock language for UI demonstration
    const language = "en"
    console.log("Selected language:", language)
  }, [])

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
  }

  const handleCropToggle = (cropName: string, cropIcon: string) => {
    setCurrentCrops(prev => 
      prev.includes(cropName) 
        ? prev.filter(crop => crop !== cropName)
        : [...prev, cropName]
    )
    
    // Update selected crops with stages
    setSelectedCrops(prev => {
      const existing = prev.find(crop => crop.name === cropName)
      if (existing) {
        return prev.filter(crop => crop.name !== cropName)
      } else {
        const cropData = commonCrops.find(crop => crop.name === cropName)
        return [...prev, {
          name: cropName,
          stage: cropData?.stages[0] || "Germination",
          icon: cropIcon
        }]
      }
    })
  }

  const handleStageChange = (cropName: string, stage: string) => {
    setSelectedCrops(prev => 
      prev.map(crop => 
        crop.name === cropName ? { ...crop, stage } : crop
      )
    )
  }

  const handleAddCustomCrop = () => {
    if (!customCropName.trim()) return

    const newCropName = customCropName.trim()
    const newCropIcon = customCropIcon

    // Add to current crops
    setCurrentCrops(prev => [...prev, newCropName])
    
    // Add to selected crops
    setSelectedCrops(prev => [...prev, {
      name: newCropName,
      stage: "Germination",
      icon: newCropIcon
    }])

    // Reset form
    setCustomCropName("")
    setCustomCropIcon("🌱")
    setShowCustomCropInput(false)
  }

  const handleRemoveCrop = (cropName: string) => {
    setCurrentCrops(prev => prev.filter(crop => crop !== cropName))
    setSelectedCrops(prev => prev.filter(crop => crop.name !== cropName))
  }

  const cropIcons = ["🌱", "🌾", "🌽", "🧶", "🎋", "🥕", "🥬", "🥦", "🍆", "🥒", "🌻", "🌷", "🌹", "🌺", "🌸"]

  const getRecommendations = () => {
    if (selectedOption === "new") {
      return [
        {
          crop: "Rice",
          reason: "Perfect for your region's monsoon climate and clay loam soil. Rice thrives in water-logged conditions and provides excellent yield potential. The crop cycle aligns perfectly with the Kharif season, ensuring optimal growth conditions.",
          detailedReason: "Rice is ideal because: 1) Your soil type retains water well, 2) Monsoon provides natural irrigation, 3) High market demand ensures good returns, 4) Multiple varieties available for different conditions",
          yield: "4-6 tons/hectare",
          duration: "120-150 days",
          icon: "🌾",
          selected: false
        },
        {
          crop: "Wheat", 
          reason: "Excellent choice for Rabi season with your soil type. Wheat has strong root systems that work well with clay loam, and the winter season provides ideal growing conditions with less pest pressure.",
          detailedReason: "Wheat is recommended because: 1) Clay loam provides excellent nutrient retention, 2) Winter season reduces water requirements, 3) Strong market demand and stable prices, 4) Good rotation crop after rice",
          yield: "3-4 tons/hectare",
          duration: "110-130 days",
          icon: "🌾",
          selected: false
        },
        {
          crop: "Pulses",
          reason: "Essential for soil health and sustainable farming. Pulses fix nitrogen in soil, reducing fertilizer costs. They're drought-resistant and perfect for crop rotation, improving overall farm productivity.",
          detailedReason: "Pulses are beneficial because: 1) Nitrogen fixation improves soil fertility, 2) Drought-resistant varieties available, 3) Short duration allows multiple crops per year, 4) High protein content for better nutrition",
          yield: "1-1.5 tons/hectare", 
          duration: "90-120 days",
          icon: "🫘",
          selected: false
        }
      ]
    } else {
      return [
        {
          crop: "Optimize current crops",
          reason: "AI-powered precision farming will analyze your specific crop stages and provide targeted recommendations for maximum yield. Real-time monitoring ensures optimal growth conditions.",
          detailedReason: "This approach will: 1) Analyze current crop health and growth stage, 2) Provide stage-specific recommendations, 3) Optimize irrigation and fertilization schedules, 4) Predict and prevent potential issues",
          yield: "15-20% increase expected",
          duration: "Ongoing support",
          icon: "📈",
          selected: false
        },
        {
          crop: "Disease prevention",
          reason: "Advanced AI monitoring detects early signs of diseases and pest infestations. Get instant alerts and treatment recommendations to protect your crops before damage occurs.",
          detailedReason: "AI monitoring provides: 1) Early disease detection through image analysis, 2) Weather-based disease prediction, 3) Targeted treatment recommendations, 4) Prevention strategies for future seasons",
          yield: "Prevent 90% crop loss",
          duration: "24/7 monitoring",
          icon: "🛡️",
          selected: false
        },
        {
          crop: "Smart irrigation",
          reason: "AI analyzes weather patterns, soil moisture, and crop water requirements to create optimal irrigation schedules. Save water while ensuring your crops get exactly what they need.",
          detailedReason: "Smart irrigation offers: 1) Weather-based irrigation scheduling, 2) Soil moisture monitoring, 3) Crop-specific water requirements, 4) Automated system integration for efficiency",
          yield: "30% water savings",
          duration: "Real-time updates",
          icon: "💧",
          selected: false
        }
      ]
    }
  }

  const handleGetRecommendations = () => {
    const recs = getRecommendations()
    setRecommendations(recs)
    setShowRecommendations(true)
  }

  const handleRecommendationToggle = (index: number) => {
    setRecommendations(prev => 
      prev.map((rec, i) => 
        i === index ? { ...rec, selected: !rec.selected } : rec
      )
    )
  }

  const handleContinueToApp = () => {
    // Mock storage for UI demonstration
    console.log("User preferences:", { selectedOption, currentCrops, selectedCrops })
    
    router.push("/main-page")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">AI-Powered Farming Assistant</h1>
          <p className="text-green-600 text-lg">Let's personalize your farming experience</p>
        </div>

        {!showRecommendations ? (
          <div className="space-y-6">
            {/* Main Options */}
            <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-700 text-center text-xl">
                  What would you like to do?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => handleOptionSelect("new")}
                  variant={selectedOption === "new" ? "default" : "outline"}
                  className={`h-auto p-6 justify-start gap-4 rounded-xl transition-all ${
                    selectedOption === "new"
                      ? "bg-green-500 text-white border-green-500 shadow-lg"
                      : "border-green-200 text-green-700 hover:bg-green-50"
                  }`}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Sprout className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-lg">Get Crop Recommendations</div>
                    <div className="text-sm opacity-80">
                      I want AI to suggest the best crops for my farm
                    </div>
                  </div>
                  {selectedOption === "new" && <CheckCircle className="h-6 w-6" />}
                </Button>

                <Button
                  onClick={() => handleOptionSelect("existing")}
                  variant={selectedOption === "existing" ? "default" : "outline"}
                  className={`h-auto p-6 justify-start gap-4 rounded-xl transition-all ${
                    selectedOption === "existing"
                      ? "bg-green-500 text-white border-green-500 shadow-lg"
                      : "border-green-200 text-green-700 hover:bg-green-50"
                  }`}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-lg">Optimize Current Crops</div>
                    <div className="text-sm opacity-80">
                      I already have crops and want AI assistance
                    </div>
                  </div>
                  {selectedOption === "existing" && <CheckCircle className="h-6 w-6" />}
                </Button>
              </CardContent>
            </Card>

            {/* Current Crops Selection */}
            {selectedOption === "existing" && (
              <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-green-700">
                    Select Your Current Crops & Growth Stages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Common Crops Grid */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-green-700">Common Crops</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {commonCrops.map((crop) => (
                        <Button
                          key={crop.name}
                          variant={currentCrops.includes(crop.name) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleCropToggle(crop.name, crop.icon)}
                          className={`justify-start gap-2 ${
                            currentCrops.includes(crop.name)
                              ? "bg-green-500 text-white"
                              : "border-green-200 text-green-700"
                          }`}
                        >
                          <span>{crop.icon}</span>
                          <span className="text-xs">{crop.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Crop Input */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium text-green-700">Custom Crops</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCustomCropInput(!showCustomCropInput)}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        {showCustomCropInput ? (
                          <>
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Custom Crop
                          </>
                        )}
                      </Button>
                    </div>

                    {showCustomCropInput && (
                      <div className="p-4 bg-green-50 rounded-xl space-y-3">
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <Label className="text-sm text-green-600 mb-1 block">Crop Name</Label>
                            <Input
                              value={customCropName}
                              onChange={(e) => setCustomCropName(e.target.value)}
                              placeholder="Enter crop name (e.g., Carrots, Spinach)"
                              className="border-green-200 focus:border-green-500"
                            />
                          </div>
                          <div className="w-24">
                            <Label className="text-sm text-green-600 mb-1 block">Icon</Label>
                            <Select value={customCropIcon} onValueChange={setCustomCropIcon}>
                              <SelectTrigger className="border-green-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="grid grid-cols-5 gap-1 p-2 max-h-40 overflow-y-auto">
                                  {cropIcons.map((icon) => (
                                    <SelectItem key={icon} value={icon} className="text-center">
                                      <span className="text-lg">{icon}</span>
                                    </SelectItem>
                                  ))}
                                </div>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button
                          onClick={handleAddCustomCrop}
                          disabled={!customCropName.trim()}
                          className="w-full bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Crop
                        </Button>
                      </div>
                    )}

                    {/* Selected Custom Crops */}
                    {selectedCrops.filter(crop => !commonCrops.find(common => common.name === crop.name)).length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-green-600">Your Custom Crops</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedCrops
                            .filter(crop => !commonCrops.find(common => common.name === crop.name))
                            .map((crop) => (
                              <Badge
                                key={crop.name}
                                variant="outline"
                                className="bg-green-100 text-green-700 border-green-300 px-3 py-1"
                              >
                                <span className="mr-1">{crop.icon}</span>
                                {crop.name}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveCrop(crop.name)}
                                  className="h-4 w-4 p-0 ml-1 hover:bg-green-200"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Selected Crops with Stages */}
                  {selectedCrops.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Growth Stages</Label>
                      {selectedCrops.map((crop) => {
                        const cropData = commonCrops.find(c => c.name === crop.name)
                        const defaultStages = ["Germination", "Vegetative", "Flowering", "Fruiting", "Maturity"]
                        const stages = cropData?.stages || defaultStages
                        
                        return (
                          <div key={crop.name} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                            <span className="text-2xl">{crop.icon}</span>
                            <div className="flex-1">
                              <p className="font-medium text-green-800">{crop.name}</p>
                              <Select 
                                value={crop.stage} 
                                onValueChange={(value) => handleStageChange(crop.name, value)}
                              >
                                <SelectTrigger className="w-full mt-1">
                                  <SelectValue placeholder="Select stage" />
                                </SelectTrigger>
                                <SelectContent>
                                  {stages.map((stage) => (
                                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveCrop(crop.name)}
                              className="text-red-500 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Continue Button */}
            {selectedOption && (
              <div className="text-center">
                <Button
                  onClick={handleGetRecommendations}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg"
                >
                  <span>Get AI Recommendations</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* Recommendations Display */
          <div className="space-y-6">
            <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-700 text-center">
                  🎯 AI Recommendations for Your Farm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                        <div className="text-3xl">{rec.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-green-800 text-lg">{rec.crop}</h3>
                            <Button
                              variant={rec.selected ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleRecommendationToggle(index)}
                              className={rec.selected ? "bg-green-500 text-white" : "border-green-200 text-green-700"}
                            >
                              {rec.selected ? "Selected" : "Select"}
                            </Button>
                          </div>
                          <p className="text-green-600 text-sm mt-2">{rec.reason}</p>
                          <div className="flex gap-4 mt-2 text-xs text-green-600">
                            <span>Yield: {rec.yield}</span>
                            <span>Duration: {rec.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Detailed Reasoning */}
                      <div className="ml-12 p-3 bg-green-100 rounded-lg">
                        <p className="text-sm text-green-700 font-medium mb-2">Why this recommendation?</p>
                        <p className="text-xs text-green-600 leading-relaxed">{rec.detailedReason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="text-center space-y-4">
              <Button
                onClick={handleContinueToApp}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg"
              >
                <span>Continue to Agrilo</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <div className="text-sm text-green-600">
                <p>Your preferences have been saved</p>
                <p className="mt-1">You can modify these settings anytime in your profile</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 