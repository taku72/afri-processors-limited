'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, Filter, Grid, List, ChevronDown, Star, Package, Truck, Shield } from 'lucide-react'

// Product interface
interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  sku: string
  stock: number
  image: string
  rating: number
  reviews: number
  created_at: string
  unit?: string
  features?: string[]
  specifications?: string | Record<string, any>
}

// Fetch products from database
const fetchProducts = async () => {
  try {
    console.log('Catalog: Making API call to /api/catalog-products...')
    const response = await fetch('/api/catalog-products')
    console.log('Catalog: API response status:', response.status)
    const data = await response.json()
    console.log('Catalog: API response data:', data)
    return data.products || []
  } catch (error) {
    console.error('Catalog: Error fetching products:', error)
    return []
  }
}

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('name')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('Catalog: Starting to fetch products...')
    fetchProducts().then(data => {
      console.log('Catalog: Products fetched:', data)
      setProducts(data)
      setIsLoading(false)
    }).catch(error => {
      console.error('Catalog: Error fetching products:', error)
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    console.log('Catalog: Filtering products...', { products, searchTerm, selectedCategory, sortBy })
    
    // Filter products based on search and category
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    console.log('Catalog: Filtered products:', filtered)

    // Sort products
    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      return 0
    })

    console.log('Catalog: Setting filtered products:', filtered)
    setFilteredProducts(filtered)
  }, [searchTerm, selectedCategory, sortBy, products])

  const categories = ['all', 'Seeds', 'Legumes', 'Processed Foods']

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-agri-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Product Catalog
            </h1>
            <p className="text-lg text-primary-100">
              Browse our comprehensive range of agricultural processing products
            </p>
          </div>
        </div>
      </section>

      {/* Catalog Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filters Bar */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="lg:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="lg:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Sort by Rating</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Products Display */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading products...</h3>
            </div>
          ) : (
            <div>
              <div className="text-center py-4 bg-blue-100 rounded mb-4">
                <p className="text-sm text-blue-800">
                  Debug: isLoading={isLoading}, filteredProducts.length={filteredProducts.length}, products.length={products.length}
                </p>
              </div>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {filteredProducts.map(product => (
                    <div key={product.id} className={viewMode === 'grid' ? 'bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6' : 'bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex items-center space-x-4'}>
                  {viewMode === 'grid' ? (
                    <>
                      {/* Product Image */}
                      <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                        <Package size={48} className="text-gray-400" />
                      </div>

                      {/* Product Info */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-700">${product.price}</span>
                          <span className="text-sm text-gray-500">/{product.unit || 'unit'}</span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">({product.reviews} reviews)</span>
                        </div>

                        {/* Features */}
                        <div className="space-y-1">
                          {product.features?.slice(0, 2).map((feature: any, index: any) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Shield size={16} className="text-green-600" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* List View */}
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package size={48} className="text-gray-400" />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-green-700">${product.price}</span>
                            <span className="text-sm text-gray-500">/{product.unit || 'unit'}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600">{product.description}</p>
                        
                        <div className="flex items-center space-x-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">({product.reviews} reviews)</span>
                        </div>

                        <div className="text-sm text-gray-700">
                          <strong>Specifications:</strong> {typeof product.specifications === 'string' ? product.specifications : JSON.stringify(product.specifications)}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {product.features?.map((feature: any, index: any) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
