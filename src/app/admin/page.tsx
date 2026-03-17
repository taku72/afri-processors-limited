'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/auth'
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
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalUsers: 2,
    totalProducts: 0,
    totalNews: 0,
    totalMessages: 0,
    recentActivity: [] as Array<{ id: number; action: string; user: string; time: string }>
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    // Mock stats - in production, fetch from API
    setStats({
      totalUsers: 2,
      totalProducts: 0,
      totalNews: 0,
      totalMessages: 0,
      recentActivity: [
        { id: 1, action: 'User login', user: 'superadmin', time: '2 hours ago' },
        { id: 2, action: 'System updated', user: 'system', time: '5 hours ago' },
        { id: 3, action: 'New user created', user: 'superadmin', time: '1 day ago' },
      ]
    })
  }, [])

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
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.full_name}!</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your admin portal today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <Users className="text-blue-500 mb-2" size={24} />
            <h3 className="font-medium text-gray-900">Manage Users</h3>
            <p className="text-sm text-gray-600">Add or remove admin users</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <Package className="text-green-500 mb-2" size={24} />
            <h3 className="font-medium text-gray-900">Add Products</h3>
            <p className="text-sm text-gray-600">Create new product listings</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <Newspaper className="text-purple-500 mb-2" size={24} />
            <h3 className="font-medium text-gray-900">Write News</h3>
            <p className="text-sm text-gray-600">Publish news articles</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <MessageSquare className="text-orange-500 mb-2" size={24} />
            <h3 className="font-medium text-gray-900">View Messages</h3>
            <p className="text-sm text-gray-600">Check contact messages</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Activity className="text-gray-400" size={20} />
        </div>
        <div className="space-y-4">
          {stats.recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          ) : (
            stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">User Role</h3>
            <p className="text-sm text-gray-600 capitalize">{user.role.replace('_', ' ')}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Last Login</h3>
            <p className="text-sm text-gray-600">Just now</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">System Status</h3>
            <p className="text-sm text-green-600">● All systems operational</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Version</h3>
            <p className="text-sm text-gray-600">v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
