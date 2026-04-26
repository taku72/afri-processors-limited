'use client'

import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowRight, CheckCircle, Users, Award, Truck, Globe } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrameId: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isVisible, end, duration])

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-primary-700 mb-2">
      {count}{suffix}
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Main Content with padding for fixed header */}
      <div className="pt-16 sm:pt-20">
        {/* Hero Section */}
      <section className="relative text-white">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Agricultural processing background"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-36">
          <div className="relative text-center z-10">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 sm:mb-4">
                Nourishing the Nation
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-4 sm:mb-6 text-white opacity-90 max-w-3xl mx-auto">
                Afri Processors Limited's Journey of Excellence Since 1990
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link 
                href="/catalog" 
                className="inline-flex items-center justify-center bg-white text-primary-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-primary-50 transition-colors"
              >
                Explore Products
                <ArrowRight className="ml-2" size={16} />
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center border-2 border-white text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-white hover:text-primary-700 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600">
                <AnimatedCounter end={35} suffix="+" duration={2500} />
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Years Experience</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600">
                <AnimatedCounter end={250} suffix="+" duration={2200} />
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Retail Outlets</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600">
                <AnimatedCounter end={15} duration={2000} />
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Branch Offices</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600">
                <AnimatedCounter end={50} suffix="+" duration={1800} />
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Product Lines</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose Afri Processors?
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              We deliver excellence in agricultural processing
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Award className="text-primary-600" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Quality Assurance</h3>
              <p className="text-sm sm:text-base text-gray-600">
                International standards and quality control at every step of processing
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Truck className="text-primary-600" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Reliable Delivery</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Timely and efficient delivery across Nigeria and beyond
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Globe className="text-primary-600" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Sustainable Practices</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Environmentally friendly processing methods for a better future
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Message Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Founder's Message
              </h2>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-primary-600 mb-2">CHIEF ADEKUNLE AFOLABI – Founder</h3>
                <p className="text-gray-600 italic">Born in 1955, Chief Afolabi established Afri Processors Ltd in 1990 with a vision to transform agricultural processing in Africa.</p>
              </div>
              <p className="text-gray-700 mb-4">
                In the late 1980s, I recognized the immense potential in Nigeria's agricultural sector. Despite the challenges, I saw an opportunity to create a company that would not only process high-quality agricultural products but also empower local farmers and contribute to food security in our nation.
              </p>
              <p className="text-gray-700 mb-6">
                What started as a small milling operation with just 12 employees has grown into a comprehensive food processing company employing over 1,200 people across Nigeria. Our commitment to quality, innovation, and sustainable practices has been the cornerstone of our success.
              </p>
              <Link 
                href="/about" 
                className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700"
              >
                Read More About Our Story
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Users className="mx-auto mb-4" size={64} />
                <p>Founder's Image</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company History Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Something About Afri History
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-6 text-center">
              Afri Processors Limited was founded in 1990 by Chief Afolabi, whose business activities in Nigeria date back over four decades. From a small flour milling company, Afri Processors has over the years grown into a major force in the agro-processing industry in Nigeria and has gained an enviable international reputation in this area of business.
            </p>
            <p className="text-lg text-gray-700 text-center">
              The company has a proud heritage of product innovation and commitment to delivery. Our strength lies in our adaptability, giving rise to an unrivalled turnkey operations platform which actively supports the progress of our agricultural economy.
            </p>
          </div>
        </div>
      </section>

      {/* Product Portfolio Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Products Portfolio
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Explore Our Top Brands
            </p>
            <Link 
              href="/catalog" 
              className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Explore All Products
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              'Premium Flour',
              'Golden Rice',
              'Afri Oil',
              'Maize Meal',
              'Peanut Butter',
              'Instant Milk',
              'Food Supplement',
              'Bread Spread',
              'Fruit Juice',
              'Protein Powder',
              'Cereal Mix',
              'Baking Flour'
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
                <div className="bg-gray-200 h-32 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-gray-400 text-sm text-center">{product}</div>
                </div>
                <h3 className="font-semibold text-gray-900 text-center">{product}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive agricultural processing solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex items-start space-x-4">
              <CheckCircle className="text-primary-600 mt-1 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-xl font-semibold mb-2">Grain Processing</h3>
                <p className="text-gray-600">
                  Professional processing of various grains including rice, maize, wheat, and more
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="text-primary-600 mt-1 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-xl font-semibold mb-2">Oil Extraction</h3>
                <p className="text-gray-600">
                  Advanced oil extraction from seeds and nuts with high efficiency
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="text-primary-600 mt-1 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-xl font-semibold mb-2">Packaging Solutions</h3>
                <p className="text-gray-600">
                  Modern packaging facilities to preserve product quality and extend shelf life
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="text-primary-600 mt-1 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-xl font-semibold mb-2">Quality Testing</h3>
                <p className="text-gray-600">
                  Comprehensive quality testing and certification services
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Work With Us?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join hundreds of satisfied customers who trust Afri Processors
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  )
}
