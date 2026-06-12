import { requireAuth, getCurrentProfile } from '@/lib/auth'
import { Sidebar } from '@/components/account/Sidebar'
import { Header } from '@/components/account/Header'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireAuth()
  const profile = await getCurrentProfile()

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="flex flex-1 flex-col md:pl-64">
        <Header profile={profile} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
