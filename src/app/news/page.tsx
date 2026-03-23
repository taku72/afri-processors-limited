'use client'

import { useState, useEffect } from 'react'
import { Search, Calendar, User, Clock, Tag, ArrowRight, Share2, Heart, MessageCircle } from 'lucide-react'

interface NewsArticle {
  id: number
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
    // Mock news data - in production, this would come from an API
    const mockNews: NewsArticle[] = [
      {
        id: 1,
        title: 'Afri Processors Launches New Moringa Flour Production Line',
        slug: 'moringa-flour-production-launch',
        excerpt: 'We are excited to announce the launch of our new state-of-the-art moringa flour production line, doubling our capacity to serve the growing demand for nutritious superfoods across East Africa.',
        content: `We are excited to announce the launch of our new state-of-the-art moringa flour production line, doubling our capacity to serve the growing demand for nutritious superfoods across East Africa.

This significant investment represents our commitment to providing high-quality, locally processed agricultural products while supporting smallholder farmers in the region. The new facility incorporates modern milling technology that preserves the maximum nutritional value of moringa leaves.

"Our new production line is a game-changer for both our business and the local community," says Managing Director Sarah Kimani. "We can now process over 500kg of moringa leaves daily, creating jobs and ensuring consistent supply for our customers."

The expansion comes at a time when health-conscious consumers are increasingly seeking natural, nutrient-dense foods. Moringa flour, known for its high vitamin and mineral content, has gained popularity in health foods, baking, and traditional cuisines.

Key features of the new production line include:
- Advanced cold-press milling technology
- Quality control laboratory
- Sustainable packaging solutions
- Training programs for local staff

We invite our customers and partners to visit our facility to see the new production line in action.`,
        author: 'Sarah Kimani',
        category: 'Company News',
        tags: ['expansion', 'moringa', 'production', 'innovation'],
        image_url: '/images/moringa-production.jpg',
        status: 'published',
        featured: true,
        published_at: '2024-01-20T10:00:00Z',
        created_at: '2024-01-20T09:30:00Z',
        updated_at: '2024-01-20T09:30:00Z',
        read_time: 5
      },
      {
        id: 2,
        title: 'New Partnership with Local Farmers Boosts Sustainable Agriculture',
        slug: 'local-farmers-partnership',
        excerpt: 'Afri Processors has established a groundbreaking partnership with over 200 local farmers to promote sustainable agricultural practices and ensure fair trade principles.',
        content: `Afri Processors has established a groundbreaking partnership with over 200 local farmers to promote sustainable agricultural practices and ensure fair trade principles throughout our supply chain.

This initiative represents our commitment to corporate social responsibility and sustainable development in the communities where we operate. Through this partnership, we provide farmers with training, quality seeds, and guaranteed purchase agreements at fair prices.

The program has already shown remarkable results:
- 35% increase in farmer income
- 50% reduction in chemical fertilizer use
- 100% organic certification for participating farms
- Improved soil health and biodiversity

"We believe that sustainable agriculture is not just good for the environment, it's good for business," says Agricultural Director John Okello. "By working closely with farmers, we ensure the highest quality products while creating shared value for everyone involved."

The partnership includes regular workshops on sustainable farming practices, access to microfinancing, and technical support for crop diversification. Farmers receive premium prices for their produce and benefit from collective bargaining power.

Looking ahead, we plan to expand this program to reach 500 more farmers by the end of 2024, further strengthening our commitment to sustainable agriculture and community development.`,
        author: 'John Okello',
        category: 'Sustainability',
        tags: ['partnership', 'farmers', 'sustainability', 'fair-trade'],
        image_url: '/images/farmers-partnership.jpg',
        status: 'published',
        featured: true,
        published_at: '2024-01-18T14:00:00Z',
        created_at: '2024-01-18T13:30:00Z',
        updated_at: '2024-01-18T13:30:00Z',
        read_time: 4
      },
      {
        id: 3,
        title: 'Baobab Fruit: The Superfood Revolution Coming to Uganda',
        slug: 'baobab-superfood-uganda',
        excerpt: 'Discover the incredible nutritional benefits of baobab fruit and how Afri Processors is bringing this African superfood to mainstream markets with our premium baobab flour.',
        content: `The baobab fruit, long revered as Africa's "Tree of Life," is experiencing a remarkable surge in popularity as global consumers discover its exceptional nutritional benefits. Afri Processors is at the forefront of this superfood revolution, bringing premium baobab flour to markets across East Africa.

Baobab fruit contains six times more vitamin C than oranges, twice as much calcium as milk, and is rich in antioxidants, fiber, and essential minerals. Our traditional harvesting methods combined with modern processing ensure that all these valuable nutrients are preserved in every pack of our baobab flour.

The rising demand for baobab products represents a significant opportunity for local communities. "Baobab trees grow naturally across Uganda, and we're helping communities turn this resource into sustainable income," explains Product Development Manager Grace Nabwire.

Our baobab flour is versatile and easy to use:
- Add to smoothies for a nutritional boost
- Mix into yogurt or porridge
- Use in baking for natural sweetness
- Blend into traditional Ugandan dishes

Health benefits of baobab include:
- Enhanced immune system function
- Improved digestive health
- Better skin health
- Natural energy boost
- Blood sugar regulation

We work directly with women's cooperatives who harvest the baobab fruit using sustainable methods that protect these ancient trees. This ensures that future generations can continue to benefit from this remarkable natural resource.`,
        author: 'Grace Nabwire',
        category: 'Product Launch',
        tags: ['baobab', 'superfood', 'nutrition', 'health'],
        image_url: '/images/baobab-fruit.jpg',
        status: 'published',
        featured: false,
        published_at: '2024-01-16T09:00:00Z',
        created_at: '2024-01-16T08:30:00Z',
        updated_at: '2024-01-16T08:30:00Z',
        read_time: 6
      },
      {
        id: 4,
        title: 'Castor Oil: Traditional Remedy Meets Modern Science',
        slug: 'castor-oil-traditional-modern',
        excerpt: 'Explore the fascinating history of castor oil in traditional African medicine and how modern research is validating its numerous health and industrial applications.',
        content: `Castor oil has been a cornerstone of traditional African medicine for centuries, used for everything from skin care to industrial applications. Today, modern science is confirming what our ancestors have known all along about this versatile oil's remarkable properties.

At Afri Processors, we combine traditional knowledge with modern extraction techniques to produce premium castor oil that meets international quality standards. Our cold-press extraction method preserves the oil's natural properties, ensuring maximum potency and purity.

Traditional uses of castor oil in African communities include:
- Skin moisturizer and treatment for various skin conditions
- Hair growth stimulant and conditioner
- Natural remedy for joint pain and inflammation
- Industrial applications in lubricants and biofuels

Modern research has validated many of these traditional uses:
- Ricinoleic acid gives castor oil its anti-inflammatory properties
- High vitamin E content promotes skin health
- Natural moisturizing properties benefit hair and scalp
- Industrial applications in cosmetics and pharmaceuticals

"Our production process honors traditional wisdom while embracing modern quality standards," says Operations Manager Michael Ochieng. "We work with local communities who have grown castor beans for generations, combining their knowledge with our technical expertise."

The growing global demand for natural, sustainable products has positioned castor oil as a valuable commodity in international markets. Our commitment to fair trade and sustainable farming ensures that local communities benefit directly from this increased demand.`,
        author: 'Michael Ochieng',
        category: 'Industry News',
        tags: ['castor-oil', 'traditional-medicine', 'research', 'sustainability'],
        image_url: '/images/castor-oil-traditional.jpg',
        status: 'published',
        featured: false,
        published_at: '2024-01-14T11:00:00Z',
        created_at: '2024-01-14T10:30:00Z',
        updated_at: '2024-01-14T10:30:00Z',
        read_time: 7
      },
      {
        id: 5,
        title: 'Join Us at the Uganda International Trade Fair 2024',
        slug: 'uganda-trade-fair-2024',
        excerpt: 'Visit our booth at the upcoming Uganda International Trade Fair to discover our full range of products, meet our team, and explore partnership opportunities.',
        content: `We are thrilled to announce that Afri Processors will be exhibiting at the Uganda International Trade Fair 2024, scheduled for March 15-20 at the UMA Showgrounds in Kampala.

This prestigious event brings together thousands of businesses, investors, and customers from across East Africa and beyond. It's the perfect opportunity to experience our products firsthand and learn more about our commitment to quality and sustainability.

What to expect at our booth:
- Live demonstrations of our production processes
- Product sampling and tasting sessions
- Special trade fair discounts and offers
- One-on-one consultations with our team
- Information about our farmer partnership programs

"We're excited to connect with both existing and potential customers at this important event," says Sales Director Patricia Auma. "The trade fair provides an excellent platform to showcase our products and discuss how we can support businesses with high-quality agricultural products."

Event highlights:
- Daily product demonstrations at 10:00 AM and 2:00 PM
- Meet the farmer sessions every afternoon
- Special bulk order discounts for trade fair visitors
- Networking opportunities with industry leaders

Whether you're a retailer, distributor, restaurant owner, or health-conscious consumer, our booth has something for you. Come discover why Afri Processors is becoming the trusted name for premium African agricultural products.

Visit us at Booth A12 in the Agricultural Products Hall. We can't wait to meet you!`,
        author: 'Patricia Auma',
        category: 'Events',
        tags: ['trade-fair', 'events', 'exhibition', 'networking'],
        image_url: '/images/trade-fair-2024.jpg',
        status: 'published',
        featured: false,
        published_at: '2024-01-12T16:00:00Z',
        created_at: '2024-01-12T15:30:00Z',
        updated_at: '2024-01-12T15:30:00Z',
        read_time: 3
      }
    ]

