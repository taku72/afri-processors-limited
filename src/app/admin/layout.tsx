'use client'

import React, { useEffect, useState } from 'react'
import NotificationContext from '@/contexts/NotificationContext'
import { useRouter, usePathname } from 'next/navigation'
import { Bell, X } from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false)

  // Skip authentication for login page
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) return // Don't check auth on login page

    // Simple session check
    const sessionData = localStorage.getItem('adminSession')
    
    if (!sessionData) {
      router.push('/admin/login')
      return
    }
    
    try {
      const userData = JSON.parse(sessionData)
      setUser(userData)
    } catch {
      router.push('/admin/login')
    }
  }, [router, isLoginPage])

  // For login page, just render children without admin layout
  if (isLoginPage) {
    return <>{children}</>
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const sidebarWidth = isSidebarMinimized ? 'w-16' : 'w-64'

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar 
        user={user} 
        isMinimized={isSidebarMinimized}
        onToggleMinimize={() => setIsSidebarMinimized(!isSidebarMinimized)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <AdminHeader 
        user={user} 
        isSidebarMinimized={isSidebarMinimized}
        onToggleSidebar={() => setIsSidebarMinimized(!isSidebarMinimized)}
        onToggleNotifications={() => setIsNotificationDialogOpen(!isNotificationDialogOpen)}
        onToggleMobileMenu={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <main className={`
        transition-all duration-300 ease-in-out
        lg:ml-16
        ${isSidebarMinimized ? 'lg:ml-16' : 'lg:ml-64'}
      `}>
        <div className="p-4 sm:p-6 lg:p-8 pt-20">
          {children}
        </div>
      </main>
      
      {/* Notification Dialog */}
      {isNotificationDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setIsNotificationDialogOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl z-50">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Bell className="text-gray-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              </div>
              <button
                onClick={() => setIsNotificationDialogOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8 text-center">
              <Bell className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No new notifications</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
