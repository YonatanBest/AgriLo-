"use client"

import Image from 'next/image'
import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function About_Section() {
  const { t } = useLanguage()

  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid items-center gap-6 grid-cols-1 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
            <div className="w-full flex justify-center">
                <Image
                src="/img-2.png"
                width={550}
                height={310}
                alt="About Agrilo"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center w-full h-auto max-w-[550px]"
                priority
                />
            </div>
            <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">{t('aboutUs')}</h2>
                <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    {t('aboutDescription')}
                </p>
                </div>
            </div>
            </div>
        </div>
    </section>
  )
}
