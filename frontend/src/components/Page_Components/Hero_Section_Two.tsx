"use client"

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "../ui/button";
import Link from "next/link";
import { BarChart, Brain, Cloud, Leaf, ShieldCheck, Tractor, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/contexts/LanguageContext";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);


const HeroSectionTwo: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const heroButtonsRef = useRef<HTMLDivElement>(null);
  const featuresSectionRef = useRef<HTMLElement>(null);
  const featureCardsRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const { selectedLanguage, setSelectedLanguage, t } = useLanguage();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  useGSAP(() => {
    if (!headerRef.current) return;
    gsap.set(headerRef.current, {
      borderRadius: 0,
      left: 0,
      xPercent: 0,
      width: "100%",
      top: 0,
      boxShadow: "0",
      background: "rgba(255,255,255,0)",
      border: "none",
    });

    // Hero section text animations
    const heroTimeline = gsap.timeline({ delay: 0.2 });
    
    // Animate hero title with a simple fade-in and slide-up effect
    if (heroTitleRef.current) {
      heroTimeline.fromTo(heroTitleRef.current, 
        {
          opacity: 0,
          y: 20,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        }
      );
    }

    // Animate subtitle
    if (heroSubtitleRef.current) {
      heroTimeline.fromTo(heroSubtitleRef.current, 
        {
          opacity: 0,
          y: 15,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power2.out"
        }, 0.3
      );
    }

    // Animate buttons
    if (heroButtonsRef.current) {
      heroTimeline.fromTo(heroButtonsRef.current, 
        {
          opacity: 0,
          y: 15,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power2.out"
        }, 0.6
      );
    }

    // Features section scroll animations
    if (featuresSectionRef.current && featureCardsRef.current) {
      const featureCards = featureCardsRef.current.children;
      
      gsap.fromTo(featureCards, 
        {
          opacity: 0,
          y: 30,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featuresSectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate feature icons with rotation
      Array.from(featureCards).forEach((card, index) => {
        const icon = card.querySelector('svg');
        if (icon) {
          gsap.fromTo(icon,
            {
              rotation: -90,
              scale: 0
            },
            {
              rotation: 0,
              scale: 1,
              duration: 0.6,
              ease: "back.out(1.4)",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!headerRef.current) return;
      if (window.scrollY > 30) {
        setScrolled(true);
        gsap.to(headerRef.current, {
          duration: 0.15,
          borderRadius: 24,
          left: "50%",
          xPercent: -50,
          width: "95vw",
          maxWidth: 768,
          top: 16,
          background: "rgba(255,255,255,0.9)",
          boxShadow: "0 4px 32px 0 rgba(0,0,0,0.10)",
          border: "1px solid #e5e7eb",
          ease: "power2.inOut",
        });
      } else {
        setScrolled(false);
        gsap.to(headerRef.current, {
          duration: 0.15,
          borderRadius: 0,
          left: 0,
          xPercent: 0,
          width: "100%",
          maxWidth: "100vw",
          top: 0,
          background: "rgba(255,255,255,0)",
          boxShadow: "0 0px 0px 0 rgba(0,0,0,0)",
          border: "none",
          ease: "power2.inOut",
        });
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Animated Header */}
      <div
        ref={headerRef}
        className="fixed z-50 flex items-center justify-between px-6 py-3 w-full"
        style={{
          top: 0,
          left: 0,
          color: scrolled ? "#111" : "#fff", // fallback for text
          background: scrolled ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0)",
          transition: "background 0.3s, color 0.3s",
        }}
      >
        <span className={`flex font-bold text-lg transition-colors duration-300 ${scrolled ? "text-black" : "text-white"}`}>
          <Leaf className={`h-6 w-6 ${scrolled ? "text-green-600" : "text-white"}`} />
          Agrilo
        </span>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <a
            href="#"
            className={`hover:underline transition-colors duration-300 ${scrolled ? "text-black" : "text-white"}`}
          >
            {t('aboutUs')}
          </a>
          <a
            href="#features"
            className={`hover:underline transition-colors duration-300 ${scrolled ? "text-black" : "text-white"}`}
          >
            {t('keyFeatures')}
          </a>
        </nav>
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className={`px-3 py-1 rounded-md text-xs font-medium shadow-sm transition-all duration-300
                ${scrolled
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/20"}
              `}
            >
              <Globe className="h-4 w-4 mr-1" />
              {SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)?.flag}
            </Button>
            
            {showLanguageDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                <div className="py-1">
                  {SUPPORTED_LANGUAGES.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setSelectedLanguage(language.code);
                        setShowLanguageDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 ${
                        selectedLanguage === language.code ? 'bg-green-50 text-green-700' : 'text-gray-700'
                      }`}
                    >
                      <span className="text-lg">{language.flag}</span>
                      <span>{language.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <Button asChild
            className={`px-3 py-1 rounded-md text-xs font-medium shadow-sm transition-all duration-300
              ${scrolled
                ? "bg-primary text-white hover:bg-green-900"
                : "bg-white text-gray-900 hover:bg-white/40"}
            `}
          >
            <Link href="/auth-options">{t('signIn')}</Link>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section
            className="w-full py-12 sm:py-15 md:py-20 lg:py-32 xl:py-48 bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: "url('/img-4.jpg')" }}
          >
            {/* Overlay for darkening the background image */}
            <div className="absolute inset-0 bg-black/30 pointer-events-none z-0" />
            <div className="top-13 md:top-0 container mx-auto px-2 sm:px-4 md:px-6 relative z-10">
              <div className="flex flex-col items-center justify-center text-center gap-6 sm:gap-8">
                <div className="space-y-3 sm:space-y-4 w-full max-w-xl sm:max-w-2xl">
                  <h1 
                    ref={heroTitleRef}
                    className="text-xl xs:text-2xl sm:text-3xl md:text-5xl xl:text-6xl font-bold tracking-tighter text-white break-words drop-shadow-lg"
                    style={{ opacity: 0, transform: 'translateY(20px)' }}
                  >
                    {t('heroTitle')}
                  </h1>
                  <p 
                    ref={heroSubtitleRef}
                    className="max-w-[90vw] sm:max-w-[700px] text-green-100 text-[10px] xs:text-base sm:text-lg md:text-[15px] mx-auto"
                    style={{ opacity: 0, transform: 'translateY(20px)' }}
                  >
                    {t('heroSubtitle')}
                  </p>
                </div>
                <div 
                  ref={heroButtonsRef}
                  className="flex flex-col gap-2 sm:flex-row justify-center w-full max-w-xs sm:max-w-md mx-auto"
                  style={{ opacity: 0, transform: 'translateY(20px)' }}
                >
                  <Button asChild className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                    <Link href={isAuthenticated ? "/main-page" : "/auth-options"}>
                      {isAuthenticated ? t('goToDashboard') : t('getStarted')}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="bg-green-100 text-green-700 hover:bg-green-700 hover:text-white w-full sm:w-auto"
                  >
                    <Link href="#features">{t('learnMore')}</Link>
                  </Button>
                </div>
                <div className="w-full flex justify-center mt-6 sm:mt-8">
                  {/* <Image
                    src="/placeholder.svg?height=550&width=600"
                    width={320}
                    height={220}
                    alt="AI-powered farming"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover w-full h-auto max-w-[90vw] sm:max-w-[400px] md:max-w-[600px]"
                    priority
                  /> */}
                </div>
              </div>
            </div>
          </section>

          <section ref={featuresSectionRef} id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">{t('keyFeatures')}</h2>
                  <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    {t('featuresSubtitle')}
                  </p>
                </div>
              </div>
              <div ref={featureCardsRef} className="mx-auto grid max-w-5xl items-start gap-8 py-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <div className="grid gap-1 text-center p-6 rounded-lg hover:bg-green-50 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group">
                  <div className="flex justify-center mb-2">
                    <Tractor className="h-10 w-10 text-green-600 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300">{t('precisionFarming')}</h3>
                  <p className="text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                    {t('precisionFarmingDesc')}
                  </p>
                </div>
                <div className="grid gap-1 text-center p-6 rounded-lg hover:bg-green-50 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group">
                  <div className="flex justify-center mb-2">
                    <Brain className="h-10 w-10 text-green-600 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300">{t('diseaseDetection')}</h3>
                  <p className="text-gray-500 group-hover:text-gray-700 transition-colors duration-300">{t('diseaseDetectionDesc')}</p>
                </div>
                <div className="grid gap-1 text-center p-6 rounded-lg hover:bg-green-50 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group">
                  <div className="flex justify-center mb-2">
                    <Cloud className="h-10 w-10 text-green-600 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300">{t('weatherPrediction')}</h3>
                  <p className="text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                    {t('weatherPredictionDesc')}
                  </p>
                </div>
                <div className="grid gap-1 text-center p-6 rounded-lg hover:bg-green-50 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group">
                  <div className="flex justify-center mb-2">
                    <BarChart className="h-10 w-10 text-green-600 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300">{t('marketAnalysis')}</h3>
                  <p className="text-gray-500 group-hover:text-gray-700 transition-colors duration-300">{t('marketAnalysisDesc')}</p>
                </div>
                <div className="grid gap-1 text-center p-6 rounded-lg hover:bg-green-50 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group">
                  <div className="flex justify-center mb-2">
                    <ShieldCheck className="h-10 w-10 text-green-600 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300">{t('resourceOptimization')}</h3>
                  <p className="text-gray-500 group-hover:text-gray-700 transition-colors duration-300">{t('resourceOptimizationDesc')}</p>
                </div>
                <div className="grid gap-1 text-center p-6 rounded-lg hover:bg-green-50 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group">
                  <div className="flex justify-center mb-2">
                    <Leaf className="h-10 w-10 text-green-600 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300">{t('sustainablePractices')}</h3>
                  <p className="text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                    {t('sustainablePracticesDesc')}
                  </p>
                </div>
              </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSectionTwo;
