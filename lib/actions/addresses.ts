'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'
import { z } from 'zod'

const addressSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  address_line1: z.string().min(1, "Address Line 1 is required"),
  address_line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  is_default: z.boolean().default(false),
})

export async function addAddress(formData: FormData) {
  const supabase = createAdminClient()
  const user = await getCurrentUser()

  if (!user || !user.email) return { error: 'Not authenticated' }

  const rawData = {
    full_name: formData.get('full_name'),
    phone: formData.get('phone'),
    address_line1: formData.get('address_line1'),
    address_line2: formData.get('address_line2'),
    city: formData.get('city'),
    state: formData.get('state'),
    postal_code: formData.get('postal_code'),
    country: formData.get('country'),
    is_default: formData.get('is_default') === 'on' || formData.get('is_default') === 'true',
  }

  const validated = addressSchema.safeParse(rawData)
  if (!validated.success) return { error: 'Validation failed' }

  if (validated.data.is_default) {
    // Unset other defaults
    await supabase.from('addresses').update({ is_default: false }).eq('user_email', user.email)
  }

  const { error } = await supabase
    .from('addresses')
    .insert([{ ...validated.data, user_email: user.email }])

  if (error) return { error: error.message }

  revalidatePath('/account/addresses')
  return { success: true }
}

export async function updateAddress(id: string, formData: FormData) {
  const supabase = createAdminClient()
  const user = await getCurrentUser()

  if (!user || !user.email) return { error: 'Not authenticated' }

  const rawData = {
    full_name: formData.get('full_name'),
    phone: formData.get('phone'),
    address_line1: formData.get('address_line1'),
    address_line2: formData.get('address_line2'),
    city: formData.get('city'),
    state: formData.get('state'),
    postal_code: formData.get('postal_code'),
    country: formData.get('country'),
    is_default: formData.get('is_default') === 'on' || formData.get('is_default') === 'true',
  }

  const validated = addressSchema.safeParse(rawData)
  if (!validated.success) return { error: 'Validation failed' }

  if (validated.data.is_default) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_email', user.email)
  }

  const { error } = await supabase
    .from('addresses')
    .update(validated.data)
    .eq('id', id)
    .eq('user_email', user.email)

  if (error) return { error: error.message }

  revalidatePath('/account/addresses')
  return { success: true }
}

export async function deleteAddress(id: string) {
  const supabase = createAdminClient()
  const user = await getCurrentUser()
  if (!user || !user.email) return { error: 'Not authenticated' }

  const { error } = await supabase.from('addresses').delete().eq('id', id).eq('user_email', user.email)
  
  if (error) return { error: error.message }
  
  revalidatePath('/account/addresses')
  return { success: true }
}

export async function setDefaultAddress(id: string) {
  const supabase = createAdminClient()
  const user = await getCurrentUser()
  if (!user || !user.email) return { error: 'Not authenticated' }

  await supabase.from('addresses').update({ is_default: false }).eq('user_email', user.email)
  
  const { error } = await supabase.from('addresses').update({ is_default: true }).eq('id', id).eq('user_email', user.email)
  
  if (error) return { error: error.message }
  
  revalidatePath('/account/addresses')
  return { success: true }
}
