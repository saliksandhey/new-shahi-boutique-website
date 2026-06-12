'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export function SearchBar({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()
  const initialRender = useRef(true)

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      return
    }

    const timer = setTimeout(() => {
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      } else {
        router.push(`/search`)
      }
    }, 300) // 300ms debounce for live search

    return () => clearTimeout(timer)
  }, [query, router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    } else {
      router.push(`/search`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative flex items-center w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What are you looking for?"
        className="w-full bg-white border border-gray-200 focus:border-[#FF7A00] focus:ring-0 rounded-full py-5 pl-8 pr-16 text-sm sm:text-base font-bold text-gray-900 shadow-sm outline-none transition-colors"
      />
      <button type="submit" className="absolute right-3 bg-[#1C1C1C] p-3 rounded-full text-white hover:bg-[#FF7A00] transition-colors">
        <Search className="h-5 w-5" />
      </button>
    </form>
  )
}
