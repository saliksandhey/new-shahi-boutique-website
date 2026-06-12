import { CartClient } from '@/components/storefront/CartClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Shopping Cart | SHAHI',
  description: 'Review your items and proceed to checkout.',
}

export default function CartPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header Banner */}
      <div className="bg-muted py-24 px-4 text-center border-b border-border">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-widest text-foreground uppercase mb-6">Shopping Cart</h1>
        <div className="w-16 h-[2px] bg-accent mx-auto"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <CartClient />
      </div>
    </div>
  )
}
