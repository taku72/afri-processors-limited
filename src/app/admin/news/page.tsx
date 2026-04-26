'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Newspaper, 
  Search, 
  Filter,
  MoreVertical,
  Calendar,
  Edit,
  Trash2,
  Plus,
  X,
  Save,
  Eye,
  EyeOff,
  Bold,
  Italic,
  List,
  Link,
  Image as ImageIcon,
  Clock,
  User,
  Tag,
  Heading,
  Quote,
  Code
} from 'lucide-react'

interface News {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  author: string
  category: string
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  image_url?: string
  published_at?: string
  created_at: string
  updated_at: string
  read_time: number
}

interface NewNews {
  title: string
  slug: string
  content: string
  excerpt: string
  author: string
  category: string
  tags: string
  status: 'draft' | 'published'
  featured: boolean
  image_url?: string
}

export default function NewsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [news, setNews] = useState<News[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [newsToDelete, setNewsToDelete] = useState<News | null>(null)
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null)
  const [errors, setErrors] = useState<Partial<NewNews>>({})
  
  const [newNews, setNewNews] = useState<NewNews>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: '',
    category: '',
    tags: '',
    status: 'draft',
    featured: false,
    image_url: ''
  })

  useEffect(() => {
    // Check session
    const sessionData = localStorage.getItem('adminSession')
    
    if (!sessionData) {
      router.push('/admin/login')
      return
    }
    
    let userData: any
    try {
      userData = JSON.parse(sessionData)
      setUser(userData)
      // Set author to current user's name
      setNewNews(prev => ({ ...prev, author: userData.full_name || userData.username }))
    } catch {
      router.push('/admin/login')
      return
    }

    // Fetch real news data from API
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/admin/news-compatibility')
        if (!response.ok) throw new Error('Failed to fetch news')
        
        const data = await response.json()
        console.log('API Response:', data)
        console.log('Articles from API:', data.data?.articles)
        
        // Normalize the data to match the expected News interface
        const normalizedNews = (data.data?.articles || []).map((article: any) => ({
          ...article,
          author: article.author || userData.full_name,
          category: article.category || 'General',
          tags: Array.isArray(article.tags) 
            ? article.tags 
            : (article.tags && typeof article.tags === 'string' 
                ? article.tags.split(',').map((t: string) => t.trim()).filter(Boolean) 
                : []),
          image_url: article.image_url || '/api/placeholder/800/400',
          featured: article.featured || false
        }))
        
        console.log('Setting news to:', normalizedNews)
        setNews(normalizedNews)
      } catch (error) {
        console.error('Error fetching news:', error)
        setNews([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [router])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  const validateForm = () => {
    const newErrors: Partial<NewNews> = {}

    if (!newNews.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!newNews.slug.trim()) {
      newErrors.slug = 'Slug is required'
    }

    if (!newNews.content.trim()) {
      newErrors.content = 'Content is required'
    }

    if (!newNews.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required'
    }

    if (!newNews.author.trim()) {
      newErrors.author = 'Author is required'
    }

    if (!newNews.category.trim()) {
      newErrors.category = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddNews = async () => {
    if (!validateForm()) return

    try {
      const response = await fetch('/api/admin/news-compatibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newNews.title,
          slug: newNews.slug,
          content: newNews.content,
          excerpt: newNews.excerpt,
          author: newNews.author,
          status: newNews.status,
          image_url: newNews.image_url
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create article')
      }

      const data = await response.json()
      console.log('Created article:', data)

      // Refresh the news list
      const fetchNews = async () => {
        try {
          const response = await fetch('/api/admin/news-compatibility')
          if (!response.ok) throw new Error('Failed to fetch news')
          
          const apiData = await response.json()
          const normalizedNews = (apiData.data?.articles || []).map((article: any) => ({
            ...article,
            author: article.author || user?.full_name,
            category: article.category || 'General',
            tags: Array.isArray(article.tags) 
              ? article.tags 
              : (article.tags && typeof article.tags === 'string' 
                  ? article.tags.split(',').map((t: string) => t.trim()).filter(Boolean) 
                  : []),
            image_url: article.image_url || '/api/placeholder/800/400',
            featured: article.featured || false
          }))
          
          setNews(normalizedNews)
        } catch (error) {
          console.error('Error refreshing news:', error)
        }
      }

      await fetchNews()

      setNewNews({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        author: user?.full_name || '',
        category: '',
        tags: '',
        status: 'draft',
        featured: false,
        image_url: ''
      })
      setErrors({})
      setShowAddModal(false)

    } catch (error) {
      console.error('Error creating article:', error)
      alert('Failed to create article')
    }
  }

  const handleEditNews = (newsItem: News) => {
    setEditingNews(newsItem)
    setShowEditModal(true)
    setShowActionMenu(null)
  }

  const handleDeleteNews = (newsItem: News) => {
    setNewsToDelete(newsItem)
    setShowDeleteModal(true)
    setShowActionMenu(null)
  }

  const confirmDelete = async () => {
    if (newsToDelete) {
      try {
        const response = await fetch(`/api/admin/news-compatibility?id=${newsToDelete.id}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Failed to delete article')
        }

        // Refresh the news list
        const fetchNews = async () => {
          try {
            const response = await fetch('/api/admin/news-compatibility')
            if (!response.ok) throw new Error('Failed to fetch news')
            
            const apiData = await response.json()
            const normalizedNews = (apiData.data?.articles || []).map((article: any) => ({
              ...article,
              author: article.author || user?.full_name,
              tags: Array.isArray(article.tags) 
                ? article.tags 
                : (article.tags && typeof article.tags === 'string' 
                    ? article.tags.split(',').map((t: string) => t.trim()).filter(Boolean) 
                    : []),
              image_url: article.image_url || '/api/placeholder/800/400'
            }))
            
            setNews(normalizedNews)
          } catch (error) {
            console.error('Error refreshing news:', error)
          }
        }

        await fetchNews()

        setShowDeleteModal(false)
        setNewsToDelete(null)
      } catch (error) {
        console.error('Error deleting article:', error)
        alert('Failed to delete article')
      }
    }
  }

  const updateNews = (updatedNews: News) => {
    setNews(news.map(n => n.id === updatedNews.id ? updatedNews : n))
    setShowEditModal(false)
    setEditingNews(null)
  }

  const toggleNewsStatus = async (newsItem: News) => {
    const updatedNews = { ...newsItem }
    if (newsItem.status === 'draft') {
      updatedNews.status = 'published'
      updatedNews.published_at = new Date().toISOString()
    } else if (newsItem.status === 'published') {
      updatedNews.status = 'archived'
    } else {
      updatedNews.status = 'draft'
    }
    updatedNews.updated_at = new Date().toISOString()

    try {
      const response = await fetch(`/api/admin/news-compatibility?id=${newsItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: updatedNews.title,
          slug: updatedNews.slug,
          content: updatedNews.content,
          excerpt: updatedNews.excerpt,
          author: updatedNews.author,
          status: updatedNews.status,
          image_url: updatedNews.image_url
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update article')
      }

      // Refresh the news list
      const fetchNews = async () => {
        try {
          const response = await fetch('/api/admin/news-compatibility')
          if (!response.ok) throw new Error('Failed to fetch news')
          
          const apiData = await response.json()
          const normalizedNews = (apiData.data?.articles || []).map((article: any) => ({
            ...article,
            author: article.author || user?.full_name,
            category: article.category || 'General',
            tags: Array.isArray(article.tags) 
              ? article.tags 
              : (article.tags && typeof article.tags === 'string' 
                  ? article.tags.split(',').map((t: string) => t.trim()).filter(Boolean) 
                  : []),
            image_url: article.image_url || '/api/placeholder/800/400',
            featured: article.featured || false
          }))
          
          setNews(normalizedNews)
        } catch (error) {
          console.error('Error refreshing news:', error)
        }
      }

      await fetchNews()
      setShowActionMenu(null)
    } catch (error) {
      console.error('Error updating article:', error)
      alert('Failed to update article')
    }
  }

  const toggleFeatured = (newsItem: News) => {
    const updatedNews = { 
      ...newsItem, 
      featured: !newsItem.featured,
      updated_at: new Date().toISOString()
    }
    updateNews(updatedNews)
    setShowActionMenu(null)
  }

  const handleInputChange = (field: keyof NewNews, value: string | boolean) => {
    if (field === 'title') {
      const stringValue = value as string
      setNewNews(prev => ({ 
        ...prev, 
        title: stringValue,
        slug: generateSlug(stringValue)
      }))
    } else {
      setNewNews(prev => ({ ...prev, [field]: value }))
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Rich text editor functions
  const insertText = (text: string, isAddNews: boolean = true) => {
    const textarea = document.getElementById(isAddNews ? 'add-news-content' : 'edit-news-content') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = textarea.value.substring(start, end)
      const newText = text.replace('{selected}', selectedText)
      
      const updatedContent = textarea.value.substring(0, start) + newText + textarea.value.substring(end)
      
      if (isAddNews) {
        handleInputChange('content', updatedContent)
      } else if (editingNews) {
        setEditingNews({...editingNews, content: updatedContent})
      }
      
      // Reset cursor position
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + newText.length, start + newText.length)
      }, 0)
    }
  }

  const formatText = (format: string, isAddNews: boolean = true) => {
    switch (format) {
      case 'bold':
        insertText('**{selected}**', isAddNews)
        break
      case 'italic':
        insertText('*{selected}*', isAddNews)
        break
      case 'list':
        insertText('\n• {selected}', isAddNews)
        break
      case 'link':
        const url = prompt('Enter URL:')
        if (url) {
          insertText(`[{selected}](${url})`, isAddNews)
        }
        break
      case 'image':
        const imgUrl = prompt('Enter image URL:')
        if (imgUrl) {
          insertText(`![{selected}](${imgUrl})`, isAddNews)
        }
        break
      case 'heading':
        insertText('\n## {selected}', isAddNews)
        break
      case 'quote':
        insertText('\n> {selected}', isAddNews)
        break
      case 'code':
        insertText('`{selected}`', isAddNews)
        break
    }
  }

  // Filter news based on search and filters
  const filteredNews = news.filter(newsItem => {
    const matchesSearch = searchTerm === '' || 
      newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      newsItem.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      newsItem.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = filterCategory === 'all' || newsItem.category === filterCategory
    const matchesStatus = filterStatus === 'all' || newsItem.status === filterStatus
    
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

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'Company News': 'bg-blue-100 text-blue-800',
      'Product Launch': 'bg-purple-100 text-purple-800',
      'Sustainability': 'bg-green-100 text-green-800',
      'Industry News': 'bg-orange-100 text-orange-800',
      'Events': 'bg-pink-100 text-pink-800'
    }
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[category] || 'bg-gray-100 text-gray-800'}`}>
        {category}
      </span>
    )
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Article
            </button>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-yellow-100 border border-yellow-300 rounded p-2 text-xs">
          <strong>Debug:</strong> News items: {news.length}, Filtered: {filteredNews.length}
          {news.length > 0 && (
            <>
              <br />
              First item published_at: {news[0]?.published_at || 'null'}
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total News</p>
              <p className="text-2xl font-bold text-gray-900">{news.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-lg p-3">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">
                {news.filter(n => n.status === 'published').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-500 rounded-lg p-3">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">
                {news.filter(n => n.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-500 rounded-lg p-3">
              <Tag className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-gray-900">
                {news.filter(n => n.featured).length}
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
                placeholder="Search news..."
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
              <option value="Company News">Company News</option>
              <option value="Product Launch">Product Launch</option>
              <option value="Sustainability">Sustainability</option>
              <option value="Industry News">Industry News</option>
              <option value="Events">Events</option>
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
            Showing {filteredNews.length} of {news.length} articles
          </div>
        </div>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  News Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Newspaper className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">No news found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredNews.map((newsItem) => {
                  console.log('Rendering newsItem:', newsItem)
                  return (
                  <tr key={newsItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <Newspaper className="h-6 w-6 text-gray-400" />
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="text-sm font-medium text-gray-900">
                              {newsItem.title}
                            </div>
                            {newsItem.featured && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                <Tag className="h-3 w-3 mr-1" />
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            /{newsItem.slug}
                          </div>
                          <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
                            {newsItem.excerpt}
                          </div>
                          <div className="flex items-center mt-1 space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {newsItem.read_time} min read
                            </span>
                            <span className="flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              {newsItem.tags.length} tags
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getCategoryBadge(newsItem.category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        {newsItem.author}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(newsItem.status)}`}>
                        {newsItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(() => {
                        console.log('Published at:', newsItem.published_at)
                        return newsItem.published_at ? (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            {formatDate(newsItem.published_at)}
                          </div>
                        ) : (
                          <span className="text-gray-400">Not published</span>
                        )
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2 relative">
                        <button 
                          onClick={() => handleEditNews(newsItem)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit news"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteNews(newsItem)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete news"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setShowActionMenu(showActionMenu === newsItem.id ? null : newsItem.id)}
                            className="text-gray-600 hover:text-gray-900"
                            title="More options"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          
                          {/* Action Menu Dropdown */}
                          {showActionMenu === newsItem.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                              <div className="py-1">
                                <button
                                  onClick={() => toggleNewsStatus(newsItem)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  {newsItem.status === 'draft' ? 'Publish' : 
                                   newsItem.status === 'published' ? 'Archive' : 'Restore to Draft'}
                                </button>
                                <button
                                  onClick={() => toggleFeatured(newsItem)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  {newsItem.featured ? 'Remove from Featured' : 'Mark as Featured'}
                                </button>
                                <button
                                  onClick={() => handleEditNews(newsItem)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Edit News
                                </button>
                                <button
                                  onClick={() => handleDeleteNews(newsItem)}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                  Delete News
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

      {/* Add News Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-gray-900">Add News Article</h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setErrors({})
                  setNewNews({
                    title: '',
                    slug: '',
                    content: '',
                    excerpt: '',
                    author: user?.full_name || '',
                    category: '',
                    tags: '',
                    status: 'draft',
                    featured: false,
                    image_url: ''
                  })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Title and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newNews.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter news title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newNews.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select category</option>
                    <option value="Company News">Company News</option>
                    <option value="Product Launch">Product Launch</option>
                    <option value="Sustainability">Sustainability</option>
                    <option value="Industry News">Industry News</option>
                    <option value="Events">Events</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>
              </div>

              {/* Author and Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    value={newNews.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.author ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Author name"
                  />
                  {errors.author && (
                    <p className="mt-1 text-sm text-red-600">{errors.author}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    value={newNews.slug}
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
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    {newNews.image_url ? (
                      <div className="relative">
                        <img 
                          src={newNews.image_url} 
                          alt="Featured image preview" 
                          className="mx-auto h-32 w-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleInputChange('image_url', '')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="image-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              // For demo purposes, we'll use a placeholder URL
                              // In production, you would upload to a server and get the URL
                              const imageUrl = `/images/news/${file.name}`
                              handleInputChange('image_url', imageUrl)
                            }
                          }}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                    {newNews.image_url && (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={newNews.image_url}
                          onChange={(e) => handleInputChange('image_url', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Or enter image URL directly"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newNews.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={newNews.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={newNews.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                      Featured Article
                    </label>
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt *
                </label>
                <textarea
                  value={newNews.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.excerpt ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Brief summary of the news article"
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
                  <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-2">
                    <button 
                      type="button"
                      onClick={() => formatText('bold', true)}
                      className="p-2 hover:bg-gray-200 rounded" 
                      title="Bold"
                    >
                      <Bold className="h-4 w-4" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => formatText('italic', true)}
                      className="p-2 hover:bg-gray-200 rounded" 
                      title="Italic"
                    >
                      <Italic className="h-4 w-4" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => formatText('heading', true)}
                      className="p-2 hover:bg-gray-200 rounded" 
                      title="Heading"
                    >
                      <Heading className="h-4 w-4" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => formatText('list', true)}
                      className="p-2 hover:bg-gray-200 rounded" 
                      title="List"
                    >
                      <List className="h-4 w-4" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => formatText('quote', true)}
                      className="p-2 hover:bg-gray-200 rounded" 
                      title="Quote"
                    >
                      <Quote className="h-4 w-4" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => formatText('code', true)}
                      className="p-2 hover:bg-gray-200 rounded" 
                      title="Code"
                    >
                      <Code className="h-4 w-4" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => formatText('link', true)}
                      className="p-2 hover:bg-gray-200 rounded" 
                      title="Link"
                    >
                      <Link className="h-4 w-4" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => formatText('image', true)}
                      className="p-2 hover:bg-gray-200 rounded" 
                      title="Image"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    id="add-news-content"
                    value={newNews.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={12}
                    className={`w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.content ? 'border-red-500' : ''
                    }`}
                    placeholder="Write your news article here..."
                  />
                </div>
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setErrors({})
                  setNewNews({
                    title: '',
                    slug: '',
                    content: '',
                    excerpt: '',
                    author: user?.full_name || '',
                    category: '',
                    tags: '',
                    status: 'draft',
                    featured: false,
                    image_url: ''
                  })
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNews}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2 inline" />
                Publish News
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && newsToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                Delete News Article
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete <span className="font-semibold">{newsToDelete.title}</span>? 
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setNewsToDelete(null)
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

      {/* Edit News Modal */}
      {showEditModal && editingNews && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-gray-900">Edit News Article</h3>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingNews(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Title and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={editingNews.title}
                    onChange={(e) => setEditingNews({...editingNews, title: e.target.value, slug: generateSlug(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter news title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={editingNews.category}
                    onChange={(e) => setEditingNews({...editingNews, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select category</option>
                    <option value="Company News">Company News</option>
                    <option value="Product Launch">Product Launch</option>
                    <option value="Sustainability">Sustainability</option>
                    <option value="Industry News">Industry News</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
              </div>

              {/* Author and Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    value={editingNews.author}
                    onChange={(e) => setEditingNews({...editingNews, author: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Author name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    value={editingNews.slug}
                    onChange={(e) => setEditingNews({...editingNews, slug: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="url-slug"
                  />
                </div>
              </div>

              {/* Tags and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editingNews.tags.join(', ')}
                    onChange={(e) => setEditingNews({...editingNews, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={editingNews.status}
                      onChange={(e) => setEditingNews({...editingNews, status: e.target.value as 'draft' | 'published' | 'archived'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      id="edit-featured"
                      checked={editingNews.featured}
                      onChange={(e) => setEditingNews({...editingNews, featured: e.target.checked})}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit-featured" className="ml-2 block text-sm text-gray-900">
                      Featured Article
                    </label>
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt *
                </label>
                <textarea
                  value={editingNews.excerpt}
                  onChange={(e) => setEditingNews({...editingNews, excerpt: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Brief summary of the news article"
                />
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
                      <ImageIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    value={editingNews.content}
                    onChange={(e) => setEditingNews({...editingNews, content: e.target.value})}
                    rows={12}
                    className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Write your news article here..."
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingNews(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const updatedNews = {
                    ...editingNews,
                    updated_at: new Date().toISOString(),
                    published_at: editingNews.status === 'published' && !editingNews.published_at 
                      ? new Date().toISOString() 
                      : editingNews.published_at,
                    read_time: calculateReadTime(editingNews.content)
                  }
                  updateNews(updatedNews)
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2 inline" />
                Update News
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
