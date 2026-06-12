import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4">
      <FileQuestion className="w-16 h-16 text-stone-300 mb-6" />
      <h1 className="text-3xl font-serif tracking-widest text-gray-900 mb-4 uppercase">Page Not Found</h1>
      <p className="text-gray-500 font-light mb-8 text-center max-w-md">
        We couldn't find the page you were looking for. It might have been removed, renamed, or didn't exist in the first place.
      </p>
      <div className="flex space-x-4">
        <Link href="/shop" className="bg-black text-white px-8 py-3 text-sm uppercase tracking-widest transition-colors hover:bg-gray-800">
          Continue Shopping
        </Link>
        <Link href="/" className="bg-white text-black border border-black px-8 py-3 text-sm uppercase tracking-widest transition-colors hover:bg-stone-50">
          Return Home
        </Link>
      </div>
    </div>
  )
}
