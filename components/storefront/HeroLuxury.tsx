'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export function HeroLuxury() {
  return (
    <div className="relative w-full min-h-screen bg-[#F8F9FA] overflow-hidden pt-24 pb-0 flex flex-col justify-end">
      
      {/* Background Grid Pattern on the right */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none z-0 animate-[pulse_4s_ease-in-out_infinite]">
         <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)`,
            backgroundSize: `80px 80px`
         }} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 sm:px-8 lg:px-12 flex-1 flex flex-col lg:flex-row items-center">
        
        {/* Left Content: Text & Buttons */}
        <div className="w-full lg:w-[55%] pt-10 md:pt-16 pb-8 md:pb-20 lg:py-0 lg:pr-12 flex flex-col items-center lg:items-start text-center lg:text-left relative z-20">
          <h1 className="font-sans text-[3.5rem] sm:text-[4.5rem] lg:text-[5.5rem] font-black leading-[0.95] lg:leading-[1.1] text-gray-900 tracking-tighter mb-4 md:mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            TIMELESS<br />ELEGANCE
          </h1>
          <p className="text-gray-600 text-[15px] sm:text-lg max-w-[500px] mb-8 md:mb-10 leading-relaxed font-medium px-4 lg:px-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
            Discover handcrafted luxury and bespoke designs. From exquisite potli purses to curated bridal collections, experience the finest artistry at Shahi Boutique.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full sm:w-auto px-4 lg:px-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
            <Link 
              href="/shop?collection=new"
              className="w-full sm:w-auto px-8 py-4 md:py-5 bg-[#1C1C1C] text-white text-[11px] md:text-xs font-black uppercase tracking-widest rounded-full hover:bg-[#FF7A00] transition-colors duration-300 text-center shadow-xl"
            >
              Shop New Arrivals
            </Link>
            <Link 
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 md:py-5 bg-white border border-gray-200 text-gray-900 text-[11px] md:text-xs font-black uppercase tracking-widest rounded-full hover:bg-[#FF7A00] hover:text-white hover:border-[#FF7A00] transition-colors duration-300 text-center shadow-sm"
            >
              Explore Collections
            </Link>
          </div>
        </div>

        {/* Right Content: Model Image */}
        <div className="w-full lg:w-[45%] h-full relative flex items-end justify-center lg:justify-end mt-8 lg:mt-0 animate-in fade-in zoom-in-[0.98] duration-1000 delay-500 fill-mode-both">
            {/* Decorative background accent behind the image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] border-2 border-[#FF7A00]/20 rounded-[2rem] rotate-[-6deg] hidden lg:block transition-transform duration-1000 ease-out group-hover:rotate-0"></div>
            
            {/* Image Container with elegant styling (arch shape + float) */}
            <div className="relative w-full max-w-[420px] lg:max-w-[480px] h-[45vh] sm:h-[55vh] lg:h-[75vh] group overflow-hidden rounded-t-[20rem] rounded-b-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border-[6px] lg:border-[10px] border-white/90 z-10 animate-[float_6s_ease-in-out_infinite]">
              
              {/* Subtle inner gradient overlay for luxury depth */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10 z-10 pointer-events-none transition-opacity duration-1000 group-hover:opacity-75 mix-blend-overlay"></div>
              
              <Image 
                src="/Hero_sec.jpeg" 
                alt="Shahi Boutique" 
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center transition-transform duration-[2000ms] ease-out group-hover:scale-[1.08]"
              />

              {/* Luxury Badge overlay */}
              <div className="absolute bottom-6 right-1/2 translate-x-1/2 lg:translate-x-0 lg:right-6 lg:bottom-8 z-20 bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border border-white/50 transform transition-transform duration-700 group-hover:-translate-y-2">
                <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.25em] text-[#1C1C1C] whitespace-nowrap">Exquisite Collection</p>
              </div>
            </div>
        </div>
      </div>

      {/* Bottom Marquee Banner */}
      <div className="relative w-full bg-[#5E1218] border-y border-[#4A0D11] overflow-hidden py-3 z-20">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite]">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center mx-6">
              <span className="text-white text-sm font-medium tracking-wider">
                ✦ Shop the Exclusive Bridal Collection ✦ Handcrafted Potli Purses ✦ Free Worldwide Shipping on Premium Orders 
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* CSS for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}} />
    </div>
  )
}
