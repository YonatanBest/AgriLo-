"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Brain, 
  Sprout, 
  Thermometer, 
  Droplets, 
  Sun, 
  Wind, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react"
import { FormattedRecommendation, RecommendationSection } from "@/utils/formatRecommendation"

interface RecommendationDisplayProps {
  recommendation: FormattedRecommendation;
  soilSummary?: any;
  weatherSummary?: any;
  type: 'crop' | 'fertilizer';
}

export default function RecommendationDisplay({ 
  recommendation, 
  soilSummary, 
  weatherSummary, 
  type 
}: RecommendationDisplayProps) {
  
  const renderSection = (section: RecommendationSection, index: number) => {
    const lines = section.content.split('\n').filter(line => line.trim());
    
    return (
      <div key={index} className="space-y-3">
        <div className="flex items-center gap-2">
          {section.type === 'highlight' ? (
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          ) : section.type === 'list' ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <Info className="h-4 w-4 text-blue-500" />
          )}
          <h4 className="font-semibold text-gray-900">{section.title}</h4>
        </div>
        
        <div className={`pl-6 ${
          section.type === 'highlight' 
            ? 'bg-orange-50 border-l-4 border-orange-200 p-3 rounded-r-lg' 
            : section.type === 'list'
            ? 'bg-green-50 border-l-4 border-green-200 p-3 rounded-r-lg'
            : 'text-gray-700'
        }`}>
          {section.type === 'list' ? (
            <ul className="space-y-2">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex} className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>{line.replace(/^[•\-\*]\s*/, '')}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="whitespace-pre-line leading-relaxed">
              {section.content}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Recommendation */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
                 <CardHeader className="pb-4">
           <CardTitle className="flex items-center gap-3 text-green-800">
             <Brain className="h-6 w-6" />
             {type === 'crop' ? 'Crop Recommendations' : 'Simple Fertilizer Guide'}
           </CardTitle>
         </CardHeader>
        <CardContent className="space-y-6">
          {recommendation.sections.map((section, index) => (
            <div key={index}>
              {renderSection(section, index)}
              {index < recommendation.sections.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Soil Analysis */}
      {soilSummary && (
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-blue-800">
              <Sprout className="h-6 w-6" />
              Soil Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-700">Basic Properties</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Soil Type:</span>
                    <span className="font-medium">{soilSummary.soil_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Texture:</span>
                    <span className="font-medium">{soilSummary.texture_class}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">pH Level:</span>
                    <span className="font-medium">{soilSummary.ph}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-700">Nutrient Levels</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nitrogen:</span>
                    <span className="font-medium">{soilSummary.nitrogen_total_g_per_kg} g/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phosphorous:</span>
                    <span className="font-medium">{soilSummary.phosphorous_extractable_ppm} ppm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Potassium:</span>
                    <span className="font-medium">{soilSummary.potassium_extractable_ppm} ppm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Organic Carbon:</span>
                    <span className="font-medium">{soilSummary.carbon_organic_g_per_kg} g/kg</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-700">Soil Composition</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sand:</span>
                    <span className="font-medium">{soilSummary.sand_content_percent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Silt:</span>
                    <span className="font-medium">{soilSummary.silt_content_percent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Clay:</span>
                    <span className="font-medium">{soilSummary.clay_content_percent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stone Content:</span>
                    <span className="font-medium">{soilSummary.stone_content_percent}%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weather Analysis */}
      {weatherSummary && (
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-purple-800">
              <Thermometer className="h-6 w-6" />
              Weather Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-700 flex items-center gap-2">
                  <Thermometer className="h-4 w-4" />
                  Temperature
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Max:</span>
                    <span className="font-medium">{weatherSummary.avg_temperature_max}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Min:</span>
                    <span className="font-medium">{weatherSummary.avg_temperature_min}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Range:</span>
                    <span className="font-medium">{weatherSummary.min_temperature}°C - {weatherSummary.max_temperature}°C</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-700 flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  Precipitation
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Rainfall:</span>
                    <span className="font-medium">{weatherSummary.total_rainfall_mm} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Evapotranspiration:</span>
                    <span className="font-medium">{weatherSummary.avg_evapotranspiration} mm/day</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-700 flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Conditions
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunshine Hours:</span>
                    <span className="font-medium">{weatherSummary.avg_sunshine_hours} hrs/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wind Speed:</span>
                    <span className="font-medium">{weatherSummary.avg_wind_speed_kph} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Period:</span>
                    <span className="font-medium">
                      {new Date(weatherSummary.period_start).toLocaleDateString()} - {new Date(weatherSummary.period_end).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 