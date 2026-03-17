'use client'

export default function DemoAdminPage() {
  return (
    <div className="min-h-screen bg-agri-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-white">
            <span className="text-2xl font-bold text-primary-700">AP</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Admin Login Demo
          </h2>
          <p className="mt-2 text-center text-sm text-primary-100">
            Use demo credentials to access admin panel
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
              <h3 className="font-semibold mb-2">Demo Credentials:</h3>
              <p className="text-sm"><strong>Username:</strong> admin</p>
              <p className="text-sm"><strong>Password:</strong> afri123</p>
            </div>
            
            <div className="text-center">
              <a
                href="/admin/login"
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors inline-block"
              >
                Go to Login Page
              </a>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Click the button above to login with demo credentials
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
