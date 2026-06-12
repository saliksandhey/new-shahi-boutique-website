'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const couponSchema = z.object({
  code: z.string().min(1, "Code is required").toUpperCase(),
  discount_type: z.enum(['PERCENTAGE', 'FIXED']),
  discount_value: z.coerce.number().min(0.01),
  expiry_date: z.string().optional().nullable(),
  active: z.boolean().default(true)
})

export async function createCoupon(formData: FormData) {
  const supabase = createAdminClient()
  
  const rawData = {
    code: formData.get('code'),
    discount_type: formData.get('discount_type'),
    discount_value: formData.get('discount_value'),
    expiry_date: formData.get('expiry_date') || null,
    active: formData.get('active') === 'on' || formData.get('active') === 'true'
  }

  const validated = couponSchema.safeParse(rawData)
  if (!validated.success) return { error: (validated as any).error.errors[0].message }

  const dataToInsert = {
    ...validated.data,
    expiry_date: validated.data.expiry_date ? new Date(validated.data.expiry_date).toISOString() : null
  }

  const { error } = await supabase.from('coupons').insert([dataToInsert])
  if (error) return { error: error.message }

  revalidatePath('/admin/coupons')
  redirect('/admin/coupons')
}

export async function updateCoupon(id: string, formData: FormData) {
  const supabase = createAdminClient()
  
  const rawData = {
    code: formData.get('code'),
    discount_type: formData.get('discount_type'),
    discount_value: formData.get('discount_value'),
    expiry_date: formData.get('expiry_date') || null,
    active: formData.get('active') === 'on' || formData.get('active') === 'true'
  }

  const validated = couponSchema.safeParse(rawData)
  if (!validated.success) return { error: (validated as any).error.errors[0].message }

  const dataToUpdate = {
    ...validated.data,
    expiry_date: validated.data.expiry_date ? new Date(validated.data.expiry_date).toISOString() : null
  }

  const { error } = await supabase.from('coupons').update(dataToUpdate).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/coupons')
  redirect('/admin/coupons')
}

export async function deleteCoupon(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('coupons').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/coupons')
  return { success: true }
}
