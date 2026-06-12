'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart-store'
import { useRouter } from 'next/navigation'
import { calculateOrderTotal, createRazorpayOrderAction, verifyAndCreateOrder, createCODOrderAction } from '@/lib/actions/checkout'
import Script from 'next/script'

export function CheckoutClient({ codEnabled, razorpayKeyId }: { codEnabled: boolean, razorpayKeyId: string }) {
  const { items, clearCart } = useCartStore()
  const router = useRouter()
  
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Order State
  const [address, setAddress] = useState({
    firstName: '', lastName: '', email: '', phone: '', street: '', city: '', state: '', zip: '', country: 'US'
  })
  const [shippingMethod, setShippingMethod] = useState('standard') // standard | express
  const [paymentMethod, setPaymentMethod] = useState('razorpay') // razorpay | cod
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null)

  // Live Totals (fetched from server)
  const [totals, setTotals] = useState({ subtotal: 0, shipping: 0, discount: 0, total: 0 })

  useEffect(() => {
    setMounted(true)
    if (items.length > 0) {
      updateTotals()
    } else {
      router.push('/')
    }
  }, [items])

  const updateTotals = async (currentShipping = shippingMethod, currentCoupon = appliedCoupon?.code) => {
    try {
      const inputItems = items.map(i => ({ productId: i.productId, quantity: i.quantity }))
      const result = await calculateOrderTotal(inputItems, currentShipping, currentCoupon)
      setTotals({
        subtotal: result.subtotal,
        shipping: result.shipping,
        discount: result.discount,
        total: result.total
      })
    } catch (e: any) {
      setError(e.message || 'Error calculating totals')
    }
  }

  // Effect to recalculate when shipping changes
  useEffect(() => {
    if (mounted && items.length > 0) {
      updateTotals(shippingMethod)
    }
  }, [shippingMethod])

  if (!mounted || items.length === 0) return null

  const handleApplyCoupon = async () => {
    setError(null)
    try {
      const inputItems = items.map(i => ({ productId: i.productId, quantity: i.quantity }))
      const result = await calculateOrderTotal(inputItems, shippingMethod, couponCode)
      if (result.discount > 0) {
        setAppliedCoupon({ code: couponCode, discount: result.discount })
        setTotals({ subtotal: result.subtotal, shipping: result.shipping, discount: result.discount, total: result.total })
      } else {
        setError('Invalid or expired coupon')
        setAppliedCoupon(null)
      }
    } catch (e: any) {
      setError(e.message || 'Error applying coupon')
    }
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    setError(null)
    const inputItems = items.map(i => ({ productId: i.productId, quantity: i.quantity }))

    try {
      if (paymentMethod === 'cod') {
        const res = await createCODOrderAction(address, inputItems, shippingMethod, appliedCoupon?.code)
        if (res.success && 'orderId' in res) {
          await clearCart()
          router.push(`/checkout/success?order_id=${res.orderId}`)
        } else {
          setError('error' in res ? res.error : 'Failed to process COD order')
          setLoading(false)
        }
      } else {
        // Razorpay Flow
        if (!razorpayKeyId) {
          throw new Error('Razorpay is not configured. Please contact support.')
        }

        const orderRes = await createRazorpayOrderAction(inputItems, shippingMethod, appliedCoupon?.code)
        if (!orderRes.success) {
          throw new Error(orderRes.error || 'Failed to initialize payment')
        }

        const options = {
          key: razorpayKeyId,
          amount: orderRes.amount,
          currency: orderRes.currency,
          name: "SHAHI Boutique",
          description: "Order Payment",
          order_id: orderRes.orderId,
          handler: async function (response: any) {
            setLoading(true)
            const verifyRes = await verifyAndCreateOrder(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature,
              address,
              inputItems,
              shippingMethod,
              appliedCoupon?.code
            )
            
            if (verifyRes.success && 'orderId' in verifyRes) {
              await clearCart()
              router.push(`/checkout/success?order_id=${verifyRes.orderId}`)
            } else {
              setError('error' in verifyRes ? verifyRes.error : 'Payment verification failed. Please contact support.')
              setLoading(false)
            }
          },
          prefill: {
            name: `${address.firstName} ${address.lastName}`,
            email: address.email,
            contact: address.phone
          },
          theme: {
            color: "#FF7A00"
          }
        }

        const rzp = new (window as any).Razorpay(options)
        rzp.on('payment.failed', function (response: any) {
          setError(response.error.description || 'Payment failed')
          setLoading(false)
        })
        
        rzp.open()
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout')
      setLoading(false)
    }
  }

  const inputClasses = "w-full bg-white border border-gray-200 focus:border-[#FF7A00] focus:ring-0 rounded-full py-4 px-6 text-sm font-bold text-gray-900 shadow-sm outline-none transition-colors placeholder:text-gray-400 placeholder:font-medium"

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
        
        {/* Main Checkout Flow */}
        <div className="lg:col-span-7">
          <div className="bg-[#F8F9FA] rounded-[1.5rem] md:rounded-[2rem] p-5 sm:p-12 border border-gray-100 space-y-8 md:space-y-12">
            
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl text-xs tracking-widest uppercase font-bold text-center">
                {error}
              </div>
            )}

            {/* STEP 1: Address */}
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-8 flex items-center">
                <span className={`w-8 h-8 flex items-center justify-center rounded-full text-xs mr-4 transition-colors shadow-sm ${step === 1 ? 'bg-[#1C1C1C] text-white' : 'bg-gray-200 text-gray-500'}`}>1</span>
                Shipping Address
              </h2>
              {step === 1 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" value={address.firstName} onChange={e => setAddress({...address, firstName: e.target.value})} className={inputClasses} />
                  <input type="text" placeholder="Last Name" value={address.lastName} onChange={e => setAddress({...address, lastName: e.target.value})} className={inputClasses} />
                  <input type="email" placeholder="Email Address" value={address.email} onChange={e => setAddress({...address, email: e.target.value})} className={`${inputClasses} sm:col-span-2`} />
                  <input type="text" placeholder="Street Address" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className={`${inputClasses} sm:col-span-2`} />
                  <input type="text" placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className={inputClasses} />
                  <input type="text" placeholder="State/Province" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className={inputClasses} />
                  <input type="text" placeholder="Zip / Postal Code" value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} className={inputClasses} />
                  <input type="text" placeholder="Phone Number" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className={inputClasses} />
                  
                  <div className="sm:col-span-2 mt-4">
                    <button 
                      onClick={() => setStep(2)}
                      disabled={!address.firstName || !address.lastName || !address.email || !address.street || !address.city || !address.state || !address.zip || !address.phone}
                      className="w-full rounded-full bg-[#1C1C1C] text-white py-5 text-xs font-bold uppercase tracking-widest hover:bg-[#FF7A00] transition-colors duration-300 disabled:bg-gray-200 disabled:text-gray-400 shadow-md"
                    >
                      Continue to Delivery
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 pl-12">
                  <p className="font-bold text-gray-900">{address.firstName} {address.lastName}</p>
                  <p className="font-medium mt-1">{address.street}, {address.city}, {address.state} {address.zip}</p>
                  <button onClick={() => setStep(1)} className="text-[10px] font-bold uppercase tracking-widest text-[#FF7A00] hover:text-[#1C1C1C] transition-colors mt-4">Edit Address</button>
                </div>
              )}
            </div>

            {/* STEP 2: Delivery */}
            <div className={`border-t border-gray-200 pt-8 md:pt-12 ${step < 2 ? 'opacity-40 pointer-events-none grayscale' : 'transition-opacity duration-500'}`}>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-8 flex items-center">
                <span className={`w-8 h-8 flex items-center justify-center rounded-full text-xs mr-4 transition-colors shadow-sm ${step === 2 ? 'bg-[#1C1C1C] text-white' : 'bg-gray-200 text-gray-500'}`}>2</span>
                Delivery Method
              </h2>
              {step === 2 ? (
                <div className="space-y-4 pl-0 md:pl-12">
                  <label className={`flex items-center justify-between p-4 md:p-6 rounded-2xl cursor-pointer transition-all duration-300 ${shippingMethod === 'standard' ? 'border-2 border-[#FF7A00] bg-white ring-4 ring-[#FF7A00]/10' : 'border border-gray-200 bg-white hover:border-gray-300'}`}>
                    <div className="flex items-center">
                      <input type="radio" name="shipping" value="standard" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} className="h-5 w-5 text-[#FF7A00] focus:ring-[#FF7A00] border-gray-300 bg-transparent" />
                      <div className="ml-4">
                        <span className="block text-sm font-bold text-gray-900 uppercase tracking-widest">Standard Shipping</span>
                        <span className="block text-xs text-gray-500 font-medium mt-1">3-5 business days</span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-gray-900 tracking-wide">{totals.subtotal > 150 ? 'FREE' : '₹10.00'}</span>
                  </label>
                  
                  <label className={`flex items-center justify-between p-4 md:p-6 rounded-2xl cursor-pointer transition-all duration-300 ${shippingMethod === 'express' ? 'border-2 border-[#FF7A00] bg-white ring-4 ring-[#FF7A00]/10' : 'border border-gray-200 bg-white hover:border-gray-300'}`}>
                    <div className="flex items-center">
                      <input type="radio" name="shipping" value="express" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="h-5 w-5 text-[#FF7A00] focus:ring-[#FF7A00] border-gray-300 bg-transparent" />
                      <div className="ml-4">
                        <span className="block text-sm font-bold text-gray-900 uppercase tracking-widest">Express Shipping</span>
                        <span className="block text-xs text-gray-500 font-medium mt-1">1-2 business days</span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-gray-900 tracking-wide">₹25.00</span>
                  </label>
                  
                  <div className="mt-6">
                    <button 
                      onClick={() => setStep(3)}
                      className="w-full rounded-full bg-[#1C1C1C] text-white py-5 text-xs font-bold uppercase tracking-widest hover:bg-[#FF7A00] transition-colors duration-300 shadow-md"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              ) : step > 2 ? (
                <div className="text-sm text-gray-500 pl-12 flex justify-between items-center">
                  <p className="font-bold text-gray-900">{shippingMethod === 'standard' ? 'Standard Shipping (3-5 days)' : 'Express Shipping (1-2 days)'}</p>
                  <button onClick={() => setStep(2)} className="text-[10px] font-bold uppercase tracking-widest text-[#FF7A00] hover:text-[#1C1C1C] transition-colors">Edit</button>
                </div>
              ) : null}
            </div>

            {/* STEP 3: Payment */}
            <div className={`border-t border-gray-200 pt-8 md:pt-12 ${step < 3 ? 'opacity-40 pointer-events-none grayscale' : 'transition-opacity duration-500'}`}>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-8 flex items-center">
                <span className={`w-8 h-8 flex items-center justify-center rounded-full text-xs mr-4 transition-colors shadow-sm ${step === 3 ? 'bg-[#1C1C1C] text-white' : 'bg-gray-200 text-gray-500'}`}>3</span>
                Payment
              </h2>
              {step === 3 && (
                <div className="space-y-8 md:space-y-10 pl-0 md:pl-12">
                  
                  {/* Coupon section */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="text" 
                      placeholder="Gift card or discount code" 
                      value={couponCode} 
                      onChange={e => setCouponCode(e.target.value)} 
                      disabled={!!appliedCoupon}
                      className="flex-1 bg-white border border-gray-200 focus:border-[#FF7A00] focus:ring-0 rounded-full py-4 px-6 text-sm font-bold text-gray-900 shadow-sm outline-none transition-colors placeholder:text-gray-400 placeholder:font-medium disabled:opacity-50 uppercase placeholder:normal-case" 
                    />
                    <button 
                      type="button" 
                      onClick={appliedCoupon ? () => { setAppliedCoupon(null); setCouponCode(''); updateTotals(shippingMethod, undefined) } : handleApplyCoupon}
                      className="bg-[#1C1C1C] text-white rounded-full px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#FF7A00] transition-colors duration-300 shadow-sm whitespace-nowrap"
                    >
                      {appliedCoupon ? 'Remove' : 'Apply'}
                    </button>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-4">
                    <label className={`flex items-center p-4 md:p-6 rounded-2xl cursor-pointer transition-all duration-300 ${paymentMethod === 'razorpay' ? 'border-2 border-[#FF7A00] bg-white ring-4 ring-[#FF7A00]/10' : 'border border-gray-200 bg-white hover:border-gray-300'}`}>
                      <input type="radio" name="payment" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="h-5 w-5 text-[#FF7A00] focus:ring-[#FF7A00] border-gray-300 bg-transparent shrink-0" />
                      <div className="ml-3 md:ml-4">
                        <span className="block text-xs md:text-sm font-bold text-gray-900 uppercase tracking-widest leading-tight">Pay Online (Razorpay)</span>
                        <span className="block text-[10px] sm:text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">Credit Card, UPI, NetBanking</span>
                      </div>
                    </label>

                    {codEnabled && (
                      <label className={`flex items-center p-4 md:p-6 rounded-2xl cursor-pointer transition-all duration-300 ${paymentMethod === 'cod' ? 'border-2 border-[#FF7A00] bg-white ring-4 ring-[#FF7A00]/10' : 'border border-gray-200 bg-white hover:border-gray-300'}`}>
                        <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="h-5 w-5 text-[#FF7A00] focus:ring-[#FF7A00] border-gray-300 bg-transparent shrink-0" />
                        <div className="ml-3 md:ml-4">
                          <span className="block text-xs md:text-sm font-bold text-gray-900 uppercase tracking-widest leading-tight">Cash on Delivery</span>
                          <span className="block text-[10px] sm:text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">Pay when you receive the order</span>
                        </div>
                      </label>
                    )}
                  </div>

                  <div className="mt-8">
                    <button 
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="w-full rounded-full bg-[#FF7A00] text-white py-6 text-sm font-black uppercase tracking-widest hover:bg-[#1C1C1C] transition-colors duration-300 disabled:bg-gray-200 disabled:text-gray-400 shadow-xl"
                    >
                      {loading ? 'Processing...' : `Pay ₹${totals.total.toFixed(2)}`}
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5 mt-8 md:mt-12 lg:mt-0">
          <div className="bg-[#F8F9FA] border border-gray-100 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 sm:p-10 sticky top-32">
            <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-8 border-b border-gray-200 pb-6">
              Order Summary
            </h2>
            
            <ul role="list" className="divide-y divide-gray-200 mb-8">
              {items.map((item) => (
                <li key={item.id} className="flex py-6">
                  <div className="flex-shrink-0 relative w-20 h-28 bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100">
                    <img src={item.image} alt={item.name} className="object-cover object-center w-full h-full" />
                    <span className="absolute top-2 right-2 bg-[#1C1C1C] text-white rounded-full text-[10px] w-6 h-6 flex items-center justify-center font-bold shadow-md">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="ml-6 flex flex-1 flex-col justify-center">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-xs text-gray-900 uppercase tracking-widest leading-relaxed pr-4">{item.name}</p>
                      <p className="text-sm font-black text-[#FF7A00] tracking-wide">₹{((item.salePrice || item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="space-y-6 text-sm border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between">
                <dt className="text-gray-500 font-bold tracking-widest uppercase text-xs">Subtotal</dt>
                <dd className="font-black text-gray-900 tracking-wide">₹{totals.subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500 font-bold tracking-widest uppercase text-xs">Shipping</dt>
                <dd className="font-black text-gray-900 tracking-wide">{totals.shipping === 0 ? 'FREE' : `₹${totals.shipping.toFixed(2)}`}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex items-center justify-between text-[#FF7A00]">
                  <dt className="font-bold tracking-widest uppercase text-xs">Discount ({appliedCoupon?.code})</dt>
                  <dd className="font-black tracking-wide">-₹{totals.discount.toFixed(2)}</dd>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-6">
                <dt className="text-xl font-sans font-black uppercase tracking-tighter text-gray-900">Total</dt>
                <dd className="text-2xl font-black text-[#FF7A00] tracking-tight">₹{totals.total.toFixed(2)}</dd>
              </div>
            </dl>
          </div>
        </div>

      </div>
    </>
  )
}
