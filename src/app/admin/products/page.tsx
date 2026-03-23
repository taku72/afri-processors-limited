'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Package, 
  Search, 
  Filter,
  MoreVertical,
  Calendar,
  Edit,
  Trash2,
  Plus,
  X,
  Save,
  DollarSign,
  Tag,
  Box,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react'

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  sku: string
  stock: number
  status: 'active' | 'inactive' | 'out_of_stock'
  image?: string
  features: string[]
  specifications: Record<string, string>
  created_at: string
  updated_at: string
}

interface NewProduct {
  name: string
  description: string
  price: string
  category: string
  sku: string
  stock: string
  status: 'active' | 'inactive'
  features: string
  specifications: string
}

export default function ProductsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null)
  const [errors, setErrors] = useState<Partial<NewProduct>>({})
  
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    description: '',
    price: '',
    category: '',
    sku: '',
    stock: '',
    status: 'active',
    features: '',
    specifications: ''
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
      setUser(userData)
    } catch {
      router.push('/admin/login')
      return
    }

    // Mock products data
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Moringa Flour',
        description: 'Nutrient-rich moringa flour made from dried moringa leaves, perfect for healthy cooking and baking',
        price: 35.99,
        category: 'Flours',
        sku: 'MF-001',
        stock: 120,
        status: 'active',
        image: '/images/moringa-flour.jpg',
        features: ['Rich in vitamins and minerals', 'High protein content', '100% organic', 'Gluten-free'],
        specifications: {
          'Weight': '2kg',
          'Protein': '25%',
          'Vitamin C': '200mg per 100g',
          'Shelf Life': '12 months',
          'Origin': 'Uganda farms'
        },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z'
      },
      {
        id: 2,
        name: 'Baobab Flour',
        description: 'Premium baobab fruit powder with tangy flavor, excellent for smoothies and traditional recipes',
        price: 42.50,
        category: 'Flours',
        sku: 'BF-002',
        stock: 85,
        status: 'active',
        image: '/images/baobab-flour.jpg',
        features: ['High in vitamin C', 'Natural prebiotics', 'Rich in antioxidants', 'Raw and unprocessed'],
        specifications: {
          'Weight': '1kg',
          'Vitamin C': '300mg per 100g',
          'Fiber': '50%',
          'Shelf Life': '18 months',
          'Origin': 'West Africa'
        },
        created_at: '2024-01-05T00:00:00Z',
        updated_at: '2024-01-20T00:00:00Z'
      },
      {
        id: 3,
        name: 'Castor Oil',
        description: 'Pure cold-pressed castor oil, ideal for medicinal, cosmetic, and industrial applications',
        price: 28.75,
        category: 'Oils',
        sku: 'CO-003',
        stock: 0,
        status: 'out_of_stock',
        image: '/images/castor-oil.jpg',
        features: ['Cold-pressed', '100% pure', 'Rich in ricinoleic acid', 'Versatile use'],
        specifications: {
          'Volume': '500ml',
          'Purity': '99.9%',
          'Ricinoleic Acid': '90%',
          'Shelf Life': '24 months',
          'Processing': 'Cold-pressed'
        },
        created_at: '2024-02-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
      },
      {
        id: 4,
        name: 'Moringa Seeds',
        description: 'High-quality moringa oleifera seeds for planting, oil extraction, or nutritional supplements',
        price: 15.99,
        category: 'Seeds',
        sku: 'MS-004',
        stock: 200,
        status: 'active',
        image: '/images/moringa-seeds.jpg',
        features: ['Premium grade seeds', 'High germination rate', 'Rich in oil content', 'Organic grown'],
        specifications: {
          'Weight': '500g',
          'Germination Rate': '85%',
          'Oil Content': '35-40%',
          'Purity': '98%',
          'Shelf Life': '6 months'
        },
        created_at: '2024-02-10T00:00:00Z',
        updated_at: '2024-02-15T00:00:00Z'
      }
    ]

    setProducts(mockProducts)
    setIsLoading(false)
  }, [router])

  const generateSKU = (name: string, category: string) => {
    const categoryCode = category.substring(0, 2).toUpperCase()
    const nameCode = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${categoryCode}-${nameCode}-${random}`
  }

  const validateForm = () => {
    const newErrors: Partial<NewProduct> = {}

    if (!newProduct.name.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!newProduct.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!newProduct.price || parseFloat(newProduct.price) <= 0) {
      newErrors.price = 'Valid price is required'
    }

    if (!newProduct.category.trim()) {
      newErrors.category = 'Category is required'
    }

    if (!newProduct.sku.trim()) {
      newErrors.sku = 'SKU is required'
    }

    if (!newProduct.stock || parseInt(newProduct.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const parseSpecifications = (specString: string): Record<string, string> => {
    const specs: Record<string, string> = {}
    specString.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':')
      if (key && valueParts.length > 0) {
        specs[key.trim()] = valueParts.join(':').trim()
      }
    })
    return specs
  }

  const handleAddProduct = () => {
    if (!validateForm()) return

    const productToAdd: Product = {
      id: products.length + 1,
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      sku: newProduct.sku,
      stock: parseInt(newProduct.stock),
      status: parseInt(newProduct.stock) === 0 ? 'out_of_stock' : newProduct.status as 'active' | 'inactive',
      features: newProduct.features.split('\n').filter(f => f.trim()),
      specifications: parseSpecifications(newProduct.specifications),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    setProducts([...products, productToAdd])
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      sku: '',
      stock: '',
      status: 'active',
      features: '',
      specifications: ''
    })
    setErrors({})
    setShowAddModal(false)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowEditModal(true)
    setShowActionMenu(null)
  }

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
    setShowActionMenu(null)
  }

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete.id))
      setShowDeleteModal(false)
      setProductToDelete(null)
    }
  }

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p))
    setShowEditModal(false)
    setEditingProduct(null)
  }

  const toggleProductStatus = (product: Product) => {
    const updatedProduct = { ...product }
    if (product.status === 'active') {
      updatedProduct.status = 'inactive'
    } else if (product.status === 'inactive') {
      updatedProduct.status = product.stock > 0 ? 'active' : 'out_of_stock'
    } else {
      updatedProduct.status = 'active'
    }
    updatedProduct.updated_at = new Date().toISOString()
    updateProduct(updatedProduct)
    setShowActionMenu(null)
  }

  const handleInputChange = (field: keyof NewProduct, value: string) => {
    if (field === 'name' || field === 'category') {
      setNewProduct(prev => ({ 
        ...prev, 
        [field]: value,
        ...(field === 'name' && !prev.sku ? { sku: generateSKU(value, prev.category) } : {}),
        ...(field === 'category' && !prev.sku ? { sku: generateSKU(prev.name, value) } : {})
      }))
    } else {
      setNewProduct(prev => ({ ...prev, [field]: value }))
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800'
      case 'out_of_stock':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600' }
    if (stock < 10) return { text: 'Low Stock', color: 'text-yellow-600' }
    return { text: 'In Stock', color: 'text-green-600' }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your product catalog, inventory, and pricing
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-lg p-3">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-500 rounded-lg p-3">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.stock > 0 && p.stock < 10).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-500 rounded-lg p-3">
              <Box className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.stock === 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 w-full sm:w-64"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Categories</option>
              <option value="Flours">Flours</option>
              <option value="Oils">Oils</option>
              <option value="Seeds">Seeds</option>
              <option value="Other">Other</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">No products found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock)
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              SKU: {product.sku}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(product.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.stock} units
                        </div>
                        <div className={`text-xs ${stockStatus.color}`}>
                          {stockStatus.text}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {product.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          {formatDate(product.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2 relative">
                          <button 
                            onClick={() => handleEditProduct(product)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit product"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="relative">
                            <button 
                              onClick={() => setShowActionMenu(showActionMenu === product.id ? null : product.id)}
                              className="text-gray-600 hover:text-gray-900"
                              title="More options"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            
                            {/* Action Menu Dropdown */}
                            {showActionMenu === product.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                <div className="py-1">
                                  <button
                                    onClick={() => toggleProductStatus(product)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    {product.status === 'active' ? 'Deactivate' : 
                                     product.status === 'inactive' ? 'Activate' : 'Set Active'}
                                  </button>
                                  <button
                                    onClick={() => handleEditProduct(product)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Edit Product
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(product)}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                  >
                                    Delete Product
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-gray-900">Add New Product</h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setErrors({})
                  setNewProduct({
                    name: '',
                    description: '',
                    price: '',
                    category: '',
                    sku: '',
                    stock: '',
                    status: 'active',
                    features: '',
                    specifications: ''
                  })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select category</option>
                    <option value="Flours">Flours</option>
                    <option value="Oils">Oils</option>
                    <option value="Seeds">Seeds</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>
              </div>

              {/* SKU and Price */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU *
                  </label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.sku ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Auto-generated or manual"
                  />
                  {errors.sku && (
                    <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.stock ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.stock && (
                    <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your product..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features (one per line)
                </label>
                <textarea
                  value={newProduct.features}
                  onChange={(e) => handleInputChange('features', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="High quality&#10;Organic certified&#10;Locally sourced"
                />
              </div>

              {/* Specifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specifications (one per line, format: Key: Value)
                </label>
                <textarea
                  value={newProduct.specifications}
                  onChange={(e) => handleInputChange('specifications', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Weight: 5kg&#10;Shelf Life: 6 months&#10;Origin: Local farms&#10;Certification: Organic"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newProduct.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setErrors({})
                  setNewProduct({
                    name: '',
                    description: '',
                    price: '',
                    category: '',
                    sku: '',
                    stock: '',
                    status: 'active',
                    features: '',
                    specifications: ''
                  })
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2 inline" />
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                Delete Product
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete <span className="font-semibold">{productToDelete.name}</span>? 
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setProductToDelete(null)
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
