import { createPublicClient } from '@/lib/supabase/server'
import { HeroLuxury } from '@/components/storefront/HeroLuxury'
import { FeaturedCollection } from '@/components/storefront/FeaturedCollection'
import { ProductCard } from '@/components/storefront/ProductCard'
import { WhyChooseUs } from '@/components/storefront/WhyChooseUs'
import { WorldwideDelivery } from '@/components/storefront/WorldwideDelivery'
import { CustomerReviews } from '@/components/storefront/CustomerReviews'
import { PotliShowcase } from '@/components/storefront/PotliShowcase'
import { Newsletter } from '@/components/storefront/Newsletter'
import { SplashScreen } from '@/components/storefront/SplashScreen'

export const revalidate = 60

export default async function HomePage() {
  const supabase = createPublicClient()

  // Fetch 10 products (2 for New Arrivals, 8 for Featured)
  const { data: recentProducts } = await supabase.from('products')
    .select('*, product_images(url, is_primary), categories(name)')
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false })
    .limit(10)

  const newArrivals = recentProducts?.slice(0, 2) || []
  const featuredProducts = recentProducts?.slice(2, 10) || []

  return (
    <div className="flex flex-col w-full">
      <SplashScreen />
      
      {/* Section 3: Hero Section */}
      <HeroLuxury />

      {/* Section 4: New Arrivals (4 products, grid on mobile) */}
      <section className="py-10 md:py-16 bg-white">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="text-center md:text-left mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-sans font-black text-gray-900 mb-3 tracking-tighter uppercase">
              New <span className="text-[#FF7A00]">Arrivals</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-lg font-medium">
              Discover our latest handcrafted additions.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8 max-w-[1400px] mx-auto">
            {newArrivals.slice(0, 2).map((product) => (
              <div key={product.id}>
                <ProductCard product={product} variant="horizontal" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Featured Products (Horizontal Scroll) */}
      <FeaturedCollection products={featuredProducts} />

      {/* Section 5: Why Choose Us */}
      <WhyChooseUs />

      {/* Section 6: Worldwide Delivery */}
      <WorldwideDelivery />

      {/* Section 7: Customer Reviews */}
      <CustomerReviews />

      {/* Section 8: Potli Showcase */}
      <PotliShowcase />

      {/* Section 9: Newsletter */}
      <Newsletter />
      
      {/* Section 10: Footer is in layout.tsx */}
    </div>
  )
}
