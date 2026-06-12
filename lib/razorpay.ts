import Razorpay from 'razorpay'
import { createAdminClient } from './supabase/server'

export async function getRazorpayInstance() {
  const supabase = await createAdminClient()
  const { data } = await supabase.from('store_settings').select('key, value').in('key', ['razorpay_key_id', 'razorpay_key_secret'])
  
  const keyId = data?.find((s: any) => s.key === 'razorpay_key_id')?.value
  const keySecret = data?.find((s: any) => s.key === 'razorpay_key_secret')?.value

  if (!keyId || !keySecret) {
    throw new Error('Razorpay keys not configured in Store Settings')
  }

  return {
    razorpay: new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    }),
    keyId,
    keySecret
  }
}
