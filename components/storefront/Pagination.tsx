'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-center space-x-6">
      <button 
        onClick={() => handlePageChange(currentPage - 1)} 
        disabled={currentPage <= 1}
        className="p-3 rounded-full border border-gray-200 text-gray-500 hover:text-white hover:bg-[#FF7A00] hover:border-[#FF7A00] disabled:opacity-50 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <span className="text-sm font-bold uppercase tracking-widest text-gray-900">
        Page {currentPage} of {totalPages}
      </span>
      <button 
        onClick={() => handlePageChange(currentPage + 1)} 
        disabled={currentPage >= totalPages}
        className="p-3 rounded-full border border-gray-200 text-gray-500 hover:text-white hover:bg-[#FF7A00] hover:border-[#FF7A00] disabled:opacity-50 transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
