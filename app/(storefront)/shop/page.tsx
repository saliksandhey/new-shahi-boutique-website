import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/storefront/ProductGrid'
import { FilterSidebar } from '@/components/storefront/FilterSidebar'
import { SortSelect } from '@/components/storefront/SortSelect'
import { Pagination } from '@/components/storefront/Pagination'

export const dynamic = 'force-dynamic'

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const params = await searchParams;
  const supabase = await createClient()

  const sort = typeof params.sort === 'string' ? params.sort : 'newest'
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1
  const limit = 12
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase.from('products').select('*, product_images(url, is_primary)', { count: 'exact' }).eq('status', 'ACTIVE')

  if (sort === 'price-asc') {
    query = query.order('price', { ascending: true })
  } else if (sort === 'price-desc') {
    query = query.order('price', { ascending: false })
  } else if (sort === 'featured') {
    query = query.eq('is_featured', true).order('created_at', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  if (params.min_price) query = query.gte('price', parseFloat(params.min_price as string))
  if (params.max_price) query = query.lte('price', parseFloat(params.max_price as string))

  query = query.range(from, to)

  const { data: products, count } = await query
  const totalPages = count ? Math.ceil(count / limit) : 0

  return (
    <div className="bg-white min-h-screen pb-32 pt-24">
      
      {/* Header Banner */}
      <div className="bg-[#F8F9FA] py-16 md:py-24 px-6 sm:px-8 lg:px-12 text-center rounded-[3rem] mx-4 sm:mx-6 lg:mx-8 mb-8 md:mb-16 shadow-sm border border-gray-100">
        <span className="text-[10px] md:text-xs font-bold text-[#FF7A00] uppercase tracking-[0.2em] mb-3 md:mb-4 block">
          Shop All
        </span>
        <h1 className="text-4xl md:text-7xl lg:text-8xl font-sans font-black tracking-tighter text-gray-900 uppercase mb-4 md:mb-6 leading-none">
          THE COLLECTION
        </h1>
        <p className="mt-4 md:mt-6 text-gray-500 max-w-2xl mx-auto font-medium text-sm md:text-lg leading-relaxed">
          Discover our full range of masterfully crafted pieces, designed to bring bold streetwear energy to your modern wardrobe.
        </p>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-6 mb-8 md:mb-12 gap-4">
          <p className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-wide">
            Showing {products?.length || 0} {products?.length === 1 ? 'Result' : 'Results'}
          </p>
          <div className="flex items-center w-full sm:w-auto">
            <SortSelect currentSort={sort} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="w-full lg:w-72 flex-shrink-0">
            <FilterSidebar />
          </div>
          <div className="flex-1 min-h-[50vh]">
            <ProductGrid products={products || []} />
            {totalPages > 1 && (
              <div className="mt-20 pt-10 border-t border-gray-200">
                <Pagination currentPage={page} totalPages={totalPages} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
