'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)

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
      />
      
      <AdminHeader 
        user={user} 
        isSidebarMinimized={isSidebarMinimized}
        onToggleSidebar={() => setIsSidebarMinimized(!isSidebarMinimized)}
      />

      {/* Main Content */}
      <main className={`
        transition-all duration-300 ease-in-out
        ${isSidebarMinimized ? 'ml-16' : 'ml-64'}
      `}>
        <div className="p-4 sm:p-6 lg:p-8 pt-20">
          {children}
        </div>
      </main>
    </div>
  )
}
