'use client'

import { useState } from 'react'
import Image from 'next/image'

export function ProductGallery({ images }: { images: any[] }) {
  const sortedImages = [...images].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
  const [activeImage, setActiveImage] = useState(sortedImages[0]?.url || '/placeholder.png')

  return (
    <>
      {/* Mobile Gallery (Edge to Edge Carousel) */}
      <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full pb-4">
        {sortedImages.map((img, idx) => (
          <div key={img.id} className="relative aspect-[4/5] w-full flex-shrink-0 snap-center bg-gray-100">
            <Image
              src={img.url}
              alt={`Product image ${idx + 1}`}
              fill
              className="object-cover object-top"
              priority={idx === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Desktop Gallery */}
      <div className="hidden lg:flex flex-row gap-6">
        {/* Thumbnails */}
        {sortedImages.length > 1 && (
          <div className="flex flex-col gap-4 overflow-y-auto w-24 flex-shrink-0 hide-scrollbar pb-0">
            {sortedImages.map((img) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(img.url)}
                className={`relative aspect-[3/4] w-full flex-shrink-0 bg-gray-100 rounded-2xl overflow-hidden transition-all duration-300 ${
                  activeImage === img.url ? 'border-2 border-[#FF7A00] scale-95 shadow-md' : 'border border-transparent hover:opacity-80'
                }`}
              >
                <Image src={img.url} alt="Thumbnail" fill className="object-cover" sizes="96px" />
              </button>
            ))}
          </div>
        )}

        {/* Main Image */}
        <div className="relative aspect-[3/4] w-full bg-gray-100 rounded-3xl overflow-hidden flex-1 group shadow-sm">
          {activeImage !== '/placeholder.png' ? (
            <Image
              src={activeImage}
              alt="Product image"
              fill
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
               <span className="font-sans font-bold text-gray-400 text-sm tracking-widest uppercase">No Image</span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
