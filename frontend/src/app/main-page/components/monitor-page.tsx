"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Camera, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  MessageCircle, 
  Calendar, 
  ImageIcon,
  ExternalLink,
  Bell,
  Leaf,
  Droplets,
  Sun,
  Thermometer,
  Eye,
  Search,
  Shield
} from "lucide-react"
import { apiService } from "@/lib/api"
import { useDiagnosis } from "@/contexts/DiagnosisContext"
import { useLanguage } from "@/contexts/LanguageContext"

export default function MonitorPage() {
  const { setDiagnosisData } = useDiagnosis()
  const { t } = useLanguage()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showDiagnosisResult, setShowDiagnosisResult] = useState(false)
  const [showSimilarCases, setShowSimilarCases] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (file: File) => {
    if (!file) return
    setIsAnalyzing(true)
    setSelectedImage(URL.createObjectURL(file))
    try {
      const result = await apiService.analyzeCropHealth(file)
      console.log('Diagnosis result:', result)
      setDiagnosisResult(result)
    setShowDiagnosisResult(true)
    } catch (error) {
      console.error('Failed to analyze crop health:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const getAllSimilarImages = () => {
    if (!diagnosisResult?.raw_results?.kindwise) return []
    
    const similarImages: Array<{
      url: string
      citation: string
      source: string
      disease?: string
      crop?: string
    }> = []

    // Add disease similar images
    if (diagnosisResult.raw_results.kindwise.diseases) {
      diagnosisResult.raw_results.kindwise.diseases.forEach((disease: any) => {
        if (disease.similar_images) {
          disease.similar_images.forEach((img: any) => {
            similarImages.push({
              url: img.url,
              citation: img.citation || '',
              source: 'disease',
              disease: disease.name
            })
          })
        }
      })
    }

    // Add crop similar images
    if (diagnosisResult.raw_results.kindwise.crops) {
      diagnosisResult.raw_results.kindwise.crops.forEach((crop: any) => {
        if (crop.similar_images) {
          crop.similar_images.forEach((img: any) => {
            similarImages.push({
              url: img.url,
              citation: img.citation || '',
              source: 'crop',
              crop: crop.name
            })
          })
        }
      })
    }

    return similarImages
  }

  const handleAskAIExpert = () => {
    if (!diagnosisResult) return

    // Extract diagnosis data
    const diagnosisData = {
      cropIdentified: diagnosisResult.structured_insight?.crop_identified || 
                     diagnosisResult.raw_results?.kindwise?.crops?.[0]?.name,
      identifiedProblems: diagnosisResult.structured_insight?.identified_problems || [],
      symptomsNoticed: diagnosisResult.structured_insight?.symptoms_noticed || [],
      probableCauses: diagnosisResult.structured_insight?.probable_causes || [],
      recommendedActions: diagnosisResult.structured_insight?.recommended_actions || [],
      preventionTips: diagnosisResult.structured_insight?.prevention_tips || [],
      severityLevel: diagnosisResult.structured_insight?.severity_level || 'unknown',
      overallHealth: diagnosisResult.structured_insight?.overall_health || 
                   (diagnosisResult.raw_results?.openepi?.not_healthy > 0.5 ? 'unhealthy' : 'healthy'),
      confidenceLevel: diagnosisResult.structured_insight?.confidence_level || 'unknown',
      rawResults: diagnosisResult.raw_results
    }

    // Set diagnosis data in context
    setDiagnosisData(diagnosisData)

    // Navigate to chat page
    // We'll need to trigger navigation to the chat tab
    // For now, we'll use a custom event that the main page can listen to
    window.dispatchEvent(new CustomEvent('navigateToChat', { 
      detail: { withDiagnosis: true } 
    }))
  }

  const fertilizers = [
    { name: "NPK 20-20-20", field: "Field A", date: "2024-01-15", status: "applied" },
    { name: "Urea", field: "Field B", date: "2024-01-20", status: "applied" },
    { name: "DAP", field: "Field A", date: "2024-02-01", status: "upcoming" },
  ]

  return (
    <div className="space-y-6">
            <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-700">{t("cropMonitor")}</h1>
        <Button className="bg-green-500 hover:bg-green-600 rounded-xl">
          {t("addNewField")}
        </Button>
      </div>
    
      <Tabs defaultValue="diagnosis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-green-50">
          <TabsTrigger value="diagnosis" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
            {t("healthDiagnosis")}
          </TabsTrigger>
          <TabsTrigger value="tracker" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
            {t("treatmentTracker")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diagnosis" className="space-y-6">
          {/* AI Diagnosis Result */}
          {showDiagnosisResult && diagnosisResult && (
            <Card className="rounded-2xl border-2 border-green-100 shadow-lg animate-in slide-in-from-bottom duration-500">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">
                  {t("aiDiagnosisResult")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Structured Analysis Section */}
                {diagnosisResult.structured_insight && typeof diagnosisResult.structured_insight === 'object' ? (
                  <div className="space-y-6">
                    {/* Header with Image and Basic Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left Column - Image and Health Status */}
                      <div className="space-y-4">
                        {selectedImage && (
                          <div className="relative">
                            <img 
                              src={selectedImage} 
                              alt="Uploaded crop" 
                              className="w-full h-48 object-cover rounded-xl border-2 border-green-200"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge 
                                variant={diagnosisResult.structured_insight.overall_health === 'healthy' ? "default" : "destructive"} 
                                className="bg-white/90"
                              >
                                {diagnosisResult.structured_insight.overall_health === 'healthy' ? t("healthy") : t("unhealthy")}
                              </Badge>
                            </div>
                          </div>
                        )}

                        {/* Health Assessment */}
                        <div className="bg-green-50 p-4 rounded-xl">
                          <h4 className="font-semibold text-green-800 mb-2">{t("healthAssessment")}</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-green-700">{t("confidence")}:</span>
                              <Badge variant="default" className="text-xs bg-green-500">
                                {diagnosisResult.structured_insight.confidence_level.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-green-700">{t("severity")}:</span>
                              <Badge 
                                variant={diagnosisResult.structured_insight.severity_level === 'critical' ? "destructive" : 
                                         diagnosisResult.structured_insight.severity_level === 'high' ? "destructive" :
                                         diagnosisResult.structured_insight.severity_level === 'medium' ? "secondary" : "default"}
                                className={diagnosisResult.structured_insight.severity_level === 'critical' ? "bg-red-500" :
                                         diagnosisResult.structured_insight.severity_level === 'high' ? "bg-orange-500" :
                                         diagnosisResult.structured_insight.severity_level === 'medium' ? "bg-yellow-500" : "bg-green-500"}
                              >
                                {diagnosisResult.structured_insight.severity_level.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Middle Column - Crop Info and Severity */}
                      <div className="space-y-4">
                        <Alert className={diagnosisResult.structured_insight.overall_health === 'healthy' ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                          <AlertTriangle className={`h-4 w-4 ${diagnosisResult.structured_insight.overall_health === 'healthy' ? "text-green-600" : "text-red-600"}`} />
                          <AlertDescription className={diagnosisResult.structured_insight.overall_health === 'healthy' ? "text-green-700" : "text-red-700"}>
                            <strong>{t("status")}:</strong> {diagnosisResult.structured_insight.overall_health === 'healthy' ? t("cropAppearsHealthy") : t("issuesDetected")}
                          </AlertDescription>
                        </Alert>

                        <div className="bg-green-50 p-4 rounded-xl">
                          <h4 className="font-semibold text-green-800 mb-2">{t("cropInformation")}:</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Leaf className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-700">
                                <strong>{t("crop")}:</strong> {diagnosisResult.structured_insight.crop_identified}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-green-50 p-4 rounded-xl">
                          <h4 className="font-semibold text-green-800 mb-2">{t("quickActions")}:</h4>
                          <div className="space-y-2">
                            <Button 
                              className="w-full bg-green-500 hover:bg-green-600 rounded-xl flex items-center gap-2"
                              onClick={handleAskAIExpert}
                            >
                              <MessageCircle className="h-4 w-4" />
                              {t("askAIExpert")}
                            </Button>
                            <Button variant="outline" className="w-full rounded-xl border-2 bg-transparent">
                              <Calendar className="h-4 w-4 mr-2" />
                              {t("scheduleTreatment")}
                            </Button>
                            <Button 
                              variant="outline" 
                              className="w-full rounded-xl border-2 bg-transparent"
                              onClick={() => setShowSimilarCases(true)}
                            >
                              <ImageIcon className="h-4 w-4 mr-2" />
                              {t("viewSimilarCases")}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - AI Insight */}
                  <div className="space-y-4">
                        <Alert className={diagnosisResult.raw_results.openepi.not_healthy > 0.5 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
                          <AlertTriangle className={`h-4 w-4 ${diagnosisResult.raw_results.openepi.not_healthy > 0.5 ? "text-red-600" : "text-green-600"}`} />
                          <AlertDescription className={diagnosisResult.raw_results.openepi.not_healthy > 0.5 ? "text-red-700" : "text-green-700"}>
                            <strong>{t("aiAnalysis")}:</strong> {diagnosisResult.raw_results.openepi.not_healthy > 0.5 ? t("issuesDetected") : t("cropAppearsHealthy")}
                      </AlertDescription>
                    </Alert>

                    <div className="bg-green-50 p-4 rounded-xl">
                          <h4 className="font-semibold text-green-800 mb-2">{t("healthScore")}:</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-green-700">{t("healthyProbability")}:</span>
                              <span className="text-sm font-semibold text-green-800">
                                {(diagnosisResult.raw_results.openepi.healthy * 100).toFixed(1)}%
                              </span>
                            </div>
                            <Progress 
                              value={diagnosisResult.raw_results.openepi.healthy * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Analysis Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Identified Problems */}
                      {diagnosisResult.structured_insight.identified_problems.length > 0 && (
                        <Card className="border-2 border-red-100 bg-red-50">
                          <CardHeader>
                            <CardTitle className="text-red-800 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Identified Problem(s)
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-1">
                              {diagnosisResult.structured_insight.identified_problems.map((problem: string, index: number) => (
                                <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                                  <span className="text-red-500 mt-1">•</span>
                                  {problem}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}

                      {/* Symptoms Noticed */}
                      {diagnosisResult.structured_insight.symptoms_noticed.length > 0 && (
                        <Card className="border-2 border-orange-100 bg-orange-50">
                          <CardHeader>
                            <CardTitle className="text-orange-800 flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              Symptoms Noticed
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-1">
                              {diagnosisResult.structured_insight.symptoms_noticed.map((symptom: string, index: number) => (
                                <li key={index} className="text-sm text-orange-700 flex items-start gap-2">
                                  <span className="text-orange-500 mt-1">•</span>
                                  {symptom}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}

                      {/* Probable Causes */}
                      {diagnosisResult.structured_insight.probable_causes.length > 0 && (
                        <Card className="border-2 border-yellow-100 bg-yellow-50">
                          <CardHeader>
                            <CardTitle className="text-yellow-800 flex items-center gap-2">
                              <Search className="h-4 w-4" />
                              Probable Causes
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-1">
                              {diagnosisResult.structured_insight.probable_causes.map((cause: string, index: number) => (
                                <li key={index} className="text-sm text-yellow-700 flex items-start gap-2">
                                  <span className="text-yellow-500 mt-1">•</span>
                                  {cause}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}

                      {/* Recommended Actions */}
                      {diagnosisResult.structured_insight.recommended_actions.length > 0 && (
                        <Card className="border-2 border-blue-100 bg-blue-50">
                          <CardHeader>
                            <CardTitle className="text-blue-800 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Recommended Actions
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-1">
                              {diagnosisResult.structured_insight.recommended_actions.map((action: string, index: number) => (
                                <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}

                      {/* Prevention Tips */}
                      {diagnosisResult.structured_insight.prevention_tips.length > 0 && (
                        <Card className="border-2 border-green-100 bg-green-50">
                          <CardHeader>
                            <CardTitle className="text-green-800 flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Prevention Tips
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-1">
                              {diagnosisResult.structured_insight.prevention_tips.map((tip: string, index: number) => (
                                <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                                  <span className="text-green-500 mt-1">•</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Fallback to old format or raw JSON display */
                  <div className="space-y-6">
                    {/* If structured_insight is a string, show it as formatted JSON */}
                    {diagnosisResult.structured_insight && typeof diagnosisResult.structured_insight === 'string' && (
                      <Card className="border-2 border-yellow-100 bg-yellow-50">
                        <CardHeader>
                          <CardTitle className="text-yellow-800 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Raw AI Response
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-sm text-yellow-700 whitespace-pre-wrap bg-yellow-100 p-4 rounded-lg overflow-x-auto">
                            {diagnosisResult.structured_insight}
                          </pre>
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* Original fallback layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left Column - Image and Health Status */}
                      <div className="space-y-4">
                        {selectedImage && (
                          <div className="relative">
                            <img 
                              src={selectedImage} 
                              alt="Uploaded crop" 
                              className="w-full h-48 object-cover rounded-xl border-2 border-green-200"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge variant={diagnosisResult.raw_results.openepi.not_healthy > 0.5 ? "destructive" : "default"} className="bg-white/90">
                                {diagnosisResult.raw_results.openepi.not_healthy > 0.5 ? "Unhealthy" : "Healthy"}
                              </Badge>
                            </div>
                          </div>
                        )}

                        {/* Health Score */}
                        <div className="bg-green-50 p-4 rounded-xl">
                          <h4 className="font-semibold text-green-800 mb-2">Health Assessment:</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-green-700">Healthy Probability:</span>
                              <span className="text-sm font-semibold text-green-800">
                                {(diagnosisResult.raw_results.openepi.healthy * 100).toFixed(1)}%
                              </span>
                            </div>
                            <Progress 
                              value={diagnosisResult.raw_results.openepi.healthy * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Middle Column - AI Insight */}
                  <div className="space-y-4">
                        <Alert className={diagnosisResult.raw_results.openepi.not_healthy > 0.5 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
                          <AlertTriangle className={`h-4 w-4 ${diagnosisResult.raw_results.openepi.not_healthy > 0.5 ? "text-red-600" : "text-green-600"}`} />
                          <AlertDescription className={diagnosisResult.raw_results.openepi.not_healthy > 0.5 ? "text-red-700" : "text-green-700"}>
                            <strong>Status:</strong> {diagnosisResult.raw_results.openepi.not_healthy > 0.5 ? "Issues Detected" : "Crop Appears Healthy"}
                          </AlertDescription>
                        </Alert>

                    <div className="bg-green-50 p-4 rounded-xl">
                          <h4 className="font-semibold text-green-800 mb-2">AI Analysis:</h4>
                          <div className="text-sm text-green-700 whitespace-pre-line">
                            {diagnosisResult.insight}
                          </div>
                        </div>
                    </div>

                      {/* Right Column - Actions */}
                      <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-xl">
                          <h4 className="font-semibold text-green-800 mb-2">Quick Actions:</h4>
                          <div className="space-y-2">
                            <Button 
                              className="w-full bg-green-500 hover:bg-green-600 rounded-xl flex items-center gap-2"
                              onClick={handleAskAIExpert}
                            >
                        <MessageCircle className="h-4 w-4" />
                        Ask AI Expert
                      </Button>
                            <Button variant="outline" className="w-full rounded-xl border-2 bg-transparent">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Treatment
                      </Button>
                            <Button 
                              variant="outline" 
                              className="w-full rounded-xl border-2 bg-transparent"
                              onClick={() => setShowSimilarCases(true)}
                            >
                              <ImageIcon className="h-4 w-4 mr-2" />
                              View Similar Cases
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Diseases Section */}
                {diagnosisResult.raw_results.kindwise.diseases.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-800">Detected Diseases:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {diagnosisResult.raw_results.kindwise.diseases.map((disease: any, index: number) => (
                        <Card key={index} className="border-2 border-red-100 bg-red-50">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-red-800">{disease.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-red-700">Probability:</span>
                              <Badge variant="destructive" className="text-xs">
                                {(disease.probability * 100).toFixed(1)}%
                              </Badge>
                            </div>
                            <p className="text-xs text-red-700 italic">{disease.scientific_name}</p>
                            
                            {/* Similar Images */}
                            {disease.similar_images.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-xs font-medium text-red-800">Similar Cases:</p>
                                <div className="grid grid-cols-2 gap-2">
                                  {disease.similar_images.slice(0, 2).map((img: any, imgIndex: number) => (
                                    <a 
                                      key={imgIndex}
                                      href={img.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="block group"
                                    >
                                      <div className="relative">
                                        <img 
                                          src={img.url} 
                                          alt={`Similar ${disease.name}`}
                                          className="w-full h-16 object-cover rounded border border-red-200 group-hover:opacity-80 transition-opacity"
                                        />
                                        <ExternalLink className="absolute top-1 right-1 h-3 w-3 text-white bg-black/50 rounded p-0.5" />
                                      </div>
                                      {img.citation && (
                                        <p className="text-xs text-red-600 mt-1 truncate">{img.citation}</p>
                                      )}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Crops Section */}
                {diagnosisResult.raw_results.kindwise.crops.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-800">Identified Crops:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {diagnosisResult.raw_results.kindwise.crops.map((crop: any, index: number) => (
                        <Card key={index} className="border-2 border-green-100 bg-green-50">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-green-800 capitalize">{crop.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-green-700">Confidence:</span>
                              <Badge variant="default" className="text-xs bg-green-500">
                                {(crop.probability * 100).toFixed(1)}%
                              </Badge>
                            </div>
                            <p className="text-xs text-green-700 italic">{crop.scientific_name}</p>
                            
                            {/* Similar Images */}
                            {crop.similar_images.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-xs font-medium text-green-800">Similar Images:</p>
                                <div className="grid grid-cols-2 gap-2">
                                  {crop.similar_images.slice(0, 2).map((img: any, imgIndex: number) => (
                                    <a 
                                      key={imgIndex}
                                      href={img.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="block group"
                                    >
                                      <div className="relative">
                                        <img 
                                          src={img.url} 
                                          alt={`Similar ${crop.name}`}
                                          className="w-full h-16 object-cover rounded border border-green-200 group-hover:opacity-80 transition-opacity"
                                        />
                                        <ExternalLink className="absolute top-1 right-1 h-3 w-3 text-white bg-black/50 rounded p-0.5" />
                                      </div>
                                      {img.citation && (
                                        <p className="text-xs text-green-600 mt-1 truncate">{img.citation}</p>
                                      )}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {/* Image Upload Section */}
            <Card className="rounded-1xl border-2 border-green-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">📱 {t("cropHealthDiagnosis")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  {t("uploadOrCaptureImages")}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isAnalyzing}
                    className="h-32 flex flex-col gap-3 bg-green-500 hover:bg-green-600 rounded-2xl disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <div className="h-12 w-12 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                    <Camera className="h-12 w-12" />
                    )}
                    <span className="text-sm font-medium">
                      {isAnalyzing ? t("analyzingImage") : t("takePhoto")}
                    </span>
                    <span className="text-xs opacity-80">{t("useCamera")}</span>
                  </Button>
                  
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzing}
                    variant="outline"
                    className="h-32 flex flex-col gap-3 border-2 border-green-300 rounded-2xl hover:bg-green-50 bg-transparent disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <div className="h-12 w-12 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                    ) : (
                    <Upload className="h-12 w-12 text-green-600" />
                    )}
                    <span className="text-sm font-medium text-green-600">
                      {isAnalyzing ? t("analyzingImage") : t("uploadImage")}
                    </span>
                    <span className="text-xs text-green-600 opacity-80">{t("fromGallery")}</span>
                  </Button>
                </div>

                {/* Hidden file inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleCameraCapture}
                  className="hidden"
                />

                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-green-700">
                    <strong>Pro Tip:</strong> For best results, capture images in natural daylight and ensure the
                    affected area is clearly visible.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tracker" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fertilizer Tracker */}
            <div className="lg:col-span-2">
              <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-green-700 flex items-center gap-2">🧪 Treatment History</CardTitle>
                  <Button className="bg-green-500 hover:bg-green-600 rounded-xl">+ Log New Treatment</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {fertilizers.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <p className="font-medium text-green-800">{item.name}</p>
                            <Badge variant="outline" className="text-xs border-green-200 text-green-600">
                              {item.field}
                            </Badge>
                          </div>
                          <p className="text-sm text-green-600 mt-1">{item.date}</p>
                        </div>
                        <Badge
                          variant={item.status === "applied" ? "default" : "secondary"}
                          className={item.status === "applied" ? "bg-green-500" : "bg-green-300"}
                        >
                          {item.status === "applied" ? "Applied" : "Upcoming"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Similar Cases Modal */}
      {showSimilarCases && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-green-700">🔍 Similar Cases & Images</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSimilarCases(false)}
                className="rounded-full"
              >
                ✕
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getAllSimilarImages().map((image, index) => (
                  <Card key={index} className="border-2 border-green-100">
                    <CardContent className="p-4">
                      <div className="relative mb-3">
                        <img 
                          src={image.url} 
                          alt={`Similar case ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Badge 
                          variant="default" 
                          className="absolute top-2 left-2 text-xs"
                        >
                          {image.source === 'disease' ? 'Disease' : 'Crop'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        {image.disease && (
                          <p className="text-sm font-medium text-red-700">
                            Disease: {image.disease}
                          </p>
                        )}
                        {image.crop && (
                          <p className="text-sm font-medium text-green-700">
                            Crop: {image.crop}
                          </p>
                        )}
                        {image.citation && (
                          <p className="text-xs text-gray-600 italic">
                            {image.citation}
                          </p>
                        )}
                        <a 
                          href={image.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Full Size
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {getAllSimilarImages().length === 0 && (
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No similar cases found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
