'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

export function HeroSlider({ banners }: { banners: any[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!banners?.length) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [banners])

  if (!banners?.length) return null

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-stone-900 group">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <Image 
            src={banner.image} 
            alt={banner.title || 'Banner'} 
            fill 
            priority={index === 0}
            className="object-cover opacity-70" 
            sizes="100vw"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            {banner.subtitle && <span className="text-white text-sm md:text-base font-medium tracking-[0.2em] uppercase mb-4 block animate-fade-in-up">{banner.subtitle}</span>}
            {banner.title && <h1 className="text-white font-serif text-4xl md:text-6xl lg:text-7xl mb-8 animate-fade-in-up delay-100 max-w-4xl">{banner.title}</h1>}
            {banner.button_text && banner.button_link && (
              <Link href={banner.button_link} className="bg-white text-black px-8 py-3 text-sm font-medium uppercase tracking-widest hover:bg-stone-200 transition-colors animate-fade-in-up delay-200">
                {banner.button_text}
              </Link>
            )}
          </div>
        </div>
      ))}
      
      {banners.length > 1 && (
        <>
          <button onClick={() => setCurrent(prev => (prev - 1 + banners.length) % banners.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/50 hover:text-white transition-colors opacity-0 group-hover:opacity-100 hidden md:block">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button onClick={() => setCurrent(prev => (prev + 1) % banners.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/50 hover:text-white transition-colors opacity-0 group-hover:opacity-100 hidden md:block">
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}
    </div>
  )
}
