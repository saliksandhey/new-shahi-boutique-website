'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'
import { z } from 'zod'

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
})

export async function updateProfile(formData: FormData) {
  const supabase = createAdminClient()
  const user = await getCurrentUser()

  if (!user || !user.email) {
    return { error: 'Not authenticated' }
  }

  const rawData = {
    full_name: formData.get('full_name'),
    phone: formData.get('phone'),
  }

  const validatedData = profileSchema.safeParse(rawData)

  if (!validatedData.success) {
    return { error: (validatedData as any).error.errors[0].message }
  }

  const { error } = await supabase
    .from('customer_profiles')
    .update({
      name: validatedData.data.full_name,
      phone: validatedData.data.phone
    })
    .eq('email', user.email)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/account', 'layout')
  return { success: true }
}

export async function updateAvatar(formData: FormData) {
  return { error: 'Avatar upload not supported in guest schema' }
}
