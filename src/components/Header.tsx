'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Simple text version */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary-600">
                <span className="text-white font-bold text-lg">AP</span>
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-primary-700 leading-tight">
                  Afri Processors
                </h1>
                <p className="text-xs text-gray-600 leading-tight">
                  Quality Agricultural Processing
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-primary-700 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-primary-700 transition-colors font-medium"
            >
              About Us
            </Link>
            <Link 
              href="/shop" 
              className="text-gray-700 hover:text-primary-700 transition-colors font-medium"
            >
              Shop
            </Link>
            <Link 
              href="/catalog" 
              className="text-gray-700 hover:text-primary-700 transition-colors font-medium"
            >
              Product Catalog
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-primary-700 transition-colors font-medium"
            >
              Contact
            </Link>
            <Link 
              href="/news" 
              className="text-gray-700 hover:text-primary-700 transition-colors font-medium"
            >
              News
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-700 focus:outline-none p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-2 space-y-1">
              <Link 
                href="/" 
                className="block px-3 py-2 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="block px-3 py-2 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/shop" 
                className="block px-3 py-2 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                href="/catalog" 
                className="block px-3 py-2 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Product Catalog
              </Link>
              <Link 
                href="/contact" 
                className="block px-3 py-2 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href="/news" 
                className="block px-3 py-2 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                News
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
