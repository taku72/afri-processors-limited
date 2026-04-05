'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Package, 
  Newspaper, 
  MessageSquare, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'

interface AdminSidebarProps {
  user: {
    role: string
  }
  isMinimized: boolean
  onToggleMinimize: () => void
  isOpen: boolean
  onClose: () => void
}

export default function AdminSidebar({ user, isMinimized, onToggleMinimize, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Users, label: 'Users', href: '/admin/users', role: 'super_admin' },
    { icon: FileText, label: 'Content', href: '/admin/content' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: Newspaper, label: 'News', href: '/admin/news' },
    { icon: MessageSquare, label: 'Messages', href: '/admin/messages' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ]

  const filteredMenuItems = menuItems.filter(item => 
    !item.role || user.role === item.role
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen bg-white shadow-lg border-r border-gray-200 z-50 
        transition-all duration-300 ease-in-out
        ${isMinimized ? 'w-16' : 'w-64'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Admin Portal Title */}
        <div className={`
          border-b border-gray-200 p-4 h-16 flex items-center justify-between
          ${isMinimized ? 'text-center' : ''}
        `}>
          <h1 className={`
            font-semibold text-gray-900
            ${isMinimized ? 'text-xs' : 'text-lg'}
          `}>
            {isMinimized ? 'AP' : 'Admin Portal'}
          </h1>
          
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Minimize/Maximize Button (Desktop Only) */}
        <button
          onClick={onToggleMinimize}
          className="absolute -right-3 top-20 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:shadow-lg transition-shadow z-40 hidden lg:block"
        >
          {isMinimized ? (
            <ChevronRight size={16} className="text-gray-600" />
          ) : (
            <ChevronLeft size={16} className="text-gray-600" />
          )}
        </button>

      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md 
                  transition-all
                  ${isMinimized ? 'justify-center' : ''}
                  ${isActive 
                    ? 'bg-green-50 text-green-700 border-r-2 border-green-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
                title={isMinimized ? item.label : undefined}
              >
                <item.icon className={`h-5 w-5 ${isMinimized ? '' : 'mr-3'}`} />
                {!isMinimized && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
    </>
  )
}
