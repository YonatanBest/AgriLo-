
"use client"

import { useRef } from "react" // Removed useEffect
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react" // Import useGSAP
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircleIcon, InfoIcon } from "lucide-react"
import Iphone15Pro from "../magicui/iphone-15-pro"
import { useLanguage } from '@/contexts/LanguageContext'

// Register ScrollTrigger plugin once globally
gsap.registerPlugin(ScrollTrigger)

export default function ScrollAnimation() {
  // Refs for the main section and the animated elements
  const sectionRef = useRef(null)
  const phoneRef = useRef(null)
  const faqContainerRef = useRef(null)
  const featuresContainerRef = useRef(null)
  const aboutUsContainerRef = useRef(null)

  const { t, selectedLanguage } = useLanguage();

  // useGSAP hook for all GSAP animations within this component
  useGSAP(
    () => {
      // Get the DOM elements using their refs (current property)
      const phone = phoneRef.current
      const faqContainer = faqContainerRef.current
      const featuresContainer = featuresContainerRef.current
      const aboutUsContainer = aboutUsContainerRef.current

      // Stage 1: Initial View (Top of Scroll)
      // Set initial styles for the phone, FAQ container, Features container, and About Us container.
      gsap.set(phone, {
        width: "300px",
        height: "500px",
        position: "absolute",
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
      })

      // FAQ container: Initially off-screen below, transparent, and set to its final size.
      gsap.set(faqContainer, {
        width: "60%",
        height: "auto",
        position: "absolute",
        left: "10%",
        top: "100%", // Start 100% from the top, effectively off-screen below
        xPercent: 0,
        yPercent: -50,
        opacity: 0,
        padding: "32px",
      })

      // Features container: Initially off-screen below, transparent, and set to its final size.
      gsap.set(featuresContainer, {
        width: "60%",
        height: "auto",
        position: "absolute",
        left: "10%",
        top: "100%", // Start 100% from the top, off-screen below
        xPercent: 0,
        yPercent: -50,
        opacity: 0,
        padding: "32px",
      })

      // About Us container: Initially off-screen below, transparent, and set to its final size.
      gsap.set(aboutUsContainer, {
        width: "60%",
        height: "auto",
        position: "absolute",
        left: "10%",
        top: "100%", // Start 100% from the top, off-screen below
        xPercent: 0,
        yPercent: -50,
        opacity: 0,
        padding: "32px",
      })

      // Create a GSAP timeline for the scroll-triggered animation.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current, // Use sectionRef.current as the trigger
          start: "top top",
          end: "+=1200", // Significantly reduced duration for faster animation
          scrub: true,
          pin: true,
          pinSpacing: true,
          // markers: true, // Uncomment for debugging
        },
      })

      // Phase 1: Phone moves right, FAQ slides in from bottom
      tl.to(
        phone,
        {
          left: "calc(100% - 25% - 20px)",
          xPercent: 0,
          ease: "power1.inOut",
        },
        0,
      )
        .to(
          faqContainer,
          {
            top: "50%",
            opacity: 1,
            ease: "power1.inOut",
          },
          0,
        )

        // Phase 2: FAQ slides out top, Features slides in from bottom
        .to(
          faqContainer,
          {
            top: "0%",
            opacity: 0,
            ease: "power1.inOut",
          },
          "+=0.2",
        )
        .to(
          featuresContainer,
          {
            top: "50%",
            opacity: 1,
            ease: "power1.inOut",
          },
          "<",
        )

        // Phase 3: Features slides out top, About Us slides in from bottom
        .to(
          featuresContainer,
          {
            top: "0%",
            opacity: 0,
            ease: "power1.inOut",
          },
          "+=0.2",
        )
        .to(
          aboutUsContainer,
          {
            top: "50%",
            opacity: 1,
            ease: "power1.inOut",
          },
          "<",
        )
    },
    { scope: sectionRef }, // The scope for useGSAP, automatically handles cleanup
  )

  // Define FAQ data based on selected language
  const faqs = [
    {
      question: t('faq1q') || "How does Agrilo's AI crop recommendation work?",
      answer: t('faq1a') || "Our AI analyzes your soil type, location, weather patterns, and farming goals to provide personalized crop recommendations that maximize yield and sustainability.",
    },
    {
      question: t('faq2q') || "What data does Agrilo use for analysis?",
      answer: t('faq2a') || "We use soil composition data, weather forecasts, historical crop performance, market prices, and local agricultural practices to generate accurate recommendations.",
    },
    {
      question: t('faq3q') || "Is Agrilo suitable for all types of farming?",
      answer: t('faq3a') || "Yes! Agrilo works for small-scale family farms, large commercial operations, and everything in between. Our recommendations adapt to your specific farming context.",
    },
  ];
  // Define Key Features data based on selected language
  const features = [
    t('feature1') || "AI-Powered Crop Recommendations",
    t('feature2') || "Real-Time Weather Integration",
    t('feature3') || "Soil Analysis & Mapping",
    t('feature4') || "Multi-Language Support",
    t('feature5') || "Precision Farming Tools",
  ];
  // Define About Us content based on selected language
  const aboutUsContent = {
    title: t('aboutUsTitle') || "About Agrilo Platform",
    description: t('aboutUsDescription') || "Agrilo is a revolutionary agricultural technology platform that combines artificial intelligence, data science, and precision farming to help farmers make smarter decisions. Our platform analyzes soil conditions, weather patterns, and market trends to provide personalized crop recommendations that maximize yield while promoting sustainable farming practices.",
    mission: t('aboutUsMission') || "Empowering farmers worldwide with AI-driven agricultural insights for a sustainable future.",
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center bg-white overflow-hidden"
    >
      {/* Phone element: Represents the phone device, initially centered */}
      <div
        ref={phoneRef}
        className="text-white text-2xl font-bold flex items-center justify-center rounded-3xl z-10"
      >
        <Iphone15Pro
          className="size-full"
          videoSrc="/Video.mp4"
      />
      </div>

          {/* FAQ Toggles Container: Initially hidden, slides in, then slides out */}
      <div
        ref={faqContainerRef}
        className="bg-gray-100 rounded-lg shadow-inner text-gray-800 max-h-[80vh] overflow-hidden"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">{t('faqs') || 'FAQs'}</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Key Features Container: Initially hidden, slides in to replace FAQ, then slides out */}
      <div
        ref={featuresContainerRef}
        className="bg-purple-100 p-8 rounded-lg shadow-inner text-gray-800 max-h-[80vh] overflow-hidden"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">{t('keyFeatures') || 'Key Features'}</h2>
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-lg">
              <CheckCircleIcon className="h-6 w-6 text-purple-600 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* About Us Container: Initially hidden, slides in to replace Features */}
      <div
        ref={aboutUsContainerRef}
        className="bg-green-100 p-8 rounded-lg shadow-inner text-gray-800 max-h-[80vh] overflow-hidden"
      >
        <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3">
          <InfoIcon className="h-8 w-8 text-green-600" />
          {aboutUsContent.title}
        </h2>
        <p className="text-lg mb-4 text-center">{aboutUsContent.description}</p>
        <p className="text-md font-semibold text-center text-green-700">{t('mission') || 'Mission'}: {aboutUsContent.mission}</p>
      </div>


     
    </section>
  )
}
