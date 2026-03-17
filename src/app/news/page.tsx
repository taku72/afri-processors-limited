import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Calendar, User, ArrowRight, Clock } from 'lucide-react'

export default function News() {
  const newsItems = [
    {
      id: 1,
      title: "Afri Processors Launches New Sustainable Packaging Initiative",
      excerpt: "In our commitment to environmental sustainability, we're proud to announce the launch of our new eco-friendly packaging across all product lines...",
      date: "2024-03-15",
      author: "Marketing Team",
      category: "Sustainability",
      readTime: "3 min read",
      image: "/api/placeholder/400/250"
    },
    {
      id: 2,
      title: "Record Production Numbers Q1 2024: 25% Growth",
      excerpt: "Afri Processors reports exceptional first-quarter results with a 25% increase in production volume compared to the same period last year...",
      date: "2024-03-10",
      author: "Finance Department",
      category: "Business",
      readTime: "5 min read",
      image: "/api/placeholder/400/250"
    },
    {
      id: 3,
      title: "Partnership with Local Farmers Boosts Agricultural Economy",
      excerpt: "Our new partnership program with over 500 local farmers has significantly improved supply chain efficiency and farmer incomes...",
      date: "2024-03-05",
      author: "Partnership Team",
      category: "Community",
      readTime: "4 min read",
      image: "/api/placeholder/400/250"
    },
    {
      id: 4,
      title: "Afri Processors Receives Excellence in Manufacturing Award",
      excerpt: "We are honored to receive the National Excellence in Manufacturing Award for our commitment to quality and innovation...",
      date: "2024-02-28",
      author: "CEO Office",
      category: "Awards",
      readTime: "3 min read",
      image: "/api/placeholder/400/250"
    },
    {
      id: 5,
      title: "New State-of-the-Art Processing Plant Opens in Lagos",
      excerpt: "Our newest processing facility in Lagos incorporates the latest technology and sustainable practices, doubling our production capacity...",
      date: "2024-02-20",
      author: "Operations Team",
      category: "Expansion",
      readTime: "6 min read",
      image: "/api/placeholder/400/250"
    },
    {
      id: 6,
      title: "Employee Training Program Benefits 1,200 Staff Members",
      excerpt: "Our comprehensive employee development program has successfully trained over 1,200 staff members in advanced processing techniques...",
      date: "2024-02-15",
      author: "HR Department",
      category: "People",
      readTime: "4 min read",
      image: "/api/placeholder/400/250"
    }
  ]

  const categories = ["All", "Sustainability", "Business", "Community", "Awards", "Expansion", "People"]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            News & Updates
          </h1>
          <p className="text-lg text-primary-100">
            Stay updated with the latest news and developments from Afri Processors
          </p>
        </div>
      </section>

      {/* News Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item) => (
              <article key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gray-200 h-48 rounded-t-lg flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <Calendar size={48} className="mx-auto mb-2" />
                    <p className="text-sm">News Image</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium">
                      {item.category}
                    </span>
                    <span className="mx-2">•</span>
                    <Clock size={14} className="mr-1" />
                    <span>{item.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {item.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <User size={14} className="mr-1" />
                      <span>{item.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/news/${item.id}`}
                    className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700"
                  >
                    Read More
                    <ArrowRight className="ml-2" size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Subscribe to our newsletter for the latest news and updates
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
