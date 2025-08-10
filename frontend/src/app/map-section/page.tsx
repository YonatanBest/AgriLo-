"use client"
import dynamic from "next/dynamic"

const AnimatedMap = dynamic(() => import("./components/animated-map"), { ssr: false })

export default function MapSectionPage() {
  return <AnimatedMap />
}
