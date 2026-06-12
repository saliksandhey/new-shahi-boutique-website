import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Us | SHAHI',
  description: 'Learn more about our premium streetwear brand, our story, and our commitment to modern culture.',
}

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen pb-32">
      
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden flex items-center justify-center rounded-b-[3rem] shadow-2xl mx-4 sm:mx-6 lg:mx-8 mb-16">
        <div className="absolute inset-0 bg-[#1C1C1C]">
          <Image 
            src="/hero-luxury.png" // Reusing the high-res luxury image
            alt="Our Story" 
            fill 
            className="object-cover opacity-40 mix-blend-overlay"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-6">
          <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-[0.3em] mb-6 block">
            The Vision
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-black tracking-tighter text-white uppercase mb-6 leading-none">
            OUR STORY
          </h1>
        </div>
      </div>

      {/* Story Section */}
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-16">
        
        <div className="bg-[#F8F9FA] rounded-[3rem] p-12 sm:p-20 text-center mb-20 border border-gray-100 shadow-sm">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-sans font-black text-gray-900 uppercase tracking-tighter leading-tight">
            "We don't just create clothes.<br className="hidden md:block"/> <span className="text-[#FF7A00]">We design culture.</span>"
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="space-y-8 text-lg text-gray-500 font-medium leading-relaxed">
            <p>
              Founded with a passion for bold aesthetics and uncompromising quality, SHAHI represents the pinnacle of modern streetwear. We believe that fashion should be effortless, enduring, and empowering.
            </p>
            <p>
              Every piece in our collection is thoughtfully curated to bring you the finest materials, impeccable tailoring, and sophisticated silhouettes. From our design studio to your wardrobe, we are dedicated to providing an unparalleled shopping experience.
            </p>
            <div className="pt-8 border-t border-gray-200">
              <p className="text-gray-900 font-black tracking-widest uppercase text-sm">
                Welcome to the new era of style.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100">
            <Image 
              src="/hero-luxury.png" 
              alt="Craftsmanship" 
              fill 
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>

    </div>
  )
}
