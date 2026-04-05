'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Plus, Edit2, Trash2, Search, Filter, UserCheck, Shield, Activity } from 'lucide-react'

interface User {
  id: string
  username: string
  email: string
  full_name: string
  role: string
  is_active: boolean
  last_login: string | null
  created_at: string
}

export default function UsersPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [success, setSuccess] = useState('')

  // Form states
  const [createForm, setCreateForm] = useState({
    username: '',
    email: '',
    fullName: '',
    role: 'admin',
    password: '',
    confirmPassword: ''
  })

  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    fullName: '',
    role: 'admin',
    isActive: true
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
      setCurrentUser(userData)
    } catch {
      router.push('/admin/login')
      return
    }

    // Check if user has permission
    if (userData.role !== 'super_admin') {
      router.push('/admin')
      return
    }

    // Fetch real users and stats from database
    fetchData()
  }, [router])

  const fetchUsers = async () => {
    try {
      const sessionData = localStorage.getItem('adminSession')
      if (!sessionData) {
        throw new Error('No session found')
      }

      const userData = JSON.parse(sessionData)
      const authHeader = 'Basic ' + btoa(`${userData.username}:${userData.username}`)

      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': authHeader
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const result = await response.json()
      console.log('API Response:', result)
      console.log('Users array:', result.users)
      console.log('Number of users received:', result.users?.length || 0)
      
      setUsers(result.users || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    }
  }

  const fetchStats = async () => {
    try {
      const sessionData = localStorage.getItem('adminSession')
      if (!sessionData) {
        throw new Error('No session found')
      }

      const userData = JSON.parse(sessionData)
      const authHeader = 'Basic ' + btoa(`${userData.username}:${userData.username}`)

      const response = await fetch('/api/admin/users/stats', {
        headers: {
          'Authorization': authHeader
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user stats')
      }

      const result = await response.json()
      console.log('Stats Response:', result)
      
      setStats(result.stats)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
      // Don't set error for stats failure, just log it
    }
  }

  const fetchData = async () => {
    try {
      await Promise.all([fetchUsers(), fetchStats()])
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false) // Ensure loading is set to false
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (createForm.password !== createForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (createForm.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    try {
      const sessionData = localStorage.getItem('adminSession')
      if (!sessionData) {
        throw new Error('No session found')
      }

      const userData = JSON.parse(sessionData)
      const authHeader = 'Basic ' + btoa(`${userData.username}:${userData.username}`)

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: createForm.username,
          email: createForm.email,
          password: createForm.password,
          fullName: createForm.fullName,
          role: createForm.role
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create user')
      }

      setSuccess('User created successfully!')
      setShowCreateModal(false)
      setCreateForm({
        username: '',
        email: '',
        fullName: '',
        role: 'admin',
        password: '',
        confirmPassword: ''
      })
      fetchData() // Refresh both users and stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user')
    }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedUser) return

    try {
      const sessionData = localStorage.getItem('adminSession')
      if (!sessionData) {
        throw new Error('No session found')
      }

      const userData = JSON.parse(sessionData)
      const authHeader = 'Basic ' + btoa(`${userData.username}:${userData.username}`)

      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: editForm.username,
          email: editForm.email,
          fullName: editForm.fullName,
          role: editForm.role,
          isActive: editForm.isActive
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update user')
      }

      setSuccess('User updated successfully!')
      setShowEditModal(false)
      setSelectedUser(null)
      fetchData() // Refresh both users and stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const sessionData = localStorage.getItem('adminSession')
      if (!sessionData) {
        throw new Error('No session found')
      }

      const userData = JSON.parse(sessionData)
      const authHeader = 'Basic ' + btoa(`${userData.username}:${userData.username}`)

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': authHeader
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete user')
      }

      setSuccess('User deleted successfully!')
      fetchData() // Refresh both users and stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setEditForm({
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      isActive: user.is_active
    })
    setShowEditModal(true)
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-2 sm:px-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-xs sm:text-base text-gray-600 mt-1">Manage admin users and permissions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-3 sm:mt-0 inline-flex items-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Add User
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500 mt-1">All registered users</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-blue-500 flex-shrink-0 ml-2">
                <Users className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{stats.activeUsers}</p>
                <p className="text-xs text-gray-500 mt-1">Currently active</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-green-500 flex-shrink-0 ml-2">
                <UserCheck className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Super Admins</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{stats.superAdminUsers}</p>
                <p className="text-xs text-gray-500 mt-1">Administrators</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-purple-500 flex-shrink-0 ml-2">
                <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Recent Logins</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{stats.recentLogins}</p>
                <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-orange-500 flex-shrink-0 ml-2">
                <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
              />
            </div>
          </div>
          <button className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Role
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Last Login
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Created
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 sm:px-6 py-8 text-center text-xs sm:text-sm text-gray-500">
                    {searchQuery ? 'No users found matching your search.' : 'No users found.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-white text-xs sm:text-sm font-medium">
                              {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                            {user.full_name}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[120px] sm:max-w-none">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'super_admin' 
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.is_active 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs text-gray-500 hidden lg:table-cell">
                      {user.last_login ? formatDate(user.last_login) : 'Never'}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs text-gray-500 hidden sm:table-cell">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                      <div className="flex justify-end space-x-1 sm:space-x-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Create New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={createForm.username}
                  onChange={(e) => setCreateForm({...createForm, username: e.target.value})}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm({...createForm, fullName: e.target.value})}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm({...createForm, role: e.target.value})}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={createForm.confirmPassword}
                  onChange={(e) => setCreateForm({...createForm, confirmPassword: e.target.value})}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 sm:space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Edit User</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-2"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
              <div className="flex justify-end space-x-3 sm:space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
