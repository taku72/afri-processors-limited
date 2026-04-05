'use client'

import { useState } from 'react'
import { LogOut, Menu, Search, Bell, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AdminHeaderProps {
  user: {
    username: string
    full_name: string
    role: string
  }
  isSidebarMinimized: boolean
  onToggleSidebar: () => void
  onToggleNotifications: () => void
  onToggleMobileMenu: () => void
}

export default function AdminHeader({ user, isSidebarMinimized, onToggleSidebar, onToggleNotifications, onToggleMobileMenu }: AdminHeaderProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    router.push('/admin/login')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery)
  }

  const marginLeft = isSidebarMinimized ? 'lg:ml-16' : 'lg:ml-64'

  return (
    <header className={`
      bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40
      transition-all duration-300 ease-in-out
      ${marginLeft}
    `}>
      <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
        {/* Left Section - Mobile Menu Toggle and Search */}
        <div className="flex items-center flex-1">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-4"
          >
            <Menu size={24} />
          </button>

          {/* Search Field */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </form>
        </div>

        {/* Right Section - Notifications, Profile, and Logout */}
        <div className="flex items-center space-x-4 ml-4">
          {/* Notification Icon */}
          <button 
            onClick={onToggleNotifications}
            className="relative p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors" 
            title="Notifications"
          >
            <Bell size={20} />
            {/* Notification Badge */}
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Section */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Profile Icon */}
            <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Mobile Profile Icon */}
          <div className="sm:hidden h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>

          {/* Logout Button with Text */}
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Log out</span>
          </button>

          {/* Mobile Logout Button */}
          <button
            onClick={handleLogout}
            className="sm:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
