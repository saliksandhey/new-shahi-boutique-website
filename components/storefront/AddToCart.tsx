'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cart-store'
import { ShoppingBag, Heart } from 'lucide-react'

export function AddToCart({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const addItem = useCartStore(state => state.addItem)
  const openCart = useCartStore(state => state.openCart)

  const outOfStock = product.stock <= 0
  const hasSizes = product.product_size_guides && product.product_size_guides.length > 0

  const handleAddToCart = () => {
    if (outOfStock) return
    if (hasSizes && !selectedSize) {
      alert('Please select a size')
      return
    }
    
    const finalPrice = product.sale_price || product.price

    addItem({
      id: product.id + (selectedSize ? `-${selectedSize}` : ''),
      productId: product.id,
      quantity: quantity,
      name: product.name + (selectedSize ? ` (Size: ${selectedSize})` : ''),
      price: finalPrice,
      image: product.product_images?.find((img: any) => img.is_primary)?.url || product.product_images?.[0]?.url || '/placeholder.png'
    })
    
    // Open cart drawer immediately
    openCart()
  }

  return (
    <div className="space-y-8">
      {hasSizes && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Select Size</h3>
            <button type="button" className="text-xs font-bold text-gray-400 underline uppercase tracking-widest hover:text-[#FF7A00] transition-colors">Size Guide</button>
          </div>
          <div className="flex flex-wrap gap-3">
            {product.product_size_guides.map((g: any) => (
              <button
                key={g.id}
                onClick={() => setSelectedSize(g.size_name)}
                className={`min-w-[3.5rem] px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 ${
                  selectedSize === g.size_name 
                    ? 'border-[#FF7A00] bg-[#FF7A00] text-white shadow-md' 
                    : 'border border-gray-200 bg-white text-gray-900 hover:border-[#FF7A00] hover:text-[#FF7A00]'
                }`}
              >
                {g.size_name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 w-full">
        <div className="flex w-full sm:w-auto gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center justify-between rounded-full border border-gray-200 h-14 flex-1 sm:w-36 bg-gray-50 px-2 shrink-0">
            <button 
              type="button" 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full flex justify-center items-center text-gray-500 hover:text-[#FF7A00] hover:bg-white transition-colors text-xl shadow-sm border border-transparent hover:border-gray-100"
            >
              -
            </button>
            <span className="text-sm font-bold text-gray-900 w-8 text-center">{quantity}</span>
            <button 
              type="button" 
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={outOfStock || quantity >= product.stock}
              className="w-10 h-10 rounded-full flex justify-center items-center text-gray-500 hover:text-[#FF7A00] hover:bg-white disabled:opacity-30 transition-colors text-xl shadow-sm border border-transparent hover:border-gray-100"
            >
              +
            </button>
          </div>

          {/* Wishlist Button */}
          <button className="w-14 h-14 rounded-full flex items-center justify-center border border-gray-200 hover:border-[#FF7A00] hover:text-[#FF7A00] hover:bg-[#FF7A00]/5 transition-colors bg-white text-gray-500 shrink-0 shadow-sm">
            <Heart className="w-5 h-5" strokeWidth={2} />
            <span className="sr-only">Add to Wishlist</span>
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="w-full sm:flex-1 rounded-full bg-[#1C1C1C] text-white h-14 flex items-center justify-center text-xs font-bold uppercase tracking-widest hover:bg-[#FF7A00] transition-colors duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-sm"
        >
          <ShoppingBag className="w-4 h-4 mr-3" />
          {outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>

      {product.stock > 0 && product.stock <= 5 && (
        <p className="text-xs text-red-500 font-bold tracking-widest uppercase flex items-center justify-center sm:justify-start gap-2 pt-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          Only {product.stock} pieces remaining
        </p>
      )}
    </div>
  )
}
