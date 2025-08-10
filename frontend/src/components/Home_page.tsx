import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Leaf, Tractor, Brain, Cloud, BarChart, ShieldCheck } from "lucide-react"

export default function HomePage() {
  return (
    <>
    <div>
      <header className="sticky top-0 left-0 right-0 z-50 px-4 lg:px-6 h-14 flex items-center w-full max-w-7xl mx-auto">
        <Link href="#" className="flex items-center justify-center">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="text-lg font-bold">Agrilo</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
            Features
          </Link>
          <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4">
            About
          </Link>
          <Link href="#contact" className="text-sm font-medium hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>
      </header> 
    </div>
         
   
      <div className="flex flex-col">
        <main className="flex-1">
          <section
            className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: "url('/img-4.webp')" }}
          >
            {/* Overlay for darkening the background image */}
            <div className="absolute inset-0 bg-black/30 pointer-events-none z-0" />
            <div className="container mx-auto px-4 md:px-6 relative z-10">
              <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
                <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                  <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl xl:text-6xl font-bold tracking-tighter text-white break-words drop-shadow-lg">
                      Empowering Farmers with Intelligent AI Solutions
                    </h1>
                    <p className="max-w-[700px] text-green-100 text-base sm:text-lg md:text-xl mx-auto lg:mx-0">
                      Agrilo provides cutting-edge artificial intelligence to optimize crop yields, manage
                      resources, and predict market trends for a more sustainable and profitable future.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
                    <Button asChild className="bg-green-600 hover:bg-green-700 text-white w-full min-[400px]:w-auto">
                      <Link href="/map-section">Get Started</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="bg-green-100 text-green-700 hover:bg-green-700 hover:text-white w-full min-[400px]:w-auto"
                    >
                      <Link href="#features">Learn More</Link>
                    </Button>
                  </div>
                </div>
                <div className="w-full flex justify-center">
                  {/* <Image
                    src="/placeholder.svg?height=550&width=600"
                    width={600}
                    height={550}
                    alt="AI-powered farming"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover w-full h-auto max-w-[600px]"
                    priority
                  /> */}
                </div>
              </div>
            </div>
          </section>

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
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">About Us</h2>
                    <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      At Agrilo, we believe in the power of technology to transform agriculture. Our team of AI
                      specialists, agronomists, and data scientists are dedicated to building intelligent tools that
                      empower farmers to make smarter decisions, increase productivity, and foster sustainable growth. We
                      are committed to supporting the global farming community with innovative and accessible solutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className="w-full py-12 md:py-24 lg:py-32 border-t bg-white">
            <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-gray-900">
                  Ready to Transform Your Farm?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join the future of farming. Sign up for updates or get in touch with our team.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <form className="flex flex-col sm:flex-row gap-2">
                  <Input type="email" placeholder="Enter your email" className="max-w-lg flex-1 min-w-0" />
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                    Sign Up
                  </Button>
                </form>
                <p className="text-xs text-gray-500">
                  We respect your privacy. Read our{" "}
                  <Link href="#" className="underline underline-offset-2 text-green-600 hover:text-green-700">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>
        </main>
        
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
    </>
  )
}
