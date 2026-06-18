'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCoupon, updateCoupon } from '@/lib/actions/admin-coupons'
import { Card, CardContent } from '@/components/ui/card'

const couponSchema = z.object({
  code: z.string().min(1, "Code is required").toUpperCase(),
  discount_type: z.enum(['PERCENTAGE', 'FIXED']),
  discount_value: z.any(),
  min_order_amount: z.any(),
  expiry_date: z.string().optional(),
  active: z.boolean().optional(),
  is_public: z.boolean().optional()
})

type FormValues = z.infer<typeof couponSchema>

export function CouponForm({ coupon }: { coupon?: any }) {
  const [error, setError] = useState<string | null>(null)
  const [offerType, setOfferType] = useState<'DISCOUNT' | 'GIFT'>(
    coupon?.discount_value === 0 ? 'GIFT' : 'DISCOUNT'
  )
  
  const form = useForm<FormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: coupon ? {
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_amount: coupon.min_order_amount || 0,
      expiry_date: coupon.expiry_date ? new Date(coupon.expiry_date).toISOString().split('T')[0] : '',
      active: coupon.active,
      is_public: coupon.is_public || false
    } : {
      code: '', discount_type: 'PERCENTAGE', discount_value: 0, min_order_amount: 0, expiry_date: '', active: true, is_public: false
    }
  })

  const onSubmit = async (data: FormValues) => {
    setError(null)
    const formData = new FormData()
    formData.append('code', data.code)
    
    if (offerType === 'GIFT') {
      formData.append('discount_type', 'FIXED')
      formData.append('discount_value', '0')
      formData.append('min_order_amount', (data.min_order_amount || 0).toString())
    } else {
      formData.append('discount_type', data.discount_type)
      formData.append('discount_value', (data.discount_value || 0).toString())
      formData.append('min_order_amount', '0')
    }
    
    if (data.expiry_date) formData.append('expiry_date', data.expiry_date)
    formData.append('active', (data.active ?? true).toString())
    formData.append('is_public', (data.is_public ?? false).toString())

    let res;
    if (coupon) {
      res = await updateCoupon(coupon.id, formData)
    } else {
      res = await createCoupon(formData)
    }

    if (res?.error) {
      setError(res.error)
    }
  }

  // Luxury UI Class Names
  const cardClass = "border border-gray-200 shadow-none rounded-none bg-white"
  const headerClass = "text-[11px] font-bold uppercase tracking-[0.2em] text-[#1C1C1C] border-b border-gray-100 pb-4 mb-6"
  const labelClass = "text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2 block"
  const inputClass = "rounded-none border-gray-200 shadow-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] bg-gray-50/50 hover:bg-white transition-colors"

  return (
    <Card className={cardClass}>
      <CardContent className="pt-6">
        <h3 className={headerClass}>Coupon Details</h3>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Offer Type Selection */}
          <div className="flex gap-4 border-b border-gray-100 pb-6 mb-6">
            <label className={`flex-1 flex items-center justify-center p-4 border cursor-pointer transition-all ${offerType === 'DISCOUNT' ? 'border-[#D4AF37] bg-[#D4AF37]/5 ring-1 ring-[#D4AF37]' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
              <input type="radio" name="offerType" className="hidden" checked={offerType === 'DISCOUNT'} onChange={() => setOfferType('DISCOUNT')} />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#1C1C1C]">Standard Discount</span>
            </label>
            <label className={`flex-1 flex items-center justify-center p-4 border cursor-pointer transition-all ${offerType === 'GIFT' ? 'border-[#D4AF37] bg-[#D4AF37]/5 ring-1 ring-[#D4AF37]' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
              <input type="radio" name="offerType" className="hidden" checked={offerType === 'GIFT'} onChange={() => setOfferType('GIFT')} />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#1C1C1C]">Free Gift Offer</span>
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="code" className={labelClass}>Coupon Code</Label>
            <Input id="code" className={`${inputClass} uppercase font-mono tracking-widest`} {...form.register('code')} placeholder={offerType === 'GIFT' ? 'e.g. FREEPOTLI' : 'e.g. FESTIVE20'} />
            {form.formState.errors.code && <p className="text-[10px] uppercase text-red-500 mt-2">{form.formState.errors.code.message}</p>}
          </div>

          {offerType === 'DISCOUNT' && (
            <div className="grid grid-cols-2 gap-6 bg-gray-50/30 p-6 border border-gray-100">
              <div>
                <Label htmlFor="discount_type" className={labelClass}>Discount Type</Label>
                <select 
                  id="discount_type" 
                  {...form.register('discount_type')}
                  className={`flex h-10 w-full px-3 py-2 text-sm outline-none ${inputClass}`}
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="discount_value" className={labelClass}>Discount Value</Label>
                <Input id="discount_value" type="number" step="0.01" className={inputClass} {...form.register('discount_value')} placeholder="e.g. 20" />
              </div>
            </div>
          )}

          {offerType === 'GIFT' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#D4AF37]/5 p-6 border border-[#D4AF37]/20">
              <div className="sm:col-span-2">
                <Label className={labelClass}>Offer Description</Label>
                <p className="text-xs text-gray-600 font-medium">This offer provides a <strong className="text-[#D4AF37]">FREE GIFT</strong> when the customer's cart subtotal reaches the minimum order amount.</p>
              </div>
              <div>
                <Label htmlFor="min_order_amount" className={labelClass}>Required Minimum Order (₹)</Label>
                <Input id="min_order_amount" type="number" step="0.01" className={`${inputClass} border-[#D4AF37]/30 bg-white`} {...form.register('min_order_amount')} placeholder="e.g. 5000" />
                <p className="text-[9px] text-gray-500 mt-2 uppercase tracking-wider">Cart total must hit this to get the gift</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="expiry_date" className={labelClass}>Expiry Date (Optional)</Label>
              <Input id="expiry_date" type="date" className={inputClass} {...form.register('expiry_date')} />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <input type="checkbox" id="is_public" {...form.register('is_public')} className="h-4 w-4 rounded-none border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]" />
              <Label htmlFor="is_public" className={`${labelClass} !mb-0 cursor-pointer`}>Show Publicly (Visible on Checkout)</Label>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" id="active" {...form.register('active')} className="h-4 w-4 rounded-none border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]" />
              <Label htmlFor="active" className={`${labelClass} !mb-0 cursor-pointer`}>Active</Label>
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-4 border border-red-100 text-sm tracking-wide uppercase font-medium">{error}</div>}

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <Button 
              type="submit" 
              disabled={form.formState.isSubmitting}
              className="bg-[#1C1C1C] hover:bg-[#D4AF37] text-white rounded-none uppercase tracking-[0.2em] text-[11px] font-bold px-12 py-7 transition-colors shadow-none"
            >
              {form.formState.isSubmitting ? 'Saving...' : (coupon ? 'Update Coupon' : 'Create Coupon')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
