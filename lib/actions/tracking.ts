'use server'

import { createAdminClient } from '@/lib/supabase/server'

export async function fetchTrackingInfo(orderNumber: string, email: string) {
  const supabase = createAdminClient()

  const cleanOrderNumber = orderNumber.trim()
  const cleanEmail = email.trim().toLowerCase()

  // Find the order with matching order_number and verify the associated email
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name)), order_timeline(*)')
    .ilike('order_number', cleanOrderNumber)
    .single()

  if (error || !order) {
    console.error("Tracking Error:", error?.message || "Order not found", cleanOrderNumber)
    return { success: false, error: 'Order not found. Please check your order number.' }
  }

  if (order.customer_email?.toLowerCase().trim() !== cleanEmail) {
    return { success: false, error: 'Email does not match the order records.' }
  }

  return { success: true, order }
}
