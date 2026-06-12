'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function adminLogin(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    return { error: 'Invalid email or password.' }
  }

  if (!data.session) {
    return { error: 'Email not confirmed. Please confirm your email in Supabase or turn off email confirmation.' }
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_token', 'supabase_admin_authenticated', {
    httpOnly: true,
    secure: false, // Ensure it works on HTTP!
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })

  revalidatePath('/admin', 'layout')
  redirect('/admin')
}

export async function adminLogout() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
  redirect('/admin/login')
}
