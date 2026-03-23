'use client'

import { FileText } from 'lucide-react'

export default function ContentPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <FileText className="text-gray-400 mb-4" size={48} />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Management</h3>
      <p className="text-gray-500 text-center max-w-md">
        No content available yet. This page will display content management functionality when the backend is implemented.
      </p>
    </div>
  )
}
