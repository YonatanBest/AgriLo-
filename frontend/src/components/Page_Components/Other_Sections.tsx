"use client"

import Link from 'next/link'
import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function Other_Sections() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 border-t bg-white">
        <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-gray-900">
                Ready to Transform Your Farm?
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-4">
                <Button asChild className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold">
                    <Link href={isAuthenticated ? "/main-page" : "/auth-options"}>
                        {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                    </Link>
                </Button>
            </div>
        </div>
        </section>

        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-100 text-center sm:text-left">
            <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Agrilo. All rights reserved.
            </p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-600">
                Terms of Service
            </Link>
            <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-600">
                Privacy
            </Link>
            </nav>
        </footer>
    </div>
  )
}
