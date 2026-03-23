'use client'

import { Bell, X, Check, Clock, Info, AlertCircle, CheckCircle } from 'lucide-react'

interface NotificationDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationDialog({ isOpen, onClose }: NotificationDialogProps) {
  const mockNotifications = [
    {
      id: 1,
      type: 'info',
      title: 'System Update',
      message: 'The system will be updated tonight at 11 PM EST',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'New User Registration',
      message: 'John Doe has registered as a new user',
      time: '5 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Low Stock Alert',
      message: 'Rice product is running low on stock',
      time: '1 day ago',
      read: true
    },
    {
      id: 4,
      type: 'error',
      title: 'Failed Login Attempt',
      message: 'Multiple failed login attempts detected',
      time: '2 days ago',
      read: true
    }
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-600" size={20} />
      case 'warning':
        return <AlertCircle className="text-yellow-600" size={20} />
      case 'error':
        return <AlertCircle className="text-red-600" size={20} />
      default:
        return <Info className="text-blue-600" size={20} />
    }
  }

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
        />

        {/* Dialog */}
        <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Bell className="text-gray-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {mockNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {mockNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`
                      p-4 border-l-4 transition-colors hover:bg-gray-50
                      ${getNotificationBg(notification.type)}
                      ${!notification.read ? 'border-l-blue-500' : 'border-l-transparent'}
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Clock size={12} className="mr-1" />
                          {notification.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {mockNotifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Mark all as read
                </button>
                <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
