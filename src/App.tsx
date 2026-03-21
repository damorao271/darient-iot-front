import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Darient IoT Front
      </h1>
      <p className="text-gray-600 mb-6">
        Edit <code className="bg-gray-200 px-2 py-1 rounded">src/App.tsx</code>{' '}
        and save to test HMR.
      </p>
      <button
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        onClick={() => setCount((c) => c + 1)}
      >
        Count is {count}
      </button>
    </div>
  )
}

export default App
