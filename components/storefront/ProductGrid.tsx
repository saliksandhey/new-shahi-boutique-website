import { ProductCard } from './ProductCard'
import { SearchX } from 'lucide-react'
import Link from 'next/link'

export function ProductGrid({ products }: { products: any[] }) {
  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-[2rem] border border-gray-100 shadow-sm min-h-[50vh]">
        <SearchX className="w-16 h-16 text-stone-300 mb-6" />
        <h2 className="text-3xl font-serif tracking-widest text-gray-900 mb-4 uppercase text-center">Nothing Found</h2>
        <p className="text-gray-500 font-light mb-8 text-center max-w-md">
          We couldn't find what you were looking for. The products might be out of stock, removed, or don't match your current filters.
        </p>
        <div className="flex space-x-4">
          <Link href="/shop" className="bg-[#222222] text-white px-8 py-3.5 text-sm uppercase tracking-widest font-medium transition-colors hover:bg-black rounded-full">
            View All Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 xl:gap-x-8">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
