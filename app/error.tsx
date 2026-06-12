'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50 px-4">
      <AlertCircle className="w-16 h-16 text-stone-400 mb-6" />
      <h1 className="text-3xl font-serif tracking-widest text-gray-900 mb-4 uppercase">Something went wrong</h1>
      <p className="text-gray-500 font-light mb-8 text-center max-w-md">
        An unexpected error occurred on this page. We apologize for the inconvenience.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={() => reset()}
          className="bg-black text-white px-8 py-3 text-sm uppercase tracking-widest transition-colors hover:bg-gray-800"
        >
          Try Again
        </button>
        <Link href="/" className="bg-white text-black border border-black px-8 py-3 text-sm uppercase tracking-widest transition-colors hover:bg-stone-50">
          Return Home
        </Link>
      </div>
    </div>
  )
}
