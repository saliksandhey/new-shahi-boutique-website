'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'

export function Navbar({ categories }: { categories: any[] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const isHomepage = pathname === '/'

  const cartItems = useCartStore(state => state.items)
  const openCart = useCartStore(state => state.openCart)
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navClasses = cn(
    "fixed top-4 md:top-6 w-full z-[100] transition-all duration-500 ease-in-out px-4 sm:px-6",
    isScrolled ? "top-2 md:top-4" : ""
  )

  const textColor = "text-white hover:text-gray-300"
  const logoColor = "text-white"

  return (
    <header className={navClasses}>
      <div className="mx-auto max-w-[1400px]">
        {/* The Black Floating Pill */}
        <div className="bg-[#111111] rounded-[2rem] px-6 md:px-8 py-4 flex items-center justify-between shadow-2xl">
          
          {/* Logo (Left) */}
          <div className="flex flex-1 justify-start">
            <Link href="/" className={cn("font-heading text-2xl lg:text-3xl font-bold tracking-tight uppercase transition-colors", logoColor)}>
              SHAHI
            </Link>
          </div>

          {/* Desktop Navigation (Center) */}
          <nav className="hidden lg:flex lg:flex-none lg:justify-center lg:space-x-8">
            <Link href="/shop?collection=new" className={cn("text-xs font-bold uppercase tracking-widest transition-colors", textColor)}>
              New Arrival
            </Link>
            <Link href="/shop" className={cn("text-xs font-bold uppercase tracking-widest transition-colors", textColor)}>
              Shop
            </Link>
            


            <Link href="/track-order" className={cn("text-xs font-bold uppercase tracking-widest transition-colors", textColor)}>
              Track
            </Link>
            <Link href="/stores" className={cn("text-xs font-bold uppercase tracking-widest transition-colors", textColor)}>
              Stores
            </Link>
            <Link href="/academy" className={cn("text-xs font-bold uppercase tracking-widest transition-colors", textColor)}>
              Academy
            </Link>
          </nav>

          {/* Icons (Right) */}
          <div className="flex flex-1 items-center justify-end space-x-6">
            <Link href="/search" className={cn("transition-colors", textColor)}>
              <span className="sr-only">Search</span>
              <Search className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            </Link>

            <div className="flow-root">
              <button onClick={openCart} className="group flex items-center relative transition-colors cursor-pointer outline-none">
                <div className="w-10 h-10 rounded-full bg-[#FF7A00] flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                  <ShoppingBag className="h-5 w-5 text-white" strokeWidth={2} aria-hidden="true" />
                </div>
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-black text-[10px] font-bold border-2 border-[#111111]">
                    {cartCount}
                  </span>
                )}
                <span className="sr-only">items in cart, view bag</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden ml-4">
              <button
                type="button"
                className={cn("p-2 rounded-full hover:bg-white/10 transition-colors", textColor)}
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open menu</span>
                <Menu className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setMobileMenuOpen(false)} />
          
          {/* Menu Panel */}
          <div className="relative flex w-full max-w-[85%] sm:max-w-sm flex-col overflow-y-auto bg-[#111111]/95 backdrop-blur-xl border-r border-white/10 pb-12 shadow-[20px_0_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-left duration-500 ease-out">
            
            {/* Header */}
            <div className="flex px-6 pb-6 pt-8 justify-between items-center border-b border-white/10 relative">
              <span className="font-heading text-2xl tracking-tight font-black text-white uppercase relative z-10">
                SHAHI
                <span className="absolute -bottom-2 left-0 w-8 h-1 bg-[#FF7A00]"></span>
              </span>
              <button
                type="button"
                className="-m-2 inline-flex items-center justify-center p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 px-6 py-8 flex flex-col gap-6">
              {[
                { name: 'Home', href: '/' },
                { name: 'Shop', href: '/shop' },
                { name: 'New Arrivals', href: '/shop?collection=new' },
                { name: 'Track Order', href: '/track-order' },
                { name: 'Our Stores', href: '/stores' },
                { name: 'Academy', href: '/academy' },
              ].map((link, index) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className="group flex items-center justify-between text-xl font-heading text-gray-300 uppercase tracking-widest border-b border-white/5 pb-4 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all duration-300" 
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="transform group-hover:translate-x-2 transition-transform duration-300">{link.name}</span>
                  <ChevronDown className="w-5 h-5 -rotate-90 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-[#D4AF37]" />
                </Link>
              ))}
            </div>
            
            {/* Footer Area */}
            <div className="mt-auto px-6 pt-8 border-t border-white/10">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Need Help?</p>
              <a href="mailto:contact.shahiboutique@gmail.com" className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors block mb-2">
                contact.shahiboutique@gmail.com
              </a>
              <a href="tel:+919217890060" className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors block">
                +91 9217890060
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
