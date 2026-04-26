'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-gray-100 shadow-lg border-b border-gray-100 fixed top-0 left-0 right-0 z-[9999] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="flex justify-between items-center h-16 sm:h-20 overflow-hidden">
          {/* Logo - Using actual image */}
          <Link href="/" className="flex items-center flex-shrink-0 min-w-0">
            <div className="flex items-center overflow-hidden min-w-0">
              <div className="relative">
                <Image 
                  src="/images/logo1.png" 
                  alt="Afri Processors Logo" 
                  width={300} 
                  height={100} 
                  className="object-contain rounded-lg w-32 sm:w-48 h-auto"
                  priority
                />
              </div>
              
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 sm:space-x-6">
            <Link 
              href="/"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              About Us
            </Link>
            <Link 
              href="/catalog"
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Catalog
            </Link>
            <Link 
              href="/news"
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              News
            </Link>
            <Link 
              href="/contact"
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none p-2"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile menu backdrop */}
        {isMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
        
        {/* Mobile menu */}
        <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <span className="text-base font-semibold text-gray-800">Menu</span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-green-600 focus:outline-none p-1 rounded-md hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="text-gray-700 hover:text-green-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-sm font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-green-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-sm font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/catalog"
              className="text-gray-700 hover:text-green-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-sm font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Catalog
            </Link>
            <Link
              href="/news"
              className="text-gray-700 hover:text-green-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-sm font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              News
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-green-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-sm font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
