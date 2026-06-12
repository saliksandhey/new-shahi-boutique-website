'use client'

import { useState, useEffect } from 'react'
import { fetchTrackingInfo } from '@/lib/actions/tracking'
import { Search, Package, Truck, CheckCircle } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'

export function TrackOrderClient() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<any | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  const initialOrderNumber = searchParams.get('order_number') || ''
  const initialEmail = searchParams.get('email') || ''

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber)
  const [email, setEmail] = useState(initialEmail)

  useEffect(() => {
    if (initialOrderNumber && initialEmail) {
      const autoFetch = async () => {
        setLoading(true)
        setError(null)
        const result = await fetchTrackingInfo(initialOrderNumber, initialEmail)
        if (result.success) {
          setOrder(result.order)
        } else {
          setError(result.error || 'Failed to fetch tracking information.')
        }
        setLoading(false)
      }
      autoFetch()
    }
  }, [initialOrderNumber, initialEmail])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOrder(null)

    // Update URL without refreshing the page to show sharable link
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('order_number', orderNumber)
    newParams.set('email', email)
    router.replace(`?${newParams.toString()}`, { scroll: false })

    const result = await fetchTrackingInfo(orderNumber, email)

    if (result.success) {
      setOrder(result.order)
    } else {
      setError(result.error || 'Failed to fetch tracking information.')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-8">
      {!order ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 space-y-8 shadow-sm">
          {error && (
            <div className="bg-red-50 rounded-xl text-red-700 p-4 text-sm font-medium border border-red-200">
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-900 ml-2">Order Number</label>
            <input 
              type="text" 
              name="order_number" 
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required 
              placeholder="e.g. SHAHI-2026-123456" 
              className="w-full bg-gray-50 border border-gray-200 text-sm font-medium focus:border-[#FF7A00] focus:ring-0 px-6 py-4 rounded-xl outline-none transition-colors"
            />
          </div>
          
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-900 ml-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="The email used during checkout" 
              className="w-full bg-gray-50 border border-gray-200 text-sm font-medium focus:border-[#FF7A00] focus:ring-0 px-6 py-4 rounded-xl outline-none transition-colors"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1C1C1C] text-white rounded-full px-8 py-5 text-xs font-bold uppercase tracking-widest hover:bg-[#FF7A00] transition-colors disabled:bg-gray-300 flex justify-center items-center mt-4"
          >
            {loading ? 'Searching...' : <><Search className="w-4 h-4 mr-2" /> Track Order</>}
          </button>
        </form>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-end items-center">
            <button 
              onClick={() => {
                setOrder(null)
                router.replace('/track-order', { scroll: false })
                setOrderNumber('')
                setEmail('')
              }}
              className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#FF7A00] transition-colors"
            >
              Track Another Order
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-sm">
            <div className="border-b border-gray-100 pb-8 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-sans font-black text-gray-900 uppercase tracking-tighter">Order {order.order_number}</h2>
                <p className="text-sm font-medium text-gray-500 mt-2">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block rounded-full text-xs px-4 py-2 uppercase tracking-widest font-bold ${
                  order.order_status === 'CANCELLED' 
                    ? 'bg-red-50 text-red-600'
                    : 'bg-[#FF7A00]/10 text-[#FF7A00]'
                }`}>
                  {order.order_status}
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            {order.order_status !== 'CANCELLED' && (
              <div className="py-8 px-4 sm:px-8 mb-8">
                 <div className="relative flex justify-between">
                    <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>
                    
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.order_status) ? 'bg-[#FF7A00] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                        <Package className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] sm:text-xs uppercase tracking-widest mt-4 font-bold text-gray-900">Confirmed</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.order_status) ? 'bg-[#FF7A00] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                        <Package className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] sm:text-xs uppercase tracking-widest mt-4 font-bold text-gray-900">Processing</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${['SHIPPED', 'DELIVERED'].includes(order.order_status) ? 'bg-[#FF7A00] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                        <Truck className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] sm:text-xs uppercase tracking-widest mt-4 font-bold text-gray-900">Shipped</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${order.order_status === 'DELIVERED' ? 'bg-[#FF7A00] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] sm:text-xs uppercase tracking-widest mt-4 font-bold text-gray-900">Delivered</span>
                    </div>
                 </div>
              </div>
            )}

            {/* Courier & Tracking Details */}
            {(order.tracking_number || order.courier_name) && (
              <div className="mt-6 bg-[#F8F9FA] rounded-2xl p-8 border border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6">Shipping Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">Courier</span>
                    <span className="block font-medium text-gray-900 text-lg">{order.courier_name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">Tracking Number</span>
                    <span className="block font-medium text-gray-900 text-lg">{order.tracking_number || 'N/A'}</span>
                  </div>
                </div>
                {order.tracking_url && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#1C1C1C] text-white rounded-full px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#FF7A00] transition-colors">
                      Track on {order.courier_name || 'Courier Website'}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Live Order Timeline */}
            <div className="mt-8 border-t border-gray-100 pt-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6">Status Updates</h3>
              <div className="space-y-6">
                {order.order_timeline && order.order_timeline.length > 0 ? (
                  order.order_timeline
                    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((event: any, idx: number) => (
                      <div key={event.id} className="relative flex gap-4">
                        {idx !== order.order_timeline.length - 1 && (
                          <div className="absolute left-4 top-8 bottom-[-24px] w-px bg-gray-200"></div>
                        )}
                        <div className="relative z-10 w-8 h-8 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-gray-500 shrink-0 shadow-sm">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FF7A00]"></div>
                        </div>
                        <div className="pt-1">
                          <p className="font-bold text-gray-900 text-sm uppercase tracking-wider">{event.event_type}</p>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          <p className="text-xs font-medium text-gray-400 mt-2">{new Date(event.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No updates have been posted yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
