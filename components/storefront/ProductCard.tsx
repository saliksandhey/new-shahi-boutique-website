'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'

export function ProductCard({ product, variant = 'vertical' }: { product: any, variant?: 'vertical' | 'horizontal' }) {
  const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.url || product.product_images?.[0]?.url || '/placeholder.png'

  return (
    <Link href={`/product/${product.slug}`} className={`group flex flex-col h-full bg-white p-3 sm:p-4 rounded-2xl sm:rounded-[2rem] shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 ${variant === 'horizontal' ? 'lg:flex-row lg:p-4 lg:gap-6 lg:items-center' : ''}`}>
      {/* Image Container */}
      <div className={`relative aspect-[4/5] w-full overflow-hidden bg-gray-100 rounded-xl sm:rounded-[1.5rem] mb-3 sm:mb-4 ${variant === 'horizontal' ? 'lg:w-[45%] lg:mb-0 lg:shrink-0' : ''}`}>
        {primaryImage !== '/placeholder.png' ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
             <span className="font-sans font-bold text-gray-400 text-sm tracking-widest uppercase">No Image</span>
          </div>
        )}
        
        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 flex justify-between items-start z-10">
          {/* Left Badge (Sale / Featured) */}
          <div>
            {(product.sale_price || product.featured) ? (
              <span className="bg-white text-gray-900 text-[10px] font-bold px-2.5 py-1 sm:px-4 sm:py-2 rounded-full shadow-sm uppercase tracking-widest">
                {product.sale_price ? 'Sale' : 'Best Seller'}
              </span>
            ) : (
               <span className="bg-white/0"></span>
            )}
          </div>
          
          {/* Right Wishlist Icon */}
          <button 
            type="button"
            className="bg-white p-2 sm:p-2.5 rounded-full shadow-sm hover:scale-110 transition-transform text-[#FF7A00]"
            onClick={(e) => {
              e.preventDefault(); // Prevent navigating to product page
            }}
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
        </div>

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-300 z-0 pointer-events-none" />
      </div>

      {/* Content */}
      <div className={`px-1 sm:px-2 pb-1 text-center flex flex-col flex-1 ${variant === 'horizontal' ? 'lg:justify-center lg:w-[55%] lg:text-left lg:px-6 lg:py-6' : ''}`}>
        {/* Category/Brand */}
        <div className={`text-[10px] text-[#FF7A00] font-bold mb-1 sm:mb-2 tracking-[0.2em] uppercase ${variant === 'horizontal' ? 'lg:mb-3 lg:text-[11px]' : ''}`}>
          {product.categories?.name || 'Streetwear'}
        </div>
        
        {/* Title */}
        <h3 className={`text-sm sm:text-base font-bold text-gray-900 leading-snug mb-2 sm:mb-2 line-clamp-2 min-h-[40px] sm:min-h-[48px] ${variant === 'horizontal' ? 'lg:text-2xl lg:whitespace-normal lg:mb-4 lg:leading-tight lg:min-h-0' : ''}`}>
          {product.name}
        </h3>
        
        <div className="mt-auto pt-2">
          {/* Price */}
          <div className={`mb-3 sm:mb-4 ${variant === 'horizontal' ? 'lg:mb-8' : ''}`}>
            {product.sale_price ? (
              <div className={`flex flex-wrap items-center justify-center gap-x-2 ${variant === 'horizontal' ? 'lg:justify-start' : ''}`}>
                <span className={`text-sm sm:text-[15px] font-black text-gray-900 ${variant === 'horizontal' ? 'lg:text-xl' : ''}`}>₹{product.sale_price.toFixed(2)}</span>
                <span className={`text-xs font-bold text-gray-400 line-through ${variant === 'horizontal' ? 'lg:text-sm' : ''}`}>₹{product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className={`text-sm sm:text-[15px] font-black text-gray-900 ${variant === 'horizontal' ? 'lg:text-xl' : ''}`}>₹{product.price.toFixed(2)}</span>
            )}
          </div>

          {/* Button */}
          <div className={`w-full bg-[#1C1C1C] text-white text-center py-2.5 sm:py-4 rounded-full text-[10px] sm:text-[11px] lg:text-xs font-black uppercase tracking-widest hover:bg-[#FF7A00] active:scale-95 transition-all duration-300 ${variant === 'horizontal' ? 'lg:w-fit lg:px-10 lg:py-4' : ''}`}>
            Buy Now
          </div>
        </div>
      </div>
    </Link>
  )
}
