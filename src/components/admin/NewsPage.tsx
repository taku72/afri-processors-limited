'use client'

import { useState, useEffect } from 'react'
import { Newspaper, Plus, Edit2, Trash2, Search, Filter, Eye } from 'lucide-react'
import { useNotifications } from '@/contexts/NotificationContext'
import ArticleForm from '@/components/ArticleForm'

type ArticleFormType = {
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  image_url: string
  featured: boolean
  status: 'draft' | 'published' | 'archived'
}

interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  image_url?: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  published_at?: string
  created_at: string
  updated_at: string
  read_time: number
}

export default function NewsPage() {
  const { addNotification } = useNotifications()
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [createForm, setCreateForm] = useState<ArticleFormType>({
    title: '',
    content: '',
    excerpt: '',
    category: 'general',
    tags: [],
    image_url: '',
    featured: false,
    status: 'draft'
  })
  const [editForm, setEditForm] = useState<ArticleFormType>({
    title: '',
    content: '',
    excerpt: '',
    category: 'general',
    tags: [],
    image_url: '',
    featured: false,
    status: 'draft'
  })

  useEffect(() => {
  const fetchNews = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/news-compatibility')
      if (!response.ok) throw new Error('Failed')

      const data = await response.json()
      console.log('API Response:', data)
      console.log('Articles from API:', data.data?.articles)
      console.log('Article count:', data.data?.articles?.length)

      // ✅ NORMALIZE
      const normalized = (data.data?.articles || []).map((article: any) => ({
        ...article,
        tags: Array.isArray(article.tags)
          ? article.tags
          : (article.tags && typeof article.tags === 'string' 
              ? article.tags.split(',').map((t: string) => t.trim()).filter(Boolean) 
              : []),
        image_url: article.image_url || ''
      }))

      console.log('Normalized articles:', normalized)
      console.log('Setting articles to:', normalized)
      setArticles(normalized)
    } catch (error) {
      console.error(error)
      setArticles([])
    } finally {
      setIsLoading(false)
    }
  }

  fetchNews()
}, [])

  useEffect(() => {
    let filtered = articles

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory)
    }

    setFilteredArticles(filtered)
  }, [articles, searchTerm, selectedCategory])

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!createForm.title.trim() || !createForm.content.trim()) {
      alert('Title and content are required')
      return
    }

    try {
      const response = await fetch('/api/admin/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createForm)
      })

      if (!response.ok) {
        throw new Error('Failed to create article')
      }

      const data = await response.json()
      setArticles(prev => [data.article, ...prev])
      setFilteredArticles(prev => [data.article, ...prev])
      setShowCreateModal(false)
      setCreateForm({
        title: '',
        content: '',
        excerpt: '',
        category: 'general',
        tags: [],
        image_url: '',
        featured: false,
        status: 'draft' as const
      })
      
      addNotification('success', 'Article Created', `${createForm.title} has been created successfully`)
    } catch (error) {
      console.error('Error creating article:', error)
      alert('Failed to create article')
    }
  }

  const handleUpdateArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedArticle || !editForm.title.trim() || !editForm.content.trim()) {
      alert('Title and content are required')
      return
    }

    try {
      const response = await fetch(`/api/admin/news/${selectedArticle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      })

      if (!response.ok) {
        throw new Error('Failed to update article')
      }

      const data = await response.json()
      setArticles(prev => prev.map(article => 
        article.id === selectedArticle.id ? data.article : article
      ))
      setFilteredArticles(prev => prev.map(article => 
        article.id === selectedArticle.id ? data.article : article
      ))
      setShowEditModal(false)
      setSelectedArticle(null)
      setEditForm({
        title: '',
        content: '',
        excerpt: '',
        category: 'general',
        tags: [],
        image_url: '',
        featured: false,
        status: 'draft' as const
      })
      
      addNotification('info', 'Article Updated', `${editForm.title} has been updated successfully`)
    } catch (error) {
      console.error('Error updating article:', error)
      alert('Failed to update article')
    }
  }

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/news/${articleId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete article')
      }

      setArticles(prev => prev.filter(article => article.id !== articleId))
      setFilteredArticles(prev => prev.filter(article => article.id !== articleId))
      
      addNotification('warning', 'Article Deleted', 'Article has been deleted successfully')
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('Failed to delete article')
    }
  }

  const openEditModal = (article: NewsArticle) => {
    setSelectedArticle(article)
    setEditForm({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      category: article.category,
      tags: article.tags,
      image_url: article.image_url || '',
      featured: article.featured,
      status: article.status
    })
    setShowEditModal(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div>
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Article
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div className="flex-1">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="company">Company</option>
              <option value="products">Products</option>
              <option value="sustainability">Sustainability</option>
              <option value="community">Community</option>
            </select>
          </div>
        </div>
      </div>
      

      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <Newspaper className="text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">
            Try adjusting your search or category filters.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{article.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        article.status === 'published' ? 'bg-green-100 text-green-800' :
                        article.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {article.featured && (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(article.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(article)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="text-red-600 hover:text-red-700 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>

    {showCreateModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Article</h2>
          <ArticleForm
            form={createForm}
            setForm={setCreateForm}
            onSubmit={handleCreateArticle}
            submitLabel="Create Article"
          />
        </div>
      </div>
    )}

    {showEditModal && selectedArticle && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Article</h2>
          <ArticleForm
            form={editForm}
            setForm={setEditForm}
            onSubmit={handleUpdateArticle}
            submitLabel="Update Article"
          />
        </div>
      </div>
    )}
  </div>
  )
}
