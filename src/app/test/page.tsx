export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Test Page</h1>
      <p className="text-lg text-gray-700 mb-4">
        If you can see this page, the basic setup is working!
      </p>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-2">Checks:</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li className="text-green-600">✓ Next.js is running</li>
          <li className="text-green-600">✓ Pages are rendering</li>
          <li className="text-green-600">✓ CSS is loading</li>
          <li className="text-green-600">✓ Components are working</li>
        </ul>
      </div>
      <div className="mt-6">
        <a href="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Back to Home
        </a>
      </div>
    </div>
  )
}
