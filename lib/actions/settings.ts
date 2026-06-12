'use server'

import { createAdminClient, createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getStoreSettings() {
  const supabase = await createAdminClient()
  
  const { data, error } = await supabase
    .from('store_settings')
    .select('key, value')
    
  if (error) {
    console.error('Error fetching settings:', error)
    return {}
  }
  
  // Convert array of {key, value} to an object
  return data.reduce((acc, item) => {
    acc[item.key] = item.value
    return acc
  }, {} as Record<string, string>)
}

export async function updateStoreSettings(formData: FormData) {
  const supabase = await createAdminClient()
  
  const razorpayKeyId = formData.get('razorpay_key_id') as string
  const razorpayKeySecret = formData.get('razorpay_key_secret') as string
  const codEnabled = formData.get('cod_enabled') as string
  
  const updates = [
    { key: 'razorpay_key_id', value: razorpayKeyId },
    { key: 'razorpay_key_secret', value: razorpayKeySecret },
    { key: 'cod_enabled', value: codEnabled }
  ]
  
  for (const item of updates) {
    if (item.value !== null && item.value !== undefined) {
      const { error } = await supabase
        .from('store_settings')
        .upsert(
          { key: item.key, value: item.value },
          { onConflict: 'key' }
        )
        
      if (error) {
        return { success: false, error: `Failed to update ${item.key}: ${error.message}` }
      }
    }
  }
  
  revalidatePath('/admin/settings')
  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const newPassword = formData.get('password') as string

  if (!newPassword || newPassword.length < 6) {
    return { error: 'Password must be at least 6 characters long.' }
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function deleteAccount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Use admin client to delete user completely from Auth schema
  const adminClient = createAdminClient()
  const { error } = await adminClient.auth.admin.deleteUser(user.id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}


export async function updateEmail(formData: FormData) {
  const supabase = await createClient()
  const newEmail = formData.get('email') as string

  if (!newEmail || !newEmail.includes('@')) {
    return { error: 'Please provide a valid email address.' }
  }

  const { error } = await supabase.auth.updateUser({
    email: newEmail
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
