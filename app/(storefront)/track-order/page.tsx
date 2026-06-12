import { TrackOrderClient } from './TrackOrderClient'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Enter your order number and email to track your shipment.',
}

export default function TrackOrderPage() {
  return (
    <div className="bg-white min-h-[70vh] py-24">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <div className="bg-[#F8F9FA] p-12 rounded-[3rem] text-center mb-12 shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-[0.2em] mb-4 block">
            Shipping
          </span>
          <h1 className="text-4xl md:text-6xl font-sans font-black tracking-tighter text-gray-900 uppercase mb-4 leading-none">
            Track Order
          </h1>
          <p className="text-gray-500 font-medium">Enter your order details below to see the current status of your shipment.</p>
        </div>
        
        <Suspense fallback={<div className="text-center py-12 text-gray-500">Loading tracking portal...</div>}>
          <TrackOrderClient />
        </Suspense>
      </div>
    </div>
  )
}
