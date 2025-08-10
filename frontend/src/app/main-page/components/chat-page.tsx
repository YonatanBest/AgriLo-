"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Wifi, WifiOff, Mic, Paperclip, MoreVertical, Lightbulb, Clock, Leaf, Droplets, Bug, Thermometer, Globe, Volume2, VolumeX } from "lucide-react"
import { apiService } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage, SUPPORTED_LANGUAGES } from "@/contexts/LanguageContext"
import { useDiagnosis } from "@/contexts/DiagnosisContext"
import ReactMarkdown from "react-markdown"

export default function ChatPage() {
  const { user, isAuthenticated } = useAuth()
  const { selectedLanguage, setSelectedLanguage, t } = useLanguage()
  const { diagnosisData, clearDiagnosisData } = useDiagnosis()

  // Helper function to get current language info
  const getCurrentLanguage = () => SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)

  // Debug: Log language changes and persist to session
  useEffect(() => {
    console.log('🌍 Language changed to:', selectedLanguage)
    console.log('🌍 Available languages:', SUPPORTED_LANGUAGES.map(l => l.code))

    // Store language preference in session storage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('agrilo_preferred_language', selectedLanguage)
    }
  }, [selectedLanguage])
  const [isOnline, setIsOnline] = useState(true)
  const [showMobileDropdown, setShowMobileDropdown] = useState(false)
  const [showDesktopDropdown, setShowDesktopDropdown] = useState(false)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.language-dropdown-container')) {
        setShowMobileDropdown(false);
        setShowDesktopDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const [message, setMessage] = useState("")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [messages, setMessages] = useState<Array<{
    id: number;
    type: "bot" | "user";
    content: string;
    time: string;
  }>>([
    {
      id: 1,
      type: "bot",
      content: t("aiAssistantWelcome"),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])

  // Update welcome message when language changes
  useEffect(() => {
    setMessages(prev => prev.map(msg =>
      msg.id === 1 ? { ...msg, content: t("aiAssistantWelcome") } : msg
    ));
  }, [selectedLanguage, t]);

  // Initialize chat session and load preferred language when component mounts
  useEffect(() => {
    const initializeChat = async () => {
      if (isAuthenticated && !sessionId) {
        try {
          const session = await apiService.startChatSession(user?.user_id)
          setSessionId(session.session_id)
        } catch (error) {
          console.error('Failed to start chat session:', error)
          setIsOnline(false)
        }
      }
    }

    initializeChat()
  }, [isAuthenticated, user, sessionId])

  // Load preferred language from session storage - separate effect to avoid hydration issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = sessionStorage.getItem('agrilo_preferred_language')
      if (savedLanguage && ['en', 'am', 'no', 'sw', 'es', 'id'].includes(savedLanguage)) {
        setSelectedLanguage(savedLanguage as any)
        console.log('🌍 Loaded preferred language:', savedLanguage)
      }
    }
  }, [setSelectedLanguage])

  // Auto-send diagnosis message when diagnosis data is available
  useEffect(() => {
    if (diagnosisData && sessionId) {
      const createDiagnosisMessage = () => {
        const crop = diagnosisData.cropIdentified || t("unknownCrop")
        const problems = diagnosisData.identifiedProblems?.join(', ') || t("unknownIssues")
        const health = diagnosisData.overallHealth || t("unknown")
        const severity = diagnosisData.severityLevel || t("unknown")

        return t("diagnosisMessageTemplate", { crop, problems, health, severity })
      }

      const diagnosisMessage = createDiagnosisMessage()

      // Add the diagnosis message to the chat
      const newMessage = {
        id: Date.now(),
        type: "user" as const,
        content: diagnosisMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages(prev => [...prev, newMessage])

      // Send the message to the AI
      const sendDiagnosisMessage = async () => {
        setIsLoading(true)
        try {
          const response = await apiService.sendChatMessage(
            sessionId,
            diagnosisMessage,
            selectedLanguage
          )

          const botMessage = {
            id: Date.now() + 1,
            type: "bot" as const,
            content: response.response,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }

          setMessages(prev => [...prev, botMessage])
        } catch (error) {
          console.error('Failed to send diagnosis message:', error)
        } finally {
          setIsLoading(false)
          // Clear the diagnosis data after sending
          clearDiagnosisData()
        }
      }

      sendDiagnosisMessage()
    }
  }, [diagnosisData, sessionId, selectedLanguage, clearDiagnosisData, t])

  const playAudioResponse = async (audioBase64: string) => {
    try {
      console.log('🔊 Starting audio playback...')
      setIsPlayingAudio(true)

      // Convert base64 to audio blob
      const audioData = atob(audioBase64)
      console.log('🔊 Audio data decoded, length:', audioData.length)

      const audioArray = new Uint8Array(audioData.length)
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i)
      }

      const audioBlob = new Blob([audioArray], { type: 'audio/mp3' })
      console.log('🔊 Audio blob created, size:', audioBlob.size)

      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      audio.onended = () => {
        console.log('🔊 Audio playback ended')
        setIsPlayingAudio(false)
        URL.revokeObjectURL(audioUrl)
      }

      audio.onerror = (error) => {
        console.error('🔊 Audio playback error:', error)
        setIsPlayingAudio(false)
        URL.revokeObjectURL(audioUrl)
      }

      console.log('🔊 Starting audio play...')
      await audio.play()
      console.log('🔊 Audio play started successfully')
    } catch (error) {
      console.error('🔊 Failed to play audio:', error)
      setIsPlayingAudio(false)
    }
  }

  const sendMessage = async () => {
    if (!message.trim() || !sessionId || isLoading) return

    const userMessage = {
      id: messages.length + 1,
      type: "user" as const,
      content: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages(prev => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)

    try {
      let response
      if (isVoiceMode) {
        // Send voice message and get audio response
        response = await apiService.sendVoiceMessage(sessionId, message, selectedLanguage)

        // Play audio response if available
        if (response.audio_base64 && response.tts_success) {
          await playAudioResponse(response.audio_base64)
        }
      } else {
        // Send regular text message
        response = await apiService.sendChatMessage(sessionId, message, selectedLanguage)
      }

      const botResponse = {
        id: messages.length + 2,
        type: "bot" as const,
        content: response.response,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Failed to send message:', error)
      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        type: "bot" as const,
        content: t("connectionError"),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const quickQuestions = [
    {
      text: t("fertilizerForWheat"),
      icon: <Leaf className="h-3 w-3" />,
      question: t("fertilizerForWheatQuestion")
    },
    {
      text: t("bestTimeToPlantRice"),
      icon: <Clock className="h-3 w-3" />,
      question: t("bestTimeToPlantRiceQuestion")
    },
    {
      text: t("naturalPestControl"),
      icon: <Bug className="h-3 w-3" />,
      question: t("naturalPestControlQuestion")
    },
    {
      text: t("soilPhTesting"),
      icon: <Thermometer className="h-3 w-3" />,
      question: t("soilPhTestingQuestion")
    },
    {
      text: t("irrigationTips"),
      icon: <Droplets className="h-3 w-3" />,
      question: t("irrigationTipsQuestion")
    },
    {
      text: t("cropRotation"),
      icon: <Leaf className="h-3 w-3" />,
      question: t("cropRotationQuestion")
    },
    {
      text: t("diseasePrevention"),
      icon: <Bug className="h-3 w-3" />,
      question: t("diseasePreventionQuestion")
    },
    {
      text: t("weatherImpact"),
      icon: <Thermometer className="h-3 w-3" />,
      question: t("weatherImpactQuestion")
    }
  ]

  const handleQuickQuestion = (question: string) => {
    setMessage(question)
  }

  // Audio recording functions
  const startRecording = async () => {
    try {
      console.log('🎤 Starting recording...')

      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        throw new Error(t("mediaRecorderNotSupported"))
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000
        }
      })

      console.log('🎤 Microphone access granted')

      // Check available MIME types
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/wav'
      ]

      let selectedMimeType = null
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType
          console.log('🎤 Using MIME type:', mimeType)
          break
        }
      }

      if (!selectedMimeType) {
        throw new Error(t("noSupportedAudioFormat"))
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType
      })

      const chunks: Blob[] = []

      recorder.ondataavailable = (event) => {
        console.log('🎤 Data available:', event.data.size, 'bytes')
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = async () => {
        console.log('🎤 Recording stopped, chunks:', chunks.length)
        const audioBlob = new Blob(chunks, { type: selectedMimeType })
        console.log('🎤 Audio blob size:', audioBlob.size, 'bytes')

        const audioFile = new File([audioBlob], 'audio.webm', { type: selectedMimeType })
        console.log('🎤 Audio file created:', audioFile.size, 'bytes')

        // Send audio message
        await sendAudioMessage(audioFile)

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.onerror = (event) => {
        console.error('🎤 Recording error:', event)
      }

      recorder.start(1000) // Collect data every second
      console.log('🎤 Recording started')

      setMediaRecorder(recorder)
      setIsRecording(true)
      setRecordingTime(0)

      // Start recording timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

        // Store timer reference
        ; (recorder as any).timer = timer
    } catch (error) {
      console.error('🎤 Error starting recording:', error)
      const errorMessage = error instanceof Error ? error.message : t("unknownError")
      alert(t("microphoneAccessError", { error: errorMessage }))
    }
  }

  const stopRecording = () => {
    console.log('🎤 Stopping recording...')
    if (mediaRecorder && isRecording) {
      console.log('🎤 MediaRecorder state:', mediaRecorder.state)
      mediaRecorder.stop()
      setIsRecording(false)
      setRecordingTime(0)

      // Clear timer
      if ((mediaRecorder as any).timer) {
        clearInterval((mediaRecorder as any).timer)
      }

      setMediaRecorder(null)
      console.log('🎤 Recording stopped successfully')
    } else {
      console.log('🎤 No active recording to stop')
    }
  }

  const sendAudioMessage = async (audioFile: File) => {
    if (!sessionId || isLoading) return

    console.log('🎤 Sending audio with language:', selectedLanguage)
    console.log('🎤 Audio file size:', audioFile.size, 'bytes')
    console.log('🎤 Audio file type:', audioFile.type)
    setIsLoading(true)

    try {
      // Use voice conversation for real-time voice-to-voice chat
      const response = await apiService.voiceConversation(sessionId, audioFile, selectedLanguage)

      // Add transcribed message
      const transcribedMessage = {
        id: messages.length + 1,
        type: "user" as const,
        content: response.transcribed_text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages(prev => [...prev, transcribedMessage])

      // Add AI response
      const botResponse = {
        id: messages.length + 2,
        type: "bot" as const,
        content: response.response,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages(prev => [...prev, botResponse])

      // Play audio response if available
      console.log('🔊 Audio response received:', {
        hasAudio: !!response.audio_base64,
        ttsSuccess: response.tts_success,
        audioLength: response.audio_base64?.length || 0,
        language: response.original_language
      })

      if (response.audio_base64 && response.tts_success) {
        console.log('🔊 Playing audio response...')
        await playAudioResponse(response.audio_base64)
      } else {
        console.log('🔊 No audio response available:', {
          audio_base64: !!response.audio_base64,
          tts_success: response.tts_success
        })
      }
    } catch (error) {
      console.error('Failed to send audio message:', error)

      // Provide more helpful error messages for farmers
      let errorContent = t("audioProcessingError")

      if (error instanceof Error) {
        if (error.message.includes("Audio quality too low")) {
          errorContent = t("speakMoreClearly")
        } else if (error.message.includes("No speech detected")) {
          errorContent = t("noSpeechDetected")
        } else if (error.message.includes("400")) {
          errorContent = t("speakMoreClearly")
        }
      }

      const errorMessage = {
        id: messages.length + 1,
        type: "bot" as const,
        content: errorContent,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state when not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Bot className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-green-700 font-medium">{t("pleaseLoginToChat")}</p>
        </div>
      </div>
    )
  }

  return (
    <>

      {/* Mobile Layout */}
      <div className="md:hidden p-4 space-y-4 h-[calc(100vh-140px)] flex flex-col">

        {/* Mobile Chat Messages */}
        <Card className="flex-1 rounded-2xl border-2 border-green-100 shadow-lg overflow-visible">
          <CardHeader className="border-b p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-700 flex items-center gap-2 text-sm">
                <Bot className="h-4 w-4" />
                {t("aiAssistant")}
                {selectedLanguage !== 'en' && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    {SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)?.flag} {SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)?.name}
                  </Badge>
                )}

              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${msg.type === "user" ? "bg-green-500 text-white" : "bg-green-50 text-green-800"
                      }`}
                  >
                    <div className="flex items-start gap-2">
                      {msg.type === "bot" && <Bot className="h-4 w-4 mt-0.5 text-green-600" />}
                      {msg.type === "user" && <User className="h-4 w-4 mt-0.5" />}
                      <div className="flex-1">
                        {msg.type === "bot" ? (
                          <div className="text-sm prose prose-sm max-w-none">
                            <ReactMarkdown
                              components={{
                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                strong: ({ children }) => <strong className="font-semibold text-green-900">{children}</strong>,
                                em: ({ children }) => <em className="italic text-green-800">{children}</em>,
                                code: ({ children }) => <code className="bg-green-100 px-1 py-0.5 rounded text-xs font-mono text-green-800">{children}</code>,
                                ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
                                li: ({ children }) => <li className="text-sm">{children}</li>,
                                h1: ({ children }) => <h1 className="text-lg font-bold text-green-900 mb-2">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-base font-semibold text-green-900 mb-2">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-sm font-semibold text-green-900 mb-1">{children}</h3>,
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm">{msg.content}</p>
                        )}
                        <p className={`text-xs mt-1 ${msg.type === "user" ? "text-green-100" : "text-green-500"}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Message Input */}
            <div className="space-y-3">
              {/* Recording Status */}
              {isRecording && (
                <div className="flex items-center justify-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-sm font-medium text-red-700">
                    {t("recording")} {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                  </span>
                  <span className="text-xs text-red-600">{t("tapStopButton")}</span>
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isOnline
                      ? selectedLanguage === 'en'
                        ? t("typeFarmingQuestion")
                        : t("typeQuestionInLanguage", { language: SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)?.name || selectedLanguage })
                      : t("youreOffline")
                  }
                  disabled={!isOnline}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 rounded-xl"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!isOnline || !message.trim() || isLoading || isPlayingAudio}
                  className="bg-green-500 hover:bg-green-600 rounded-xl"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : isPlayingAudio ? (
                    <Volume2 className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>

                {/* Mobile Live Chat Button */}
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading || isPlayingAudio}
                  className={`rounded-xl transition-all duration-200 ${isRecording
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg scale-105'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } ${isLoading || isPlayingAudio ? 'opacity-50 cursor-not-allowed' : ''}`}
                  size="sm"
                >
                  <div className="flex items-center gap-2">
                    {isRecording ? (
                      <>
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        <span className="font-semibold">{t("stop")}</span>
                      </>
                    ) : isLoading ? (
                      <>
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span className="font-semibold">{t("processing")}</span>
                      </>
                    ) : isPlayingAudio ? (
                      <>
                        <Volume2 className="w-4 h-4 animate-pulse" />
                        <span className="font-semibold">{t("playing")}</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        <span className="font-semibold">{t("liveChat")}</span>
                      </>
                    )}
                  </div>
                </Button>

                {/* Mobile Language Selector */}
                <div className="relative language-dropdown-container">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    onClick={() => {
                      console.log('🌍 Opening mobile dropdown, languages:', SUPPORTED_LANGUAGES)
                      setShowMobileDropdown(!showMobileDropdown)
                    }}
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    {SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)?.flag}
                    <span className="ml-1 text-xs">({selectedLanguage})</span>
                  </Button>

                  {/* Language Dropdown */}
                  {showMobileDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-green-200 rounded-lg shadow-xl z-[9999] min-w-[200px] max-h-60 overflow-y-auto">
                      <div className="p-2 text-xs text-gray-500 border-b bg-white">{t("availableLanguages", { count: SUPPORTED_LANGUAGES.length })}:</div>
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setSelectedLanguage(lang.code);
                            setShowMobileDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-green-50 flex items-center gap-2 bg-white ${selectedLanguage === lang.code ? 'bg-green-100 text-green-700' : 'text-gray-700'
                            }`}
                        >
                          <span>{lang.flag}</span>
                          <span className="text-sm">{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Quick Questions */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <Lightbulb className="h-3 w-3" />
                  <span className="font-medium">{t("quickQuestions")}:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.slice(0, 4).map((item, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-green-50 text-green-600 border-green-200 text-xs px-2 py-1"
                      onClick={() => handleQuickQuestion(item.question)}
                    >
                      {item.icon}
                      <span className="ml-1">{item.text}</span>
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.slice(4, 8).map((item, index) => (
                    <Badge
                      key={index + 4}
                      variant="outline"
                      className="cursor-pointer hover:bg-green-50 text-green-600 border-green-200 text-xs px-2 py-1"
                      onClick={() => handleQuickQuestion(item.question)}
                    >
                      {item.icon}
                      <span className="ml-1">{item.text}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block p-4 lg:p-6 h-[calc(100vh-120px)] flex flex-col gap-6">


        <div className="flex-1 grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Desktop Chat Messages */}
          <Card className="lg:col-span-3 rounded-2xl border-2 border-green-100 shadow-lg overflow-visible flex flex-col">
            <CardHeader className="border-b ">
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  {t("aiAssistant")}
                  {selectedLanguage !== 'en' && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)?.flag} {SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)?.name}
                    </Badge>
                  )}

                </CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] lg:max-w-[70%] p-4 rounded-2xl ${msg.type === "user"
                        ? "bg-green-500 text-white"
                        : "bg-green-50 text-green-800 border border-green-200"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        {msg.type === "bot" && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="h-3 w-3 text-white" />
                          </div>
                        )}
                        {msg.type === "user" && (
                          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          {msg.type === "bot" ? (
                            <div className="text-sm prose prose-sm max-w-none leading-relaxed">
                              <ReactMarkdown
                                components={{
                                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                  strong: ({ children }) => <strong className="font-semibold text-green-900">{children}</strong>,
                                  em: ({ children }) => <em className="italic text-green-800">{children}</em>,
                                  code: ({ children }) => <code className="bg-green-100 px-1 py-0.5 rounded text-xs font-mono text-green-800">{children}</code>,
                                  ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
                                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
                                  li: ({ children }) => <li className="text-sm">{children}</li>,
                                  h1: ({ children }) => <h1 className="text-lg font-bold text-green-900 mb-2">{children}</h1>,
                                  h2: ({ children }) => <h2 className="text-base font-semibold text-green-900 mb-2">{children}</h2>,
                                  h3: ({ children }) => <h3 className="text-sm font-semibold text-green-900 mb-1">{children}</h3>,
                                }}
                              >
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                          )}
                          <p className={`text-xs mt-2 ${msg.type === "user" ? "text-green-100" : "text-green-500"}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Message Input */}
              <div className="border-t p-4 bg-green-50">
                <div className="space-y-3">
                  {/* Recording Status */}
                  {isRecording && (
                    <div className="flex items-center justify-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-sm font-medium text-red-700">
                        {t("recording")} {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                      </span>
                      <span className="text-xs text-red-600">{t("clickStopButton")}</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                      <Paperclip className="h-4 w-4" />
                    </Button>

                    {/* Desktop Language Selector */}
                    <div className="relative language-dropdown-container">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        onClick={() => {
                          console.log('🌍 Opening desktop dropdown, languages:', SUPPORTED_LANGUAGES)
                          setShowDesktopDropdown(!showDesktopDropdown)
                        }}
                      >
                        <Globe className="h-4 w-4 mr-1" />
                        {SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)?.flag}
                        <span className="ml-1 text-xs">({selectedLanguage})</span>
                      </Button>

                      {/* Language Dropdown */}
                      {showDesktopDropdown && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-green-200 rounded-lg shadow-xl z-[9999] min-w-[200px] max-h-60 overflow-y-auto">
                          <div className="p-2 text-xs text-gray-500 border-b bg-white">{t("availableLanguages", { count: SUPPORTED_LANGUAGES.length })}:</div>
                          {SUPPORTED_LANGUAGES.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setSelectedLanguage(lang.code);
                                setShowDesktopDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 hover:bg-green-50 flex items-center gap-2 bg-white ${selectedLanguage === lang.code ? 'bg-green-100 text-green-700' : 'text-gray-700'
                                }`}
                            >
                              <span>{lang.flag}</span>
                              <span className="text-sm">{lang.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        isOnline
                          ? selectedLanguage === 'en'
                            ? t("typeFarmingQuestion")
                            : t("typeQuestionInLanguage", { language: SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)?.name || selectedLanguage })
                          : t("youreOffline")
                      }
                      disabled={!isOnline}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      className="flex-1 rounded-xl border-2"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!isOnline || !message.trim() || isLoading || isPlayingAudio}
                      className="bg-green-500 hover:bg-green-600 rounded-xl px-6"
                    >
                      {isLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : isPlayingAudio ? (
                        <Volume2 className="h-4 w-4 animate-pulse" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>

                    {/* Desktop Live Chat Button */}
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isLoading || isPlayingAudio}
                      className={`rounded-xl transition-all duration-200 ${isRecording
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg scale-105'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                        } ${isLoading || isPlayingAudio ? 'opacity-50 cursor-not-allowed' : ''}`}
                      size="sm"
                    >
                      <div className="flex items-center gap-2">
                        {isRecording ? (
                          <>
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                            <span className="font-semibold">{t("stop")}</span>
                          </>
                        ) : isLoading ? (
                          <>
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            <span className="font-semibold">{t("processing")}</span>
                          </>
                        ) : isPlayingAudio ? (
                          <>
                            <Volume2 className="w-4 h-4 animate-pulse" />
                            <span className="font-semibold">{t("playing")}</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4" />
                            <span className="font-semibold">{t("liveChat")}</span>
                          </>
                        )}
                      </div>
                    </Button>
                  </div>

                  {/* Desktop Quick Questions */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Lightbulb className="h-4 w-4" />
                      <span className="font-medium">{t("quickQuestions")}:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {quickQuestions.map((item, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-green-50 text-green-600 border-green-200 text-sm px-3 py-1.5 transition-colors"
                          onClick={() => handleQuickQuestion(item.question)}
                        >
                          {item.icon}
                          <span className="ml-1.5">{item.text}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
