'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ArrowDownUp } from 'lucide-react'

export function SortSelect({ currentSort }: { currentSort: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', e.target.value)
    params.set('page', '1') // reset to page 1 on sort change
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="relative w-full sm:w-auto">
      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none lg:hidden">
        <ArrowDownUp className="w-4 h-4 text-white" />
      </div>
      <select
        value={currentSort}
        onChange={handleSortChange}
        className="w-full bg-[#1C1C1C] sm:bg-gray-50 text-white sm:text-gray-900 border border-transparent sm:border-gray-200 rounded-full py-4 sm:py-2 pl-12 sm:pl-6 pr-10 text-xs font-bold focus:border-[#FF7A00] focus:ring-0 uppercase tracking-widest cursor-pointer outline-none sm:hover:border-gray-300 transition-colors appearance-none shadow-xl sm:shadow-none text-left sm:text-left"
        style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="featured">Featured</option>
      </select>
    </div>
  )
}
