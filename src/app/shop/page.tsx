'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ShoppingCart, Plus, Minus, Star, Filter, Search } from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number
  category: string
  rating: number
  inStock: boolean
  description: string
}

const products: Product[] = [
  {
    id: 1,
    name: "Premium Rice Flour",
    price: 2500,
    category: "Flours",
    rating: 4.5,
    inStock: true,
    description: "High-quality rice flour perfect for baking and cooking"
  },
  {
    id: 2,
    name: "Organic Maize Meal",
    price: 1800,
    category: "Grains",
    rating: 4.8,
    inStock: true,
    description: "Nutritious organic maize meal for traditional dishes"
  },
  {
    id: 3,
    name: "Cold-Pressed Groundnut Oil",
    price: 3500,
    category: "Oils",
    rating: 4.7,
    inStock: true,
    description: "Pure cold-pressed groundnut oil rich in nutrients"
  },
  {
    id: 4,
    name: "Wheat Flour (All Purpose)",
    price: 2200,
    category: "Flours",
    rating: 4.6,
    inStock: true,
    description: "Versatile all-purpose wheat flour for all baking needs"
  },
  {
    id: 5,
    name: "Soybean Oil",
    price: 2800,
    category: "Oils",
    rating: 4.4,
    inStock: false,
    description: "Healthy soybean oil with multiple cooking applications"
  },
  {
    id: 6,
    name: "Cassava Flour",
    price: 1600,
    category: "Flours",
    rating: 4.3,
    inStock: true,
    description: "Gluten-free cassava flour for alternative baking"
  },
  {
    id: 7,
    name: "Millet Grains",
    price: 2000,
    category: "Grains",
    rating: 4.5,
    inStock: true,
    description: "Nutritious millet grains rich in minerals"
  },
  {
    id: 8,
    name: "Sunflower Oil",
    price: 3200,
    category: "Oils",
    rating: 4.6,
    inStock: true,
    description: "Light sunflower oil perfect for healthy cooking"
  }
]

export default function Shop() {
  const [cart, setCart] = useState<{[key: number]: number}>({})
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchTerm, setSearchTerm] = useState<string>('')
  
  const categories = ['All', 'Flours', 'Grains', 'Oils']
  
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })
  
  const addToCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }))
  }
  
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      const newCart = {...cart}
      delete newCart[productId]
      setCart(newCart)
    } else {
      setCart(prev => ({
        ...prev,
        [productId]: quantity
      }))
    }
  }
  
  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  }
  
  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [productId, quantity]) => {
      const product = products.find(p => p.id === parseInt(productId))
      return sum + (product?.price || 0) * quantity
    }, 0)
  }
  
  const renderStars = (rating: number) => {
    return Array.from({length: 5}, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ))
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Our Shop
              </h1>
              <p className="text-lg text-primary-100">
                Quality agricultural products at competitive prices
              </p>
            </div>
            <div className="bg-white text-primary-600 px-6 py-3 rounded-lg flex items-center space-x-2">
              <ShoppingCart size={24} />
              <div>
                <div className="font-semibold">{getTotalItems()} items</div>
                <div className="text-sm">₦{getTotalPrice().toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Filter size={20} className="mr-2" />
                  Filters
                </h3>
                
                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories
                  </label>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={selectedCategory === category}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="mr-2 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Products ({filteredProducts.length})
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="bg-gray-200 h-48 rounded-t-lg flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <div className="text-sm">Product Image</div>
                        <div className="text-xs mt-1">{product.category}</div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center mb-2">
                        {renderStars(product.rating)}
                        <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">
                        {product.description}
                      </p>
                      
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-2xl font-bold text-primary-600">
                          ₦{product.price.toLocaleString()}
                        </span>
                        <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      
                      {product.inStock ? (
                        <div className="flex items-center space-x-2">
                          {cart[product.id] ? (
                            <div className="flex items-center space-x-2 flex-1">
                              <button
                                onClick={() => updateQuantity(product.id, cart[product.id] - 1)}
                                className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="flex-1 text-center font-semibold">
                                {cart[product.id]}
                              </span>
                              <button
                                onClick={() => updateQuantity(product.id, cart[product.id] + 1)}
                                className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(product.id)}
                              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
                            >
                              <ShoppingCart size={16} className="mr-2" />
                              Add to Cart
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed"
                        >
                          Out of Stock
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">
                    No products found matching your criteria.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
