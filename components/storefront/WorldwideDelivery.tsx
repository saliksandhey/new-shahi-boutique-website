'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function WorldwideDelivery() {
  const countries = [
    { name: 'United States', code: 'us' },
    { name: 'United Kingdom', code: 'gb' },
    { name: 'Canada', code: 'ca' },
    { name: 'Australia', code: 'au' },
    { name: 'United Arab Emirates', code: 'ae' },
    { name: 'France', code: 'fr' },
    { name: 'Germany', code: 'de' },
    { name: 'Japan', code: 'jp' },
    { name: 'Saudi Arabia', code: 'sa' },
    { name: 'Italy', code: 'it' },
    { name: 'Switzerland', code: 'ch' },
    { name: 'Singapore', code: 'sg' },
  ]

  // Duplicate the array to create a seamless infinite scroll
  const marqueeItems = [...countries, ...countries]

  return (
    <section className="py-12 md:py-20 bg-white overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        
        <div className="text-center mb-10 md:mb-16 relative z-10">
          <span className="text-[10px] md:text-sm font-bold text-[#FF7A00] uppercase tracking-widest mb-3 md:mb-4 block">
            Countries
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-sans font-black text-gray-900 tracking-tighter leading-none">
            WE'RE TRUSTED BY
          </h2>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden flex items-center h-[160px] md:h-[200px] z-10 -mx-6 sm:-mx-8 lg:-mx-12 px-6 sm:px-8 lg:px-12">
          <motion.div
            className="flex gap-4 md:gap-6 whitespace-nowrap absolute left-0 pl-6 sm:pl-8 lg:pl-12"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 40,
              ease: 'linear',
              repeat: Infinity,
            }}
          >
            {marqueeItems.map((country, idx) => (
              <div 
                key={`${country.code}-${idx}`}
                className="flex-shrink-0 w-36 h-32 md:w-48 md:h-40 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative w-12 h-12 md:w-16 md:h-16 mb-3 rounded-full overflow-hidden shadow-sm border border-black/5">
                  <Image 
                    src={`https://flagcdn.com/${country.code}.svg`} 
                    alt={`${country.name} Flag`}
                    fill
                    sizes="(max-width: 768px) 48px, 64px"
                    className="object-cover"
                  />
                </div>
                <span className="text-xs md:text-sm font-bold text-gray-900 text-center whitespace-normal leading-tight tracking-wide">
                  {country.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Subtle gradient overlays for the edges of the marquee to fade smoothly */}
        <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>
        
      </div>
    </section>
  )
}
