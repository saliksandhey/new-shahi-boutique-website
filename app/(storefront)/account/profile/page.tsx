import { requireAuth } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import { ProfileForm } from './ProfileForm'

export default async function ProfilePage() {
  const user = await requireAuth()
  const supabase = createAdminClient()

  const { data: profile } = await supabase
    .from('customer_profiles')
    .select('name, phone')
    .eq('email', user.email)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your personal information.
        </p>
      </div>

      <ProfileForm 
        initialName={profile?.name || ''} 
        initialPhone={profile?.phone || ''} 
        email={user.email} 
      />
    </div>
  )
}
