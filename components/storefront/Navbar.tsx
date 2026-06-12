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
    "fixed top-4 md:top-6 w-full z-50 transition-all duration-500 ease-in-out px-4 sm:px-6",
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
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex w-full max-w-sm flex-col overflow-y-auto bg-white pb-12 shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex px-6 pb-4 pt-6 justify-between items-center border-b-2 border-black">
              <span className="font-heading text-2xl tracking-tight font-bold text-black uppercase">SHAHI</span>
              <button
                type="button"
                className="-m-2 inline-flex items-center justify-center p-2 text-black hover:text-[#FF7A00]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-6 px-6 py-8">
              <Link href="/" className="block text-xl font-heading text-black uppercase tracking-wider border-b-2 border-black/10 pb-4 hover:text-[#FF7A00] transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/shop" className="block text-xl font-heading text-black uppercase tracking-wider border-b-2 border-black/10 pb-4 hover:text-[#FF7A00] transition-colors" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
              <Link href="/shop?collection=new" className="block text-xl font-heading text-black uppercase tracking-wider border-b-2 border-black/10 pb-4 hover:text-[#FF7A00] transition-colors" onClick={() => setMobileMenuOpen(false)}>New Arrivals</Link>
              <Link href="/track-order" className="block text-xl font-heading text-black uppercase tracking-wider border-b-2 border-black/10 pb-4 hover:text-[#FF7A00] transition-colors" onClick={() => setMobileMenuOpen(false)}>Track Order</Link>
              <Link href="/stores" className="block text-xl font-heading text-black uppercase tracking-wider border-b-2 border-black/10 pb-4 hover:text-[#FF7A00] transition-colors" onClick={() => setMobileMenuOpen(false)}>Our Stores</Link>
              <Link href="/academy" className="block text-xl font-heading text-black uppercase tracking-wider border-b-2 border-black/10 pb-4 hover:text-[#FF7A00] transition-colors" onClick={() => setMobileMenuOpen(false)}>Academy</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
