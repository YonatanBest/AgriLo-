"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface DiagnosisData {
  cropIdentified?: string
  identifiedProblems?: string[]
  symptomsNoticed?: string[]
  probableCauses?: string[]
  recommendedActions?: string[]
  preventionTips?: string[]
  severityLevel?: string
  overallHealth?: string
  confidenceLevel?: string
  rawResults?: any
}

interface DiagnosisContextType {
  diagnosisData: DiagnosisData | null
  setDiagnosisData: (data: DiagnosisData | null) => void
  clearDiagnosisData: () => void
}

const DiagnosisContext = createContext<DiagnosisContextType | undefined>(undefined)

export function DiagnosisProvider({ children }: { children: ReactNode }) {
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null)

  const clearDiagnosisData = () => {
    setDiagnosisData(null)
  }

  return (
    <DiagnosisContext.Provider value={{ diagnosisData, setDiagnosisData, clearDiagnosisData }}>
      {children}
    </DiagnosisContext.Provider>
  )
}

export function useDiagnosis() {
  const context = useContext(DiagnosisContext)
  if (context === undefined) {
    throw new Error('useDiagnosis must be used within a DiagnosisProvider')
  }
  return context
} 