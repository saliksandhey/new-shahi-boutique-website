'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

export function FilterSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '')
  const [isOpen, setIsOpen] = useState(false)

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (minPrice) params.set('min_price', minPrice)
    else params.delete('min_price')
    
    if (maxPrice) params.set('max_price', maxPrice)
    else params.delete('max_price')

    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
    setIsOpen(false)
  }

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('min_price')
    params.delete('max_price')
    params.set('page', '1')
    setMinPrice('')
    setMaxPrice('')
    router.push(`${pathname}?${params.toString()}`)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full mb-8 flex items-center justify-center gap-2 bg-[#F8F9FA] border border-gray-200 py-4 rounded-full text-sm font-bold uppercase tracking-widest text-gray-900 shadow-sm"
      >
        <SlidersHorizontal className="w-4 h-4" />
        {isOpen ? 'Close Filters' : 'Filter Products'}
      </button>

      {/* Filter Form */}
      <form className={`${isOpen ? 'block mb-12' : 'hidden'} lg:block space-y-10 lg:sticky lg:top-32 bg-white rounded-3xl shadow-sm border border-gray-100 p-8`}>
        <div className="flex items-center justify-between lg:hidden mb-6">
           <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Filters</h3>
           <button type="button" onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-900 p-2">
             <X className="w-5 h-5" />
           </button>
        </div>
        <div>
          <h3 className="hidden lg:block text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Price Range</h3>
          <div className="pt-2 flex items-center space-x-3">
            <div className="relative w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">₹</span>
              <input 
                type="number" 
                placeholder="Min" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-gray-50 text-sm font-medium border border-gray-200 focus:border-[#FF7A00] focus:ring-0 pl-8 pr-4 py-3 rounded-xl transition-colors outline-none" 
              />
            </div>
            <span className="text-gray-400 font-bold text-xs uppercase">To</span>
            <div className="relative w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">₹</span>
              <input 
                type="number" 
                placeholder="Max" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-gray-50 text-sm font-medium border border-gray-200 focus:border-[#FF7A00] focus:ring-0 pl-8 pr-4 py-3 rounded-xl transition-colors outline-none" 
              />
            </div>
          </div>
          <div className="mt-8 flex flex-col space-y-3">
            <button type="button" onClick={applyFilters} className="w-full bg-[#1C1C1C] text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#FF7A00] transition-colors duration-300">
              Apply Filter
            </button>
            <button type="button" onClick={clearFilters} className="w-full bg-gray-100 text-gray-900 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300">
              Reset
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