    // Only show published articles
    const publishedArticles = mockNews.filter(article => article.status === 'published')
    setArticles(publishedArticles)
    setFilteredArticles(publishedArticles)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    let filtered = articles

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory)
    }

    setFilteredArticles(filtered)
  }, [articles, searchTerm, selectedCategory])

  const categories = ['all', ...Array.from(new Set(articles.map(a => a.category)))]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Company News':
        return 'bg-blue-100 text-blue-800'
      case 'Product Launch':
        return 'bg-green-100 text-green-800'
      case 'Sustainability':
        return 'bg-emerald-100 text-emerald-800'
      case 'Industry News':
        return 'bg-purple-100 text-purple-800'
      case 'Events':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (selectedArticle) {
    // Article Detail View
    return (
      <div className="min-h-screen bg-gray-50">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => setSelectedArticle(null)}
            className="mb-8 text-green-600 hover:text-green-700 flex items-center"
          >
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Back to News
          </button>

          <header className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedArticle.category)}`}>
                {selectedArticle.category}
              </span>
              {selectedArticle.featured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  Featured
                </span>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{selectedArticle.title}</h1>
            
            <div className="flex items-center text-gray-600 text-sm space-x-6">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {selectedArticle.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {selectedArticle.published_at && formatDate(selectedArticle.published_at)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {selectedArticle.read_time} min read
              </div>
            </div>
          </header>

          {selectedArticle.image_url && (
            <div className="mb-8">
              <img
                src={selectedArticle.image_url}
                alt={selectedArticle.title}
                className="w-full h-64 sm:h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x400?text=News+Image'
                }}
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed mb-8">{selectedArticle.excerpt}</p>
            <div className="whitespace-pre-wrap text-gray-700">{selectedArticle.content}</div>
          </div>

          {selectedArticle.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-8 border-t">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
                  <Heart className="h-5 w-5" />
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                  <MessageCircle className="h-5 w-5" />
                  <span>Comment</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">News & Insights</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Stay updated with the latest news, product launches, and insights 
              from Afri Processors and the African agricultural industry.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 w-full sm:w-64"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredArticles.length} of {articles.length} articles
            </div>
          </div>
        </div>

        {/* Featured Articles */}
        {filteredArticles.filter(a => a.featured).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredArticles.filter(a => a.featured).map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={article.image_url || 'https://via.placeholder.com/600x300?text=News+Image'}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/600x300?text=News+Image'
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{article.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {article.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {article.published_at && formatDate(article.published_at)}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {article.read_time} min
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Articles */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Articles</h2>
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  {article.image_url && (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=News+Image'
                      }}
                    />
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                      {article.featured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {article.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {article.published_at && new Date(article.published_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {article.read_time}m
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-green-600 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
            <p className="text-green-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to get the latest news, product updates, 
              and agricultural insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button className="px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
