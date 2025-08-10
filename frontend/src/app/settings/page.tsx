"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Mail, 
  MapPin, 
  Globe, 
  Settings, 
  Save, 
  Edit, 
  ArrowLeft,
  Leaf,
  Calendar,
  Target,
  Crop,
  X
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"

interface Crop {
  name: string
  status: "current" | "planned"
}

export default function SettingsPage() {
  const { t } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    preferred_language: "",
    user_type: "",
    years_experience: "",
    main_goal: "",
    crops_grown: [] as Crop[]
  })
  const [newCropName, setNewCropName] = useState("")
  const [newCropStatus, setNewCropStatus] = useState<"current" | "planned">("current")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const { user, isLoading, updateUser } = useAuth()

  useEffect(() => {
    if (user) {
      // Parse crops_grown from string format "crop:status" to object format
      const parsedCrops = user.crops_grown?.map(cropStr => {
        const [name, status] = cropStr.split(':')
        return { name, status: status as "current" | "planned" }
      }) || []

      setFormData({
        name: user.name || "",
        email: user.email || "",
        location: user.location || "",
        preferred_language: user.preferred_language || "en",
        user_type: user.user_type || "",
        years_experience: user.years_experience?.toString() || "",
        main_goal: user.main_goal || "",
        crops_grown: parsedCrops
      })
    }
  }, [user])

  const handleSave = async () => {
    // Validate form
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = t("nameRequired")
    }
    
    if (!formData.user_type) {
      newErrors.user_type = t("selectFarmingExperience")
    }
    
    if (!formData.years_experience) {
      newErrors.years_experience = t("selectYearsExperience")
    }
    
    if (!formData.main_goal) {
      newErrors.main_goal = t("selectMainGoal")
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      try {
        // Convert crops back to string format for backend
        const cropsString = formData.crops_grown.map(crop => `${crop.name}:${crop.status}`)
        
        // Prepare user data for backend update
        const userUpdateData = {
          name: formData.name,
          location: formData.location,
          preferred_language: formData.preferred_language,
          user_type: formData.user_type,
          years_experience: parseInt(formData.years_experience),
          main_goal: formData.main_goal,
          crops_grown: cropsString
        }
        
        // Call the backend API to update user profile
        await updateUser(userUpdateData)
        
        setIsEditing(false)
        alert(t("changesSaved"))
      } catch (error) {
        console.error('Error updating profile:', error)
        alert(t("errorSavingChanges"))
      }
    }
  }

  const handleAddCrop = () => {
    if (newCropName.trim()) {
      const newCrop: Crop = {
        name: newCropName.trim(),
        status: newCropStatus
      }
      setFormData({
        ...formData,
        crops_grown: [...formData.crops_grown, newCrop]
      })
      setNewCropName("")
    }
  }

  const handleRemoveCrop = (index: number) => {
    const updatedCrops = formData.crops_grown.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      crops_grown: updatedCrops
    })
  }

  const handleBack = () => {
    router.push("/main-page")
  }

  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      en: "English",
      am: "Amharic",
      no: "Norwegian", 
      sw: "Swahili",
      es: "Spanish",
      id: "Indonesian"
    }
    return languages[code] || code
  }

  const getUserTypeName = (type: string) => {
    const types: Record<string, string> = {
      aspiring: t("aspiringFarmer"),
      beginner: t("beginnerFarmer"),
      experienced: t("experiencedFarmer"),
      explorer: t("explorerFarmer")
    }
    return types[type] || type
  }

  const getMainGoalName = (goal: string) => {
    const goals: Record<string, string> = {
      increase_yield: t("increaseCropYield"),
      reduce_costs: t("reduceFarmingCosts"),
      sustainable_farming: t("sustainableFarming"),
      organic_farming: t("organicFarming"),
      market_access: t("betterMarketAccess")
    }
    return goals[goal] || goal
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-green-600">{t("loadingProfile")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleBack}
              variant="outline"
              size="sm"
              className="border-green-200 text-green-600 hover:bg-green-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("back")}
            </Button>
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-green-600" />
              <h1 className="text-2xl font-bold text-green-800">{t("profileSettings")}</h1>
            </div>
          </div>
          
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
            className={isEditing ? "border-green-200 text-green-600" : "bg-green-500 hover:bg-green-600"}
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? t("cancel") : t("editProfile")}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("personalInformation")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-green-700 font-medium">
                  {t("fullName")}
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="rounded-xl border-green-200 focus:border-green-500"
                  />
                ) : (
                  <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-green-800">{formData.name || t("notProvided")}</p>
                  </div>
                )}
                {errors.name && (
                  <p className="text-red-600 text-sm">{errors.name}</p>
                )}
              </div>

                             {/* Email */}
               <div className="space-y-2">
                 <Label htmlFor="email" className="text-green-700 font-medium">
                   {t("emailAddress")}
                 </Label>
                 <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                                        <p className="text-green-800">{formData.email || t("notProvided")}</p>
                 </div>
               </div>

               {/* Location */}
               <div className="space-y-2">
                 <Label htmlFor="location" className="text-green-700 font-medium">
                   {t("location")}
                 </Label>
                 {isEditing ? (
                   <Input
                     id="location"
                     value={formData.location}
                     onChange={(e) => setFormData({...formData, location: e.target.value})}
                     placeholder={t("enterLocation")}
                     className="rounded-xl border-green-200 focus:border-green-500"
                   />
                 ) : (
                   <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                     <p className="text-green-800">{formData.location || t("notProvided")}</p>
                   </div>
                 )}
               </div>

              {/* Preferred Language */}
              <div className="space-y-2">
                <Label htmlFor="preferred_language" className="text-green-700 font-medium">
                  {t("preferredLanguage")}
                </Label>
                {isEditing ? (
                  <Select
                    value={formData.preferred_language}
                    onValueChange={(value) => setFormData({...formData, preferred_language: value})}
                  >
                    <SelectTrigger className="rounded-xl border-green-200 focus:border-green-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="am">Amharic</SelectItem>
                      <SelectItem value="no">Norwegian</SelectItem>
                      <SelectItem value="sw">Swahili</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="id">Indonesian</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-green-800">{getLanguageName(formData.preferred_language)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Farming Information */}
          <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                {t("farmingInformation")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Type */}
              <div className="space-y-2">
                <Label htmlFor="user_type" className="text-green-700 font-medium">
                  {t("farmingExperience")}
                </Label>
                {isEditing ? (
                  <Select
                    value={formData.user_type}
                    onValueChange={(value) => setFormData({...formData, user_type: value})}
                  >
                    <SelectTrigger className="rounded-xl border-green-200 focus:border-green-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aspiring">{t("aspiringFarmer")}</SelectItem>
                      <SelectItem value="beginner">{t("beginnerFarmer")}</SelectItem>
                      <SelectItem value="experienced">{t("experiencedFarmer")}</SelectItem>
                      <SelectItem value="explorer">{t("explorerFarmer")}</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-green-800">{getUserTypeName(formData.user_type)}</p>
                  </div>
                )}
                {errors.user_type && (
                  <p className="text-red-600 text-sm">{errors.user_type}</p>
                )}
              </div>

              {/* Years Experience */}
              <div className="space-y-2">
                <Label htmlFor="years_experience" className="text-green-700 font-medium">
                  {t("yearsOfExperience")}
                </Label>
                {isEditing ? (
                  <Select
                    value={formData.years_experience}
                    onValueChange={(value) => setFormData({...formData, years_experience: value})}
                  >
                    <SelectTrigger className="rounded-xl border-green-200 focus:border-green-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30].map((years) => (
                        <SelectItem key={years} value={years.toString()}>
                          {years} {years === 1 ? t("year") : t("years")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-green-800">{formData.years_experience} {formData.years_experience === "1" ? t("year") : t("years")}</p>
                  </div>
                )}
                {errors.years_experience && (
                  <p className="text-red-600 text-sm">{errors.years_experience}</p>
                )}
              </div>

              {/* Main Goal */}
              <div className="space-y-2">
                <Label htmlFor="main_goal" className="text-green-700 font-medium">
                  {t("mainGoal")}
                </Label>
                {isEditing ? (
                  <Select
                    value={formData.main_goal}
                    onValueChange={(value) => setFormData({...formData, main_goal: value})}
                  >
                    <SelectTrigger className="rounded-xl border-green-200 focus:border-green-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increase_yield">{t("increaseCropYield")}</SelectItem>
                      <SelectItem value="reduce_costs">{t("reduceFarmingCosts")}</SelectItem>
                      <SelectItem value="sustainable_farming">{t("sustainableFarming")}</SelectItem>
                      <SelectItem value="organic_farming">{t("organicFarming")}</SelectItem>
                      <SelectItem value="market_access">{t("betterMarketAccess")}</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-green-800">{getMainGoalName(formData.main_goal)}</p>
                  </div>
                )}
                {errors.main_goal && (
                  <p className="text-red-600 text-sm">{errors.main_goal}</p>
                )}
              </div>
            </CardContent>
          </Card>

                     {/* Crops Information */}
           <Card className="rounded-2xl border-2 border-green-100 shadow-lg lg:col-span-2">
             <CardHeader>
               <CardTitle className="text-green-700 flex items-center gap-2">
                 <Crop className="h-5 w-5" />
                 {t("yourCrops")}
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Currently Growing */}
                 <div className="space-y-3">
                   <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                     <Leaf className="h-4 w-4" />
                     {t("currentlyGrowing")}
                   </h3>
                   <div className="space-y-2">
                     {formData.crops_grown
                       .filter(crop => crop.status === "current")
                       .map((crop, index) => (
                         <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                           <div className="flex items-center gap-2">
                             <span className="text-lg">🌱</span>
                             <span className="font-medium">{crop.name}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <Badge variant="secondary" className="bg-green-100 text-green-700">
                               {t("current")}
                             </Badge>
                             {isEditing && (
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => handleRemoveCrop(formData.crops_grown.findIndex(c => c.name === crop.name && c.status === crop.status))}
                                 className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                               >
                                 <X className="h-3 w-3" />
                               </Button>
                             )}
                           </div>
                         </div>
                       ))}
                     {formData.crops_grown.filter(crop => crop.status === "current").length === 0 && (
                       <div className="text-center py-4 text-green-600">
                         <p className="text-sm">{t("noCropsCurrentlyGrowing")}</p>
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Planning to Grow */}
                 <div className="space-y-3">
                   <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                     <Calendar className="h-4 w-4" />
                     {t("planningToGrow")}
                   </h3>
                   <div className="space-y-2">
                     {formData.crops_grown
                       .filter(crop => crop.status === "planned")
                       .map((crop, index) => (
                         <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                           <div className="flex items-center gap-2">
                             <span className="text-lg">🌱</span>
                             <span className="font-medium">{crop.name}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                               {t("planned")}
                             </Badge>
                             {isEditing && (
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => handleRemoveCrop(formData.crops_grown.findIndex(c => c.name === crop.name && c.status === crop.status))}
                                 className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                               >
                                 <X className="h-3 w-3" />
                               </Button>
                             )}
                           </div>
                         </div>
                       ))}
                     {formData.crops_grown.filter(crop => crop.status === "planned").length === 0 && (
                       <div className="text-center py-4 text-blue-600">
                         <p className="text-sm">{t("noCropsPlanned")}</p>
                       </div>
                     )}
                   </div>
                 </div>
               </div>

               {/* Add New Crop Section */}
               {isEditing && (
                 <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                   <h4 className="text-lg font-semibold text-gray-800 mb-3">{t("addNewCrop")}</h4>
                   <div className="flex flex-col sm:flex-row gap-3">
                     <Input
                       value={newCropName}
                       onChange={(e) => setNewCropName(e.target.value)}
                       placeholder={t("enterCropName")}
                       className="flex-1 rounded-xl border-gray-200 focus:border-green-500"
                     />
                     <Select
                       value={newCropStatus}
                       onValueChange={(value) => setNewCropStatus(value as "current" | "planned")}
                     >
                       <SelectTrigger className="w-full sm:w-40 rounded-xl border-gray-200 focus:border-green-500">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="current">{t("currentlyGrowing")}</SelectItem>
                         <SelectItem value="planned">{t("planningToGrow")}</SelectItem>
                       </SelectContent>
                     </Select>
                     <Button
                       onClick={handleAddCrop}
                       disabled={!newCropName.trim()}
                       className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                     >
                       {t("addCrop")}
                     </Button>
                   </div>
                 </div>
               )}
             </CardContent>
           </Card>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl"
            >
              <Save className="mr-2 h-4 w-4" />
              {t("saveChanges")}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 