import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex flex-col w-full min-h-screen animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative h-[80vh] w-full bg-gray-200">
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
          <Skeleton className="h-16 w-3/4 max-w-2xl bg-black/10 rounded-lg" />
          <Skeleton className="h-6 w-1/2 max-w-md bg-black/10 rounded-lg" />
          <Skeleton className="h-12 w-40 bg-black/10 rounded-full mt-8" />
        </div>
      </div>

      {/* New Arrivals Skeleton */}
      <section className="py-10 md:py-16 bg-white">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="mb-10">
            <Skeleton className="h-10 w-64 bg-gray-200 rounded-lg mb-3" />
            <Skeleton className="h-4 w-48 bg-gray-100 rounded-lg" />
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                <Skeleton className="aspect-[4/5] w-full lg:w-[45%] bg-gray-200 rounded-[1.5rem]" />
                <div className="flex-1 space-y-3 py-4">
                  <Skeleton className="h-4 w-1/3 bg-gray-200 rounded-lg" />
                  <Skeleton className="h-6 w-3/4 bg-gray-200 rounded-lg" />
                  <Skeleton className="h-4 w-1/4 bg-gray-200 rounded-lg" />
                  <Skeleton className="h-12 w-full lg:w-32 bg-gray-200 rounded-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
