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
  expiry_date: z.string().optional(),
  active: z.boolean().optional()
})

type FormValues = z.infer<typeof couponSchema>

export function CouponForm({ coupon }: { coupon?: any }) {
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: coupon ? {
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      expiry_date: coupon.expiry_date ? new Date(coupon.expiry_date).toISOString().split('T')[0] : '',
      active: coupon.active
    } : {
      code: '', discount_type: 'PERCENTAGE', discount_value: 0, expiry_date: '', active: true
    }
  })

  const onSubmit = async (data: FormValues) => {
    setError(null)
    const formData = new FormData()
    formData.append('code', data.code)
    formData.append('discount_type', data.discount_type)
    formData.append('discount_value', (data.discount_value || 0).toString())
    if (data.expiry_date) formData.append('expiry_date', data.expiry_date)
    formData.append('active', (data.active ?? true).toString())

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

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Coupon Code</Label>
            <Input id="code" className="uppercase font-mono" {...form.register('code')} />
            {form.formState.errors.code && <p className="text-xs text-red-500">{form.formState.errors.code.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount_type">Type</Label>
              <select 
                id="discount_type" 
                {...form.register('discount_type')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₹)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount_value">Value</Label>
              <Input id="discount_value" type="number" step="0.01" {...form.register('discount_value')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry_date">Expiry Date (Optional)</Label>
            <Input id="expiry_date" type="date" {...form.register('expiry_date')} />
          </div>

          <div className="space-y-2 flex items-center mt-4 space-x-2">
            <input type="checkbox" id="active" {...form.register('active')} className="h-4 w-4" />
            <Label htmlFor="active">Active</Label>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : (coupon ? 'Update Coupon' : 'Create Coupon')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
