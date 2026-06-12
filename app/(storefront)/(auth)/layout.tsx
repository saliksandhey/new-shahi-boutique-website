import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center lg:text-left">
            <Link href="/" className="text-3xl font-serif font-bold tracking-tight text-gray-900">
              BOUTIQUE.
            </Link>
          </div>
          <div className="mt-8">
            {children}
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
          alt="Fashion background"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </div>
  )
}
