import { BarChart, Brain, Cloud, Leaf, ShieldCheck, Tractor } from 'lucide-react'
import React from 'react'

export default function Key_F() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">Key Features</h2>
                  <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our AI solutions are designed to address the most pressing challenges faced by modern farmers.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <div className="grid gap-1 text-center">
                  <div className="flex justify-center mb-2">
                    <Tractor className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Precision Farming</h3>
                  <p className="text-gray-500">
                    Optimize planting, irrigation, and harvesting with data-driven insights.
                  </p>
                </div>
                <div className="grid gap-1 text-center">
                  <div className="flex justify-center mb-2">
                    <Brain className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Disease Detection</h3>
                  <p className="text-gray-500">Early identification of crop diseases and pests to minimize losses.</p>
                </div>
                <div className="grid gap-1 text-center">
                  <div className="flex justify-center mb-2">
                    <Cloud className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Weather Prediction</h3>
                  <p className="text-gray-500">
                    Accurate localized weather forecasts to plan farming activities effectively.
                  </p>
                </div>
                <div className="grid gap-1 text-center">
                  <div className="flex justify-center mb-2">
                    <BarChart className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Market Analysis</h3>
                  <p className="text-gray-500">Predict market prices and demand to make informed selling decisions.</p>
                </div>
                <div className="grid gap-1 text-center">
                  <div className="flex justify-center mb-2">
                    <ShieldCheck className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Resource Optimization</h3>
                  <p className="text-gray-500">Efficiently manage water, fertilizer, and energy consumption.</p>
                </div>
                <div className="grid gap-1 text-center">
                  <div className="flex justify-center mb-2">
                    <Leaf className="h-10 w-10 text-green-600" />
        </div>
                  <h3 className="text-xl font-bold text-gray-900">Sustainable Practices</h3>
                  <p className="text-gray-500">
                    Promote eco-friendly farming methods for long-term environmental health.
                  </p>
        </div>
          </div>
        </div>
      </section>
  )
}
