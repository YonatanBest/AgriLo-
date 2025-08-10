"use client"

import { useState, useEffect } from "react"
import { Home, Activity, MessageCircle, Calendar, User, Sprout, Leaf, LogOut, Settings, Globe, Menu } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage, SUPPORTED_LANGUAGES } from "@/contexts/LanguageContext"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import HomePage from "./components/home-page"
import MonitorPage from "./components/monitor-page"
import ChatPage from "./components/chat-page"
import CalendarPage from "./components/calendar-page"
import Link from "next/link"

export default function AgriApp() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const { selectedLanguage, setSelectedLanguage, t } = useLanguage()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState("chat")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  // Listen for navigation events from child components
  useEffect(() => {
    const handleNavigateToChat = (event: CustomEvent) => {
      if (event.detail?.withDiagnosis) {
        setCurrentPage("chat")
      }
    }

    window.addEventListener('navigateToChat', handleNavigateToChat as EventListener)
    
    return () => {
      window.removeEventListener('navigateToChat', handleNavigateToChat as EventListener)
    }
  }, [])

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showLanguageDropdown) {
        const target = event.target as Element
        if (!target.closest('.language-dropdown')) {
          setShowLanguageDropdown(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLanguageDropdown])

  // Redirect to auth-options if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth-options')
    }
  }, [isAuthenticated, isLoading, router])

  const handleLogout = () => {
    logout()
    router.push('/auth-options')
  }

  const confirmLogout = () => {
    if (confirm('Are you sure you want to sign out? You\'ll need to sign in again to access your account.')) {
      handleLogout()
    }
  }



  const pages = {
    home: <HomePage />,
    monitor: <MonitorPage />,
    chat: <ChatPage />,
    calendar: <CalendarPage />,
  }

  const navItems = [
    { id: "home", icon: Home, label: t("home"), badge: null },
    { id: "monitor", icon: Activity, label: t("monitor"), badge: "2" },
    { id: "chat", icon: MessageCircle, label: t("chat"), badge: null },
    { id: "calendar", icon: Calendar, label: t("calendar"), badge: "5" },
  ]

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-700 font-medium">{t("loading")}</p>
        </div>
      </div>
    )
  }

  // Show loading state when not authenticated
  if (!isAuthenticated) {
    return null // Will redirect to auth-options
  }

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        {/* Mobile Header */}
        <header className="bg-white border-b border-green-100 shadow-sm relative z-[9998]">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Navigation Drawer */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full p-2 text-green-600 hover:bg-green-50">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-white">
                  <SheetHeader>
                    <SheetTitle className="text-green-700">Agrilo</SheetTitle>
                  </SheetHeader>
                  <div className="p-2 space-y-1">
                    {(
                      [
                        { id: "chat", label: t("chat"), icon: MessageCircle },
                        { id: "home", label: t("home"), icon: Home },
                        { id: "monitor", label: t("monitor"), icon: Activity },
                        { id: "calendar", label: t("calendar"), icon: Calendar },
                      ] as const
                    ).map((item) => {
                      const Icon = item.icon
                      const active = currentPage === item.id
                      return (
                        <Button
                          key={item.id}
                          variant={active ? "default" : "outline"}
                          size="sm"
                          className={`w-full justify-start rounded-xl ${active ? "bg-green-500 text-white" : "text-green-700 border-green-200"}`}
                          onClick={() => setCurrentPage(item.id)}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </Button>
                      )
                    })}
                  </div>
                </SheetContent>
              </Sheet>
              <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">Agrilo</h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="relative language-dropdown">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="rounded-full p-2 text-green-600 hover:bg-green-50 flex items-center gap-1"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-medium">
                    {SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)?.flag}
                  </span>
                </Button>
                
                {showLanguageDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-green-200 rounded-lg shadow-xl z-[9999] min-w-[200px] language-dropdown">
                    <div className="p-2 text-xs text-gray-500 border-b">Available Languages:</div>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLanguage(lang.code);
                          setShowLanguageDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-green-50 flex items-center gap-2 ${
                          selectedLanguage === lang.code ? 'bg-green-100 text-green-700' : 'text-gray-700'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span className="text-sm">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push('/settings')}
                      className="rounded-full p-2 text-green-600 hover:bg-green-50"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Profile Settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </header>

        {/* Mobile Main Content */}
        <main className="pb-2">{pages[currentPage as keyof typeof pages]}</main>
      </div>

      {/* Desktop/Tablet Layout with Sidebar */}
      <div className="hidden md:block">
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-gradient-to-br from-green-50 to-green-100">
            {/* Sidebar */}
            <Sidebar variant="inset" className="border-r-2 border-green-100">
              <SidebarHeader className="relative border-b border-green-100 overflow-visible">
                {/* Background image with slow opacity, adjusts opacity in dark mode */}
                <div
                  className="absolute inset-0 z-0"
                  style={{
                    backgroundImage: "url('/img-2.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  aria-hidden="true"
                />
                <div className="relative flex items-center gap-3 px-4 py-3 z-10">
                  <div className="text-white">
                    <Link href="/" className="flex">
                        <Leaf className="h-6 w-6 text-green-100 drop-shadow-md" />
                        <span className="text-lg font-bold drop-shadow-md">Agrilo</span>
                    </Link>
                  </div>
                </div>
              </SidebarHeader>

              <SidebarContent className="bg-white">
                <SidebarGroup>
                  <SidebarGroupLabel className="text-gray-900 font-semibold">{t("farmManagement")}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = currentPage === item.id
                        return (
                          <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton
                              onClick={() => setCurrentPage(item.id)}
                              isActive={isActive}
                              className={`w-full justify-start gap-3 rounded-xl py-3 px-4 ${
                                isActive
                                  ? "bg-green-500 text-white hover:bg-green-600"
                                  : "text-green-700 hover:bg-green-50"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                              <span className="font-medium">{item.label}</span>
                              {item.badge && (
                                <Badge
                                  variant="secondary"
                                  className={`ml-auto text-xs ${
                                    isActive ? "bg-white/20 text-white" : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-green-700 font-semibold">{t("quickActions")}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => setCurrentPage("monitor")}
                          className="w-full justify-start gap-3 rounded-xl py-3 px-4 text-green-700 hover:bg-green-50"
                        >
                          <span className="text-lg">🔍</span>
                          <span className="font-medium">{t("cropDiagnosis")}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => setCurrentPage("chat")}
                          className="w-full justify-start gap-3 rounded-xl py-3 px-4 text-green-700 hover:bg-green-50"
                        >
                          <span className="text-lg">💬</span>
                          <span className="font-medium">{t("askAIExpert")}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => {
                            setCurrentPage("home");
                            // Dispatch custom event to navigate to fertilizer section
                            setTimeout(() => {
                              window.dispatchEvent(new CustomEvent('navigateToSection', {
                                detail: { section: 'fertilizer' }
                              }));
                            }, 100);
                          }}
                          className="w-full justify-start gap-3 rounded-xl py-3 px-4 text-green-700 hover:bg-green-50"
                        >
                          <span className="text-lg">⚡</span>
                          <span className="font-medium">Fertilizer Recommendation</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => {
                            setCurrentPage("home");
                            // Dispatch custom event to navigate to crops section
                            setTimeout(() => {
                              window.dispatchEvent(new CustomEvent('navigateToSection', {
                                detail: { section: 'crops' }
                              }));
                            }, 100);
                          }}
                          className="w-full justify-start gap-3 rounded-xl py-3 px-4 text-green-700 hover:bg-green-50"
                        >
                          <span className="text-lg">🌱</span>
                          <span className="font-medium">Crop Recommendation</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter className="border-t border-green-100 bg-gradient-to-r from-green-50 to-green-100">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-800">{user?.name || 'User'}</p>
                      <p className="text-xs text-green-600">{user?.location || t("locationNotSet")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/settings')}
                            className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium">Settings</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Manage your profile and preferences</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={confirmLogout}
                            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium">Logout</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Sign out of your account</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </SidebarFooter>
              <SidebarRail />
            </Sidebar>

            {/* Main Content */}
            <SidebarInset className="flex-1">
              <header className="flex flex-col shrink-0 border-b border-green-100 bg-white/80 backdrop-blur-sm relative z-[9998]">
                
                <div className="flex h-16 items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1 text-green-600 hover:bg-green-50" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <div className="flex items-center gap-2">
                                          <h2 className="text-lg font-semibold text-green-800 capitalize">
                        {navItems.find((item) => item.id === currentPage)?.label || t("dashboard")}
                      </h2>
                  </div>
                  <div className="ml-auto flex items-center gap-2">

                    
                    {/* Desktop Language Selector */}
                    <div className="relative language-dropdown">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                        className="rounded-full p-2 text-green-600 hover:bg-green-50 flex items-center gap-1"
                      >
                        <Globe className="h-4 w-4" />
                        <span className="text-xs font-medium">
                          {SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)?.flag}
                        </span>
                      </Button>
                      
                      {showLanguageDropdown && (
                        <div className="absolute top-full right-0 mt-1 bg-white border border-green-200 rounded-lg shadow-xl z-[9999] min-w-[200px] language-dropdown">
                          <div className="p-2 text-xs text-gray-500 border-b">Available Languages:</div>
                          {SUPPORTED_LANGUAGES.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setSelectedLanguage(lang.code);
                                setShowLanguageDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 hover:bg-green-50 flex items-center gap-2 ${
                                selectedLanguage === lang.code ? 'bg-green-100 text-green-700' : 'text-gray-700'
                              }`}
                            >
                              <span>{lang.flag}</span>
                              <span className="text-sm">{lang.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/settings')}
                            className="rounded-full p-2 ml-2 text-green-600 hover:bg-green-50"
                          >
                            <Settings className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Profile Settings</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </header>

              <main className="flex-1 overflow-visible">{pages[currentPage as keyof typeof pages]}</main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>


    </>
  )
}
