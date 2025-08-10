"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Globe, CheckCircle, ArrowRight, Search, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

const languages = [
  { code: "en", name: "English", flag: "🇺🇸", nativeName: "English" },
  { code: "am", name: "Amharic", flag: "🇪🇹", nativeName: "አማርኛ" },
  { code: "no", name: "Norwegian", flag: "🇳🇴", nativeName: "Norsk" },
  { code: "sw", name: "Swahili", flag: "🇹🇿", nativeName: "Kiswahili" },
  { code: "es", name: "Spanish", flag: "🇪🇸", nativeName: "Español" },
  { code: "id", name: "Indonesian", flag: "🇮🇩", nativeName: "Bahasa Indonesia" },
]

export default function LanguageSelectionPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

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

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode)
  }

  const handleContinue = () => {
    if (selectedLanguage) {
      // Store selected language in session storage
      sessionStorage.setItem('agrilo_preferred_language', selectedLanguage)
      console.log("Selected language:", selectedLanguage)
      router.push("/user-registration")
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  // Filter languages based on search query
  const filteredLanguages = languages.filter(language =>
    language.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    language.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    language.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedLang = languages.find(lang => lang.code === selectedLanguage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Choose Your Language</h1>
        </div>

        {/* Language Selection Card */}
        <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-700 text-center">
              Select your preferred language for Agrilo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-green-500" />
              </div>
              <Input
                type="text"
                placeholder="Search languages... (e.g., Hindi, हिंदी, hi)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 border-green-200 focus:border-green-500 rounded-xl"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500 hover:text-green-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Language Count */}
            <div className="flex justify-between items-center text-sm text-green-600">
              <span>
                {filteredLanguages.length} of {languages.length} languages
              </span>
              {searchQuery && (
                <span className="text-green-500">
                  Showing results for "{searchQuery}"
                </span>
              )}
            </div>

            {/* Language Grid */}
            <div className="max-h-96 overflow-y-auto">
              {filteredLanguages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredLanguages.map((language) => (
                    <Button
                      key={language.code}
                      variant={selectedLanguage === language.code ? "default" : "outline"}
                      onClick={() => handleLanguageSelect(language.code)}
                      className={`h-auto p-4 justify-start gap-3 rounded-xl transition-all ${
                        selectedLanguage === language.code
                          ? "bg-green-500 text-white border-green-500 shadow-lg"
                          : "border-green-200 text-green-700 hover:bg-green-50"
                      }`}
                    >
                      <span className="text-2xl">{language.flag}</span>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">{language.name}</div>
                        <div className="text-sm opacity-80">{language.nativeName}</div>
                      </div>
                      {selectedLanguage === language.code && (
                        <CheckCircle className="h-5 w-5" />
                      )}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-green-600">
                  <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">No languages found</p>
                  <p className="text-sm mt-1">Try searching with different keywords</p>
                  <Button
                    variant="outline"
                    onClick={handleClearSearch}
                    className="mt-3 border-green-200 text-green-600 hover:bg-green-50"
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </div>

            {/* Popular Languages Section */}
            {!searchQuery && (
              <div className="pt-4 border-t border-green-100">
                <h3 className="text-sm font-medium text-green-700 mb-3">Popular Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {["en", "hi", "pa", "bn", "te"].map((code) => {
                    const lang = languages.find(l => l.code === code)
                    if (!lang) return null
                    return (
                      <Badge
                        key={code}
                        variant="outline"
                        className={`cursor-pointer transition-all ${
                          selectedLanguage === code
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                        }`}
                        onClick={() => handleLanguageSelect(code)}
                      >
                        <span className="mr-1">{lang.flag}</span>
                        {lang.name}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedLanguage}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Continue</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          {selectedLanguage && (
            <div className="mt-4">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                Selected: {selectedLang?.flag} {selectedLang?.name}
              </Badge>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-green-600">
          <p>You can change this language later in settings</p>
        </div>
      </div>
    </div>
  )
} 