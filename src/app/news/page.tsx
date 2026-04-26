'use client'

import { useState, useEffect } from 'react'
import { Search, Calendar, User, Clock, Tag, ArrowRight, Share2, Heart, MessageCircle } from 'lucide-react'

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
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/news')
        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }
        const data = await response.json()
        setArticles(data.articles || [])
        setFilteredArticles(data.articles || [])
      } catch (error) {
        console.error('Error fetching news:', error)
        setArticles([])
        setFilteredArticles([])
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
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory)
    }

    setFilteredArticles(filtered)
  }, [articles, searchTerm, selectedCategory])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">News & Updates</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Stay updated with the latest news, announcements, and developments from Afri Processors
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Search News</h3>
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

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {['all', 'general', 'company', 'products', 'sustainability', 'community'].map(category => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="capitalize">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-3/4">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or category filters.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredArticles.map((article) => (
                  <article key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {article.image_url && (
                      <div className="h-48 bg-gray-200">
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <Calendar size={16} />
                            <span>{formatDate(article.created_at)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <User size={16} />
                            <span>{article.author}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock size={16} />
                            <span>{calculateReadTime(article.content)} min read</span>
                          </span>
                        </div>
                        {article.featured && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 mb-4">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {article.category}
                        </span>
                        {article.tags.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Tag size={14} />
                            {article.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        <a
                          href={`/news/${article.slug}`}
                          className="hover:text-green-600 transition-colors"
                        >
                          {article.title}
                        </a>
                      </h2>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <a
                          href={`/news/${article.slug}`}
                          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                        >
                          Read More
                          <ArrowRight size={16} className="ml-1" />
                        </a>
                        <div className="flex items-center space-x-4 text-gray-500">
                          <button className="flex items-center space-x-1 hover:text-red-600 transition-colors">
                            <Heart size={16} />
                            <span className="text-sm">Save</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                            <Share2 size={16} />
                            <span className="text-sm">Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
