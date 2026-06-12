import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default async function FailedPage({ searchParams }: { searchParams: { reason?: string } }) {
  const params = await searchParams;
  const reason = params.reason || 'Unknown error'

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-white">
      <XCircle className="w-16 h-16 text-red-600 mb-6" />
      <h1 className="text-4xl font-serif text-gray-900 mb-2 uppercase tracking-widest text-center">Payment Failed</h1>
      <p className="text-gray-500 font-light mb-8 text-center max-w-md">
        Unfortunately, your payment could not be processed.
        <br />
        <span className="text-sm mt-2 block">Reason: <span className="font-medium text-gray-900">{reason}</span></span>
      </p>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Link href="/checkout" className="bg-black text-white px-8 py-4 text-sm font-medium uppercase tracking-widest transition-colors hover:bg-gray-800 text-center">
          Try Again
        </Link>
        <Link href="/cart" className="bg-white text-black border border-black px-8 py-4 text-sm font-medium uppercase tracking-widest transition-colors hover:bg-stone-50 text-center">
          Return to Cart
        </Link>
      </div>
    </div>
  )
}
