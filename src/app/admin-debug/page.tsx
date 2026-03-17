'use client'

import { useEffect, useState } from 'react'

export default function AdminDebugPage() {
  const [authStatus, setAuthStatus] = useState<string>('checking...')
  const [localStorageData, setLocalStorageData] = useState<any>({})

  useEffect(() => {
    // Check authentication status
    const status = localStorage.getItem('adminAuthenticated')
    setAuthStatus(status || 'not found')
    
    // Get all localStorage data
    const data: any = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        data[key] = localStorage.getItem(key)
      }
    }
    setLocalStorageData(data)
  }, [])

  const handleLogin = () => {
    localStorage.setItem('adminAuthenticated', 'true')
    localStorage.setItem('adminLoginTime', new Date().toISOString())
    window.location.reload()
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminLoginTime')
    window.location.reload()
  }

  const goToAdmin = () => {
    window.location.href = '/admin'
  }

  const goToLogin = () => {
    window.location.href = '/admin/login'
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p><strong>Auth Status:</strong> {authStatus}</p>
            <p><strong>Current Time:</strong> {new Date().toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">LocalStorage Data</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(localStorageData, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleLogin}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Simulate Login
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Simulate Logout
            </button>
            <button
              onClick={goToAdmin}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Admin
            </button>
            <button
              onClick={goToLogin}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Go to Login
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Check your authentication status above</li>
            <li>If not authenticated, click "Simulate Login"</li>
            <li>Then click "Go to Admin" to test admin dashboard</li>
            <li>If admin shows blank, there might be a component error</li>
            <li>Check browser console (F12) for any JavaScript errors</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
