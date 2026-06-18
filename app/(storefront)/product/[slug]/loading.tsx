import { Skeleton } from '@/components/ui/skeleton'

export default function ProductLoading() {
  return (
    <div className="bg-white pt-16 md:pt-24 pb-16 md:pb-32 animate-pulse">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
        
        {/* Breadcrumb Skeleton */}
        <div className="mb-8 md:mb-12">
          <Skeleton className="h-4 w-64 bg-gray-100 rounded" />
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-16 xl:gap-x-24">
          {/* Image Gallery Skeleton */}
          <div className="flex flex-col-reverse lg:sticky lg:top-32 gap-4">
            <div className="grid grid-cols-4 gap-4 mt-4 lg:mt-0 lg:flex lg:flex-col lg:w-24 shrink-0">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-[3/4] w-full bg-gray-200 rounded-xl" />
              ))}
            </div>
            <Skeleton className="aspect-[3/4] w-full bg-gray-200 rounded-2xl flex-1" />
          </div>

          {/* Product info Skeleton */}
          <div className="mt-8 md:mt-12 lg:mt-0 space-y-6">
            <Skeleton className="h-12 w-3/4 bg-gray-200 rounded-lg" />
            <Skeleton className="h-8 w-32 bg-gray-200 rounded-lg" />
            
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full bg-gray-100 rounded" />
              <Skeleton className="h-4 w-full bg-gray-100 rounded" />
              <Skeleton className="h-4 w-2/3 bg-gray-100 rounded" />
            </div>

            <div className="py-8">
              <Skeleton className="h-16 w-full bg-gray-200 rounded-full" />
            </div>

            <Skeleton className="h-64 w-full bg-gray-100 rounded-[2rem]" />
          </div>
        </div>
      </div>
    </div>
  )
}
