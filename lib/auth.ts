import { createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { UserProfile } from '@/store/user-store'
import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'default-fallback-secret-for-dev'
)

// Define session type
export type CustomSessionUser = {
  email: string
}

// Mint a new JWT and set it in HTTP-only cookies
export async function createSession(email: string) {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 1 week session
    .sign(JWT_SECRET)

  const cookieStore = await cookies()
  cookieStore.set('shahi_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })
}

// Clear the session cookie
export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete('shahi_session')
}

// Get and verify the current user session
export async function getCurrentUser(): Promise<CustomSessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('shahi_session')?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (payload.email) {
      return { email: payload.email as string }
    }
    return null
  } catch (error) {
    // Invalid or expired token
    return null
  }
}

export async function getCurrentProfile(): Promise<UserProfile | null> {
  const user = await getCurrentUser()
  if (!user || !user.email) return null

  // Since the user is verified, we can use the admin client to fetch their profile securely
  const supabase = createAdminClient()
  const { data: profile } = await supabase
    .from('customer_profiles')
    .select('*')
    .eq('email', user.email)
    .single()

  if (profile) {
    return {
      id: profile.id,
      email: profile.email,
      full_name: profile.name,
      phone: profile.phone,
      avatar: null,
      role: 'CUSTOMER',
      created_at: profile.created_at
    } as UserProfile
  }

  return null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function isAdmin() {
  const profile = await getCurrentProfile()
  return profile?.role === 'ADMIN'
}

export async function checkAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  
  if (!token || token !== 'supabase_admin_authenticated') {
    return false
  }
  
  return true
}

export async function requireAdmin() {
  const isAdminUser = await checkAdmin()
  
  if (!isAdminUser) {
    throw new Error('Unauthorized')
  }
  
  return true
}
