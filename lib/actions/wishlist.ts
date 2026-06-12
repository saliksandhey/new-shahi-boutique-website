'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'

export async function toggleWishlist(productId: string) {
  const user = await getCurrentUser()
  if (!user || !user.email) return { error: 'Not authenticated' }

  const supabase = createAdminClient()

  // Check if it exists
  const { data: existing } = await supabase
    .from('wishlist')
    .select('id')
    .eq('user_email', user.email)
    .eq('product_id', productId)
    .single()

  if (existing) {
    // Remove
    const { error } = await supabase.from('wishlist').delete().eq('id', existing.id)
    if (error) return { error: error.message }
  } else {
    // Add
    const { error } = await supabase.from('wishlist').insert([{ user_email: user.email, product_id: productId }])
    if (error) return { error: error.message }
  }

  revalidatePath('/account/wishlist')
  revalidatePath('/shop')
  return { success: true }
}

export async function getWishlist() {
  const user = await getCurrentUser()
  if (!user || !user.email) return []

  const supabase = createAdminClient()

  const { data } = await supabase
    .from('wishlist')
    .select('product_id')
    .eq('user_email', user.email)

  return data?.map(d => d.product_id) || []
}
