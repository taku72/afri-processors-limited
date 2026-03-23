'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  Search, 
  Filter,
  MoreVertical,
  Calendar,
  Edit,
  Trash2,
  Plus,
  X,
  Eye,
  EyeOff,
  Save,
  Bold,
  Italic,
  List,
  Link,
  Image
} from 'lucide-react'

interface Content {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  type: 'page' | 'post' | 'article'
  status: 'draft' | 'published' | 'archived'
  author: string
  created_at: string
  updated_at: string
  published_at?: string
}

interface NewContent {
  title: string
  slug: string
  content: string
  excerpt: string
  type: 'page' | 'post' | 'article'
  status: 'draft' | 'published'
}

export default function ContentPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [content, setContent] = useState<Content[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingContent, setEditingContent] = useState<Content | null>(null)
  const [contentToDelete, setContentToDelete] = useState<Content | null>(null)
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null)
  const [errors, setErrors] = useState<Partial<NewContent>>({})
  
  const [newContent, setNewContent] = useState<NewContent>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    type: 'page',
    status: 'draft'
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

    // Mock content data
    const mockContent: Content[] = [
      {
        id: 1,
        title: 'About Us',
        slug: 'about-us',
        content: 'We are a leading agricultural processing company in Africa...',
        excerpt: 'Learn more about our company and mission.',
        type: 'page',
        status: 'published',
        author: userData.full_name,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
        published_at: '2024-01-10T00:00:00Z'
      },
      {
        id: 2,
        title: 'Our Services',
        slug: 'our-services',
        content: 'We offer a wide range of agricultural processing services...',
        excerpt: 'Discover our comprehensive agricultural processing services.',
        type: 'page',
        status: 'published',
        author: userData.full_name,
        created_at: '2024-01-05T00:00:00Z',
        updated_at: '2024-01-20T00:00:00Z',
        published_at: '2024-01-12T00:00:00Z'
      },
      {
        id: 3,
        title: 'Latest Industry News',
        slug: 'latest-industry-news',
        content: 'The agricultural industry is seeing new innovations...',
        excerpt: 'Stay updated with the latest news in agricultural processing.',
        type: 'article',
        status: 'draft',
        author: userData.full_name,
        created_at: '2024-02-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
      }
    ]

    setContent(mockContent)
    setIsLoading(false)
  }, [router])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const validateForm = () => {
    const newErrors: Partial<NewContent> = {}

    if (!newContent.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!newContent.slug.trim()) {
      newErrors.slug = 'Slug is required'
    }

    if (!newContent.content.trim()) {
      newErrors.content = 'Content is required'
    }

    if (!newContent.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddContent = () => {
    if (!validateForm()) return

    const contentToAdd: Content = {
      id: content.length + 1,
      title: newContent.title,
      slug: newContent.slug,
      content: newContent.content,
      excerpt: newContent.excerpt,
      type: newContent.type,
      status: newContent.status,
      author: user.full_name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: newContent.status === 'published' ? new Date().toISOString() : undefined
    }

    setContent([...content, contentToAdd])
    setNewContent({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      type: 'page',
      status: 'draft'
    })
    setErrors({})
    setShowAddModal(false)
  }

  const handleEditContent = (item: Content) => {
    setEditingContent(item)
    setShowEditModal(true)
    setShowActionMenu(null)
  }

  const handleDeleteContent = (item: Content) => {
    setContentToDelete(item)
    setShowDeleteModal(true)
    setShowActionMenu(null)
  }

  const confirmDelete = () => {
    if (contentToDelete) {
      setContent(content.filter(c => c.id !== contentToDelete.id))
      setShowDeleteModal(false)
      setContentToDelete(null)
    }
  }

  const updateContent = (updatedContent: Content) => {
    setContent(content.map(c => c.id === updatedContent.id ? updatedContent : c))
    setShowEditModal(false)
    setEditingContent(null)
  }

  const toggleContentStatus = (item: Content) => {
    const updatedContent = { ...item }
    if (item.status === 'draft') {
      updatedContent.status = 'published'
      updatedContent.published_at = new Date().toISOString()
    } else if (item.status === 'published') {
      updatedContent.status = 'archived'
    } else {
      updatedContent.status = 'draft'
    }
    updatedContent.updated_at = new Date().toISOString()
    updateContent(updatedContent)
    setShowActionMenu(null)
  }

  const handleInputChange = (field: keyof NewContent, value: string) => {
    if (field === 'title') {
      setNewContent(prev => ({ 
        ...prev, 
        [field]: value,
        slug: generateSlug(value)
      }))
    } else {
      setNewContent(prev => ({ ...prev, [field]: value }))
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Filter content based on search and filters
  const filteredContent = content.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || item.type === filterType
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
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
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'page':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Page
        </span>
      case 'post':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          Post
        </span>
      case 'article':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          Article
        </span>
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {type}
        </span>
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your website content, pages, and articles
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Content</p>
              <p className="text-2xl font-bold text-gray-900">{content.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-lg p-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">
                {content.filter(c => c.status === 'published').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-500 rounded-lg p-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">
                {content.filter(c => c.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-gray-500 rounded-lg p-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Archived</p>
              <p className="text-2xl font-bold text-gray-900">
                {content.filter(c => c.status === 'archived').length}
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
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 w-full sm:w-64"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Types</option>
              <option value="page">Pages</option>
              <option value="post">Posts</option>
              <option value="article">Articles</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredContent.length} of {content.length} items
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
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
              {filteredContent.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">No content found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredContent.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          /{item.slug}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {item.excerpt}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(item.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {formatDate(item.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2 relative">
                        <button 
                          onClick={() => handleEditContent(item)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit content"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteContent(item)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete content"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setShowActionMenu(showActionMenu === item.id ? null : item.id)}
                            className="text-gray-600 hover:text-gray-900"
                            title="More options"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          
                          {/* Action Menu Dropdown */}
                          {showActionMenu === item.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                              <div className="py-1">
                                <button
                                  onClick={() => toggleContentStatus(item)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  {item.status === 'draft' ? 'Publish' : 
                                   item.status === 'published' ? 'Archive' : 'Restore to Draft'}
                                </button>
                                <button
                                  onClick={() => handleEditContent(item)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Edit Content
                                </button>
                                <button
                                  onClick={() => handleDeleteContent(item)}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                  Delete Content
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Content Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-gray-900">Add New Content</h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setErrors({})
                  setNewContent({
                    title: '',
                    slug: '',
                    content: '',
                    excerpt: '',
                    type: 'page',
                    status: 'draft'
                  })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Title and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newContent.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter content title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Type *
                  </label>
                  <select
                    value={newContent.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="page">Page</option>
                    <option value="post">Post</option>
                    <option value="article">Article</option>
                  </select>
                </div>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={newContent.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.slug ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="url-slug"
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt *
                </label>
                <textarea
                  value={newContent.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.excerpt ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Brief description of the content"
                />
                {errors.excerpt && (
                  <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <div className="border border-gray-300 rounded-md overflow-hidden">
                  {/* Simple Toolbar */}
                  <div className="bg-gray-50 border-b border-gray-300 p-2 flex space-x-2">
                    <button className="p-2 hover:bg-gray-200 rounded" title="Bold">
                      <Bold className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded" title="Italic">
                      <Italic className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded" title="List">
                      <List className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded" title="Link">
                      <Link className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded" title="Image">
                      <Image className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    value={newContent.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={12}
                    className={`w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.content ? 'border-red-500' : ''
                    }`}
                    placeholder="Write your content here..."
                  />
                </div>
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newContent.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setErrors({})
                  setNewContent({
                    title: '',
                    slug: '',
                    content: '',
                    excerpt: '',
                    type: 'page',
                    status: 'draft'
                  })
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContent}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2 inline" />
                Save Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && contentToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                Delete Content
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete <span className="font-semibold">{contentToDelete.title}</span>? 
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setContentToDelete(null)
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
