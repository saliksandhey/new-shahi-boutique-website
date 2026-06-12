'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart-store'
import { X, Trash2, ShoppingBag } from 'lucide-react'

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal } = useCartStore()

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
          <h2 className="text-2xl font-black font-sans tracking-tighter uppercase text-gray-900">Your Cart</h2>
          <button 
            onClick={closeCart}
            className="p-2 -mr-2 text-gray-400 hover:text-[#FF7A00] transition-colors rounded-full hover:bg-gray-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-sm text-gray-500 font-medium">Looks like you haven't added anything yet.</p>
              </div>
              <button 
                onClick={closeCart}
                className="px-8 py-4 bg-[#1C1C1C] text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#FF7A00] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-24 h-32 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900 text-sm leading-tight pr-4">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm font-black text-[#FF7A00] mt-1">
                        ₹{(item.salePrice || item.price).toFixed(2)}
                      </p>
                    </div>
                    
                    {/* Quantity Control */}
                    <div className="flex items-center justify-between rounded-full border border-gray-200 h-10 w-28 bg-gray-50 px-1">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 rounded-full flex justify-center items-center text-gray-500 hover:text-[#FF7A00] hover:bg-white transition-colors"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full flex justify-center items-center text-gray-500 hover:text-[#FF7A00] hover:bg-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-white space-y-6">
            <div className="flex justify-between items-center text-gray-900">
              <span className="font-bold uppercase tracking-widest text-xs">Subtotal</span>
              <span className="font-black text-2xl">₹{getSubtotal().toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 font-medium">Shipping and taxes calculated at checkout.</p>
            <Link 
              href="/checkout"
              onClick={closeCart}
              className="flex w-full items-center justify-center rounded-full bg-[#1C1C1C] text-white h-14 font-bold uppercase tracking-widest text-xs hover:bg-[#FF7A00] transition-colors shadow-lg"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
