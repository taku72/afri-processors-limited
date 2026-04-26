'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  FileText, 
  Package, 
  Newspaper, 
  MessageSquare, 
  TrendingUp,
  Calendar,
  Activity,
  Settings
} from 'lucide-react'

// Import page components
import UsersPage from '../../components/admin/UsersPage'
import ContentPage from '../../components/admin/ContentPage'
import ProductsPage from '../../components/admin/ProductsPage'
import NewsPage from '../../components/admin/NewsPage'
import MessagesPage from '../../components/admin/MessagesPage'

// Type definitions
interface StatCard {
  title: string
  value: number
  icon: any
  color: string
  change: string
}

interface RecentActivity {
  id: number
  action: string
  user: string
  time: string
}

interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalNews: number
  totalMessages: number
  recentActivity: RecentActivity[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 2,
    totalProducts: 3,
    totalNews: 3,
    totalMessages: 3,
    recentActivity: []
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

    // Mock stats
    setStats({
      totalUsers: 2,
      totalProducts: 3,
      totalNews: 3,
      totalMessages: 3,
      recentActivity: [
        { id: 1, action: 'User login', user: userData.username, time: 'Just now' },
        { id: 2, action: 'System updated', user: 'system', time: '5 hours ago' },
        { id: 3, action: 'New user created', user: 'superadmin', time: '1 day ago' },
      ]
    })
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <>
      <DashboardContent stats={stats} user={user} />
    </>
  )
}

const DashboardContent = ({ stats, user }: { stats: DashboardStats, user: any }) => {
  const router = useRouter()
  
  const statCards: StatCard[] = [
      {
        title: 'Total Users',
        value: stats.totalUsers,
        icon: Users,
        color: 'bg-blue-500',
        change: '+0 this week'
      },
      {
        title: 'Products',
        value: stats.totalProducts,
        icon: Package,
        color: 'bg-green-500',
        change: 'Active products'
      },
      {
        title: 'News Articles',
        value: stats.totalNews,
        icon: Newspaper,
        color: 'bg-purple-500',
        change: 'Published articles'
      },
      {
        title: 'Messages',
        value: stats.totalMessages,
        icon: MessageSquare,
        color: 'bg-orange-500',
        change: 'Unread messages'
      }
    ]

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="px-2 sm:px-0">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-xs sm:text-base text-gray-600 mt-1">Welcome back, {user?.full_name || user?.username}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
          {statCards.map((stat: StatCard, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-2 sm:p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                  <p className="text-base sm:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">{stat.change}</p>
                </div>
                <div className={`p-1.5 sm:p-3 rounded-lg ${stat.color} flex-shrink-0 ml-2`}>
                  <stat.icon className="h-3 w-3 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Activity Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-2 sm:gap-6">
          {/* Revenue Chart */}
          <div className="xl:col-span-2 bg-white rounded-lg shadow-sm p-2 sm:p-6 border border-gray-200">
            <div className="mb-3 sm:mb-6">
              <h2 className="text-base sm:text-xl font-semibold text-gray-900">Revenue Overview</h2>
              <p className="text-xs sm:text-sm text-gray-600">Monthly revenue trends</p>
            </div>
            <div className="h-32 sm:h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-xs sm:text-sm text-gray-500">Chart will be implemented here</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-2 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3 sm:mb-6">
              <h2 className="text-base sm:text-xl font-semibold text-gray-900">Recent Activity</h2>
              <Activity className="text-gray-400 h-3 w-3 sm:h-5 sm:w-5" />
            </div>
            <div className="space-y-1.5 sm:space-y-4">
              {stats.recentActivity.map((activity: RecentActivity, index: number) => (
                <div key={activity.id} className="flex items-start space-x-1.5 sm:space-x-3">
                  <div className="flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-2 sm:p-6 border border-gray-200">
          <h2 className="text-base sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <button 
              onClick={() => router.push('/admin/users')}
              className="p-2 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 text-left transition-all group"
            >
              <Users className="text-blue-500 mb-1.5 sm:mb-3 group-hover:scale-110 transition-transform h-4 w-4 sm:h-7 sm:w-7" />
              <h3 className="font-semibold text-gray-900 text-xs sm:text-base">Manage Users</h3>
              <p className="text-xs text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">Add or remove admin users</p>
            </button>
            <button 
              onClick={() => router.push('/admin/products')}
              className="p-2 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 text-left transition-all group"
            >
              <Package className="text-green-500 mb-1.5 sm:mb-3 group-hover:scale-110 transition-transform h-4 w-4 sm:h-7 sm:w-7" />
              <h3 className="font-semibold text-gray-900 text-xs sm:text-base">Add Products</h3>
              <p className="text-xs text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">Create new product listings</p>
            </button>
            <button 
              onClick={() => router.push('/admin/news')}
              className="p-2 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 text-left transition-all group"
            >
              <Newspaper className="text-purple-500 mb-1.5 sm:mb-3 group-hover:scale-110 transition-transform h-4 w-4 sm:h-7 sm:w-7" />
              <h3 className="font-semibold text-gray-900 text-xs sm:text-base">Write News</h3>
              <p className="text-xs text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">Publish news articles</p>
            </button>
            <button 
              onClick={() => router.push('/admin/messages')}
              className="p-2 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 text-left transition-all group"
            >
              <MessageSquare className="text-orange-500 mb-1.5 sm:mb-3 group-hover:scale-110 transition-transform h-4 w-4 sm:h-7 sm:w-7" />
              <h3 className="font-semibold text-gray-900 text-xs sm:text-base">View Messages</h3>
              <p className="text-xs text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">Check contact messages</p>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-6">
          <div className="bg-white rounded-lg shadow-sm p-2 sm:p-6 border border-gray-200">
            <h2 className="text-base sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-6">System Status</h2>
            <div className="space-y-2 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-gray-900">Server Status</span>
                <span className="text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 text-green-800 rounded-full">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-gray-900">Database</span>
                <span className="text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 text-green-800 rounded-full">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-gray-900">API Response</span>
                <span className="text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 text-green-800 rounded-full">Normal</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-2 sm:p-6 border border-gray-200">
            <h2 className="text-base sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-6">System Info</h2>
            <div className="space-y-2 sm:space-y-4">
              <div className="p-2 sm:p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 text-xs sm:text-sm">System Status</h3>
                <p className="text-base sm:text-xl font-semibold text-green-600 mt-1">● Operational</p>
              </div>
              <div className="p-2 sm:p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 text-xs sm:text-sm">Version</h3>
                <p className="text-base sm:text-xl font-semibold text-gray-700 mt-1">v1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

