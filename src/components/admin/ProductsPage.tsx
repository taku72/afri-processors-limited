'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Package, Plus, Edit2, Trash2, Search, Filter, PlusCircle, Eye, EyeOff, Tag, DollarSign, TrendingUp, AlertCircle, Check 
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Product {
  id: string
  name: string
  description: string
  sku: string
  category_id: string
  price: number
  stock_quantity: number
  status: string
  image_url: string | null
  created_at: string
  updated_at: string
}

interface Category {
  id: string
  name: string
  description: string
  slug: string
  image_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

interface ProductStats {
  totalProducts: number
  activeProducts: number
  inactiveProducts: number
  totalCategories: number
  lowStockProducts: number
  outOfStockProducts: number
  totalValue: number
  recentProducts: number
  lastUpdated: string
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [stats, setStats] = useState<ProductStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [success, setSuccess] = useState('')
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Form states
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    sku: '',
    category_id: '',
    price: '',
    stock_quantity: '',
    status: 'active',
    image_url: ''
  })

  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    sku: '',
    category_id: '',
    price: '',
    stock_quantity: '',
    status: 'active'
  })

  useEffect(() => {
    // Check session
    const sessionData = localStorage.getItem('adminSession')
    
    if (!sessionData) {
      router.push('/admin/login')
      return
    }
    
    let userData
    try {
      userData = JSON.parse(sessionData)
    } catch {
      router.push('/admin/login')
      return
    }

    // Check if user has permission
    if (userData.role !== 'super_admin') {
      router.push('/admin')
      return
    }

    // Fetch real products, categories and stats from database
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      await Promise.all([fetchProducts(), fetchCategories(), fetchStats()])
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const sessionData = localStorage.getItem('adminSession')
      if (!sessionData) {
        throw new Error('No session found')
      }

      const userData = JSON.parse(sessionData)
      const authHeader = 'Basic ' + btoa(`${userData.username}:${userData.username}`)

      // Build query with optional filters
      let query = supabase
        .from('products')
        .select(`
          *,
          product_categories(id, name, slug)
        `)
        .order('created_at', { ascending: false })

      // Add category filter if selected
      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory)
      }

      // Add search filter if search query exists
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%`)
          .or(`description.ilike.%${searchQuery}%`)
          .or(`sku.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error('Database error:', error)
        throw new Error('Failed to fetch products')
      }

      console.log('Products Response:', data)
      console.log('Number of products received:', data?.length || 0)
      
      setProducts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    }
  }

  const fetchCategories = async () => {
    try {
      const sessionData = localStorage.getItem('adminSession')
      if (!sessionData) {
        throw new Error('No session found')
      }

      const userData = JSON.parse(sessionData)
      const authHeader = 'Basic ' + btoa(`${userData.username}:${userData.username}`)

      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('Database error:', error)
        throw new Error('Failed to fetch categories')
      }

      console.log('Categories Response:', data)
      
      setCategories(data || [])
    } catch (err) {
      console.error('Failed to fetch categories:', err)
      // Don't set error for categories failure, just log it
    }
  }

  const fetchStats = async () => {
    try {
      const sessionData = localStorage.getItem('adminSession')
      if (!sessionData) {
        throw new Error('No session found')
      }

      const userData = JSON.parse(sessionData)
      const authHeader = 'Basic ' + btoa(`${userData.username}:${userData.username}`)

      // Get all products for statistics
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('status, price, stock_quantity, created_at')

      // Get all categories
      const { data: categories, error: categoriesError } = await supabase
        .from('product_categories')
        .select('id, is_active')

      if (productsError || categoriesError) {
        console.error('Database error:', productsError || categoriesError)
        throw new Error('Failed to fetch product stats')
      }

      const totalProducts = products?.length || 0
      const activeProducts = products?.filter(p => p.status === 'active').length || 0
      const inactiveProducts = products?.filter(p => p.status === 'inactive').length || 0
      const totalCategories = categories?.length || 0
      const lowStockProducts = products?.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10).length || 0
      const outOfStockProducts = products?.filter(p => p.stock_quantity === 0).length || 0
      
      // Calculate total value
      const totalValue = products?.reduce((sum, product) => {
        const price = parseFloat(product.price || '0')
        return sum + price
      }, 0)

      // Recent products (created in last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const recentProducts = products?.filter(p => 
        new Date(p.created_at) > sevenDaysAgo
      ).length || 0

      const stats = {
        totalProducts,
        activeProducts,
        inactiveProducts,
        totalCategories,
        lowStockProducts,
        outOfStockProducts,
        totalValue,
        recentProducts,
        lastUpdated: new Date().toISOString()
      }

      console.log('Stats Response:', stats)
      
      setStats(stats)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
      // Don't set error for stats failure, just log it
    }
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!createForm.name.trim()) {
      setError('Product name is required')
      return
    }
    
    if (!createForm.description.trim()) {
      setError('Product description is required')
      return
    }
    
    if (!createForm.sku.trim()) {
      setError('SKU is required')
      return
    }
    
    if (!createForm.category_id) {
      setError('Category is required')
      return
    }
    
    const price = parseFloat(createForm.price)
    if (isNaN(price) || price <= 0) {
      setError('Price must be a positive number')
      return
    }
    
    const stockQuantity = parseInt(createForm.stock_quantity)
    if (isNaN(stockQuantity) || stockQuantity < 0) {
      setError('Stock quantity must be a non-negative number')
      return
    }

    try {
      const sessionData = localStorage.getItem('adminSession')
      if (!sessionData) {
        throw new Error('No session found')
      }

      const userData = JSON.parse(sessionData)
      const authHeader = 'Basic ' + btoa(`${userData.username}:${userData.username}`)

      // Check if SKU already exists
      const { data: existingProduct, error: checkError } = await supabase
        .from('products')
        .select('id')
        .eq('sku', createForm.sku)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Database error:', checkError)
        throw new Error('Failed to check SKU')
      }

      if (existingProduct) {
        setError('SKU already exists')
        return
      }

      // Create new product
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: createForm.name,
          description: createForm.description,
          sku: createForm.sku,
          category_id: createForm.category_id,
          price: parseFloat(createForm.price),
          stock_quantity: parseInt(createForm.stock_quantity),
          status: createForm.status || 'active',
          image_url: previewImage || null
        }])
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        throw new Error('Failed to create product')
      }

      setSuccess('Product created successfully!')
      setShowCreateModal(false)
      setCreateForm({
        name: '',
        description: '',
        sku: '',
        category_id: '',
        price: '',
        stock_quantity: '',
        status: 'active',
        image_url: ''
      })
      setPreviewImage(null)
      fetchData() // Refresh products and stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product')
    }
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedProduct) return

    // Validation
    if (!editForm.name.trim()) {
      setError('Product name is required')
      return
    }
    
    if (!editForm.description.trim()) {
      setError('Product description is required')
      return
    }
    
    if (!editForm.sku.trim()) {
      setError('SKU is required')
      return
    }
    
    const price = parseFloat(editForm.price)
    if (isNaN(price) || price <= 0) {
      setError('Price must be a positive number')
      return
    }
    
    const stockQuantity = parseInt(editForm.stock_quantity)
    if (isNaN(stockQuantity) || stockQuantity < 0) {
      setError('Stock quantity must be a non-negative number')
      return
    }

    try {
      const sessionData = localStorage.getItem('adminSession')
      if (!sessionData) {
        throw new Error('No session found')
      }

      const userData = JSON.parse(sessionData)
      const authHeader = 'Basic ' + btoa(`${userData.username}:${userData.username}`)

      // Check if SKU already exists (excluding current product)
      const { data: existingProduct, error: checkError } = await supabase
        .from('products')
        .select('id')
        .eq('sku', editForm.sku)
        .neq('id', selectedProduct.id)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Database error:', checkError)
        throw new Error('Failed to check SKU')
      }

      if (existingProduct) {
        setError('SKU already exists')
        return
      }

      // Update product
      const { data, error } = await supabase
        .from('products')
        .update({
          id: selectedProduct.id,
          name: editForm.name,
          description: editForm.description,
          sku: editForm.sku,
          category_id: editForm.category_id,
          price: parseFloat(editForm.price),
          stock_quantity: parseInt(editForm.stock_quantity),
          status: editForm.status,
          image_url: previewImage || selectedProduct.image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProduct.id)
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        throw new Error('Failed to update product')
      }

      setSuccess('Product updated successfully!')
      setShowEditModal(false)
      setSelectedProduct(null)
      setEditForm({
        name: '',
        description: '',
        sku: '',
        category_id: '',
        price: '',
        stock_quantity: '',
        status: 'active'
      })
      setPreviewImage(null)
      fetchData() // Refresh products and stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    try {
      const sessionData = localStorage.getItem('adminSession')
      if (!sessionData) {
        throw new Error('No session found')
      }

      const userData = JSON.parse(sessionData)
      const authHeader = 'Basic ' + btoa(`${userData.username}:${userData.username}`)

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) {
        console.error('Database error:', error)
        throw new Error('Failed to delete product')
      }

      setSuccess('Product deleted successfully!')
      fetchData() // Refresh products and stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product')
    }
  }

  const openEditModal = (product: Product) => {
    console.log('Opening edit modal for product:', product)
    setSelectedProduct(product)
    setEditForm({
      name: product.name,
      description: product.description,
      sku: product.sku,
      category_id: product.category_id,
      price: product.price.toString(),
      stock_quantity: product.stock_quantity.toString(),
      status: product.status
    })
    setShowEditModal(true)
    setPreviewImage(product.image_url)
  }

  const filteredProducts = products.filter(product =>
    (selectedCategory === 'all' || product.category_id === selectedCategory) &&
    (searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category?.name || 'Unknown'
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result
        setPreviewImage(result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-2 sm:px-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-xs sm:text-base text-gray-600 mt-1">Manage your product catalog and inventory</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-3 sm:mt-0 inline-flex items-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Add Product
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{stats.totalProducts}</p>
                <p className="text-xs text-gray-500 mt-1">All products</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-blue-500 flex-shrink-0 ml-2">
                <Package className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{stats.activeProducts}</p>
                <p className="text-xs text-gray-500 mt-1">Currently active</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-green-500 flex-shrink-0 ml-2">
                <Package className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Categories</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{stats.totalCategories}</p>
                <p className="text-xs text-gray-500 mt-1">Product categories</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-purple-500 flex-shrink-0 ml-2">
                <Tag className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{stats.lowStockProducts}</p>
                <p className="text-xs text-gray-500 mt-1">Need restock</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-orange-500 flex-shrink-0 ml-2">
                <AlertCircle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((category: Category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <button className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  SKU
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Category
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Price
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Stock
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-3 sm:px-6 py-8 text-center text-xs sm:text-sm text-gray-500">
                    {searchQuery ? 'No products found matching your search.' : 'No products found.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover"
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              e.currentTarget.src = 'https://via.placeholder.com/150x150.png'
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            <Package className="h-4 w-4 sm:h-6 sm:w-6 text-gray-400" />
                          </div>
                        )}
                        <div className="ml-3 sm:ml-4">
                          <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[120px] sm:max-w-none">
                            {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs text-gray-500 hidden sm:table-cell">
                      {product.sku}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs text-gray-500 hidden lg:table-cell">
                      {getCategoryName(product.category_id)}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs text-gray-500 hidden lg:table-cell">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs text-gray-500 hidden sm:table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs text-gray-500 hidden sm:table-cell">
                      {product.stock_quantity}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                      <div className="flex justify-end space-x-1 sm:space-x-2">
                        <button
                          onClick={() =>
                            openEditModal(product)
                          }
                          className="p-2 rounded hover:bg-gray-100 text-gray-600 cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Create New Product</h2>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  value={createForm.sku}
                  onChange={(e) => setCreateForm({...createForm, sku: e.target.value.toUpperCase()})}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm uppercase"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={createForm.category_id}
                  onChange={(e) => setCreateForm({...createForm, category_id: e.target.value})}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category: Category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Price (UGX)
                  </label>
                  <input
                    type="number"
                    value={createForm.price}
                    onChange={(e) => setCreateForm({...createForm, price: e.target.value})}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={createForm.stock_quantity}
                    onChange={(e) => setCreateForm({...createForm, stock_quantity: e.target.value})}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={createForm.status}
                  onChange={(e) => setCreateForm({...createForm, status: e.target.value})}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                />
                {previewImage && (
                  <div className="mt-2">
                    <img 
                      src={previewImage} 
                      alt="Product preview"
                      className="h-20 w-20 rounded-lg object-cover mx-auto"
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewImage(null)}
                      className="mt-2 text-xs text-red-600 hover:text-red-700 underline"
                    >
                      Remove preview
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 sm:space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Edit Product</h2>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  value={editForm.sku}
                  onChange={(e) => setEditForm({...editForm, sku: e.target.value.toUpperCase()})}
                  className="w-full px-2 sm:px-3 py-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm uppercase"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={editForm.category_id}
                  onChange={(e) => setEditForm({...editForm, category_id: e.target.value})}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category: Category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Price (UGX)
                  </label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                    className="w-full px-2 sm:px-3 py-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={editForm.stock_quantity}
                    onChange={(e) => setEditForm({...editForm, stock_quantity: e.target.value})}
                    className="w-full px-2 sm:px-3 py-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full px-2 sm:px-3 py-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 sm:space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
