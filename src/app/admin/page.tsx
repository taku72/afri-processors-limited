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
  Activity
} from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalUsers: 2,
    totalProducts: 0,
    totalNews: 0,
    totalMessages: 0,
    recentActivity: [] as Array<{ id: number; action: string; user: string; time: string }>
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
      totalProducts: 0,
      totalNews: 0,
      totalMessages: 0,
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

  const statCards = [
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
      change: 'No products yet'
    },
    {
      title: 'News Articles',
      value: stats.totalNews,
      icon: Newspaper,
      color: 'bg-purple-500',
      change: 'No articles yet'
    },
    {
      title: 'Messages',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'bg-orange-500',
      change: 'No new messages'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.full_name}!</h1>
        <p className="text-green-100">Here's what's happening with your admin portal today.</p>
        <div className="mt-4 flex items-center space-x-4">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
            Role: {user.role.replace('_', ' ')}
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
            Last login: Just now
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 text-left transition-all group">
            <Users className="text-blue-500 mb-3 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="font-semibold text-gray-900">Manage Users</h3>
            <p className="text-sm text-gray-600 mt-1">Add or remove admin users</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 text-left transition-all group">
            <Package className="text-green-500 mb-3 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="font-semibold text-gray-900">Add Products</h3>
            <p className="text-sm text-gray-600 mt-1">Create new product listings</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 text-left transition-all group">
            <Newspaper className="text-purple-500 mb-3 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="font-semibold text-gray-900">Write News</h3>
            <p className="text-sm text-gray-600 mt-1">Publish news articles</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 text-left transition-all group">
            <MessageSquare className="text-orange-500 mb-3 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="font-semibold text-gray-900">View Messages</h3>
            <p className="text-sm text-gray-600 mt-1">Check contact messages</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <Activity className="text-gray-400" size={20} />
        </div>
        <div className="space-y-4">
          {stats.recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          ) : (
            stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">by {activity.user}</p>
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar size={14} className="mr-1" />
                  {activity.time}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 text-sm">User Role</h3>
            <p className="text-lg font-semibold text-gray-700 capitalize mt-1">{user.role.replace('_', ' ')}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 text-sm">Last Login</h3>
            <p className="text-lg font-semibold text-gray-700 mt-1">Just now</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 text-sm">System Status</h3>
            <p className="text-lg font-semibold text-green-600 mt-1">● Operational</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 text-sm">Version</h3>
            <p className="text-lg font-semibold text-gray-700 mt-1">v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
