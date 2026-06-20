'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

export function FilterSidebar({ categories }: { categories?: any[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [isOpen, setIsOpen] = useState(false)

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (minPrice) params.set('min_price', minPrice)
    else params.delete('min_price')
    
    if (maxPrice) params.set('max_price', maxPrice)
    else params.delete('max_price')

    if (category) params.set('category', category)
    else params.delete('category')

    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
    setIsOpen(false)
  }

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('min_price')
    params.delete('max_price')
    params.delete('category')
    params.set('page', '1')
    setMinPrice('')
    setMaxPrice('')
    setCategory('')
    router.push(`${pathname}?${params.toString()}`)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden w-full flex items-center justify-center gap-2 bg-[#1C1C1C] text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl transition-transform active:scale-95"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filter
      </button>

      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Filter Form */}
      <form 
        className={`
          fixed lg:static inset-x-0 bottom-0 z-50 lg:z-auto
          bg-white rounded-t-[2rem] lg:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:shadow-sm border-t lg:border border-gray-100 
          p-6 sm:p-8 lg:p-8 space-y-8 lg:space-y-10 lg:sticky lg:top-32
          transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isOpen ? 'translate-y-0' : 'translate-y-[120%] lg:translate-y-0'}
          flex flex-col max-h-[85vh] lg:max-h-none lg:block
        `}
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2 lg:hidden shrink-0" />
        <div className="flex items-center justify-between lg:hidden mb-2 shrink-0">
           <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Filters</h3>
           <button type="button" onClick={() => setIsOpen(false)} className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors">
             <X className="w-4 h-4 text-gray-900" />
           </button>
        </div>
        <div className="overflow-y-auto flex-1 pb-safe lg:overflow-visible">
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

          {categories && categories.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Category</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="category" 
                    value="" 
                    checked={category === ''}
                    onChange={() => setCategory('')}
                    className="w-4 h-4 text-[#FF7A00] border-gray-300 focus:ring-[#FF7A00]"
                  />
                  <span className="text-sm font-medium text-gray-700">All Categories</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="category" 
                      value={cat.slug} 
                      checked={category === cat.slug}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-4 h-4 text-[#FF7A00] border-gray-300 focus:ring-[#FF7A00]"
                    />
                    <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col space-y-3 shrink-0">
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
