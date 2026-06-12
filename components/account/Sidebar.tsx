'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, MapPin, Package, Heart, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/account', icon: Home },
  { name: 'Profile', href: '/account/profile', icon: User },
  { name: 'Orders', href: '/account/orders', icon: Package },
  { name: 'Wishlist', href: '/account/wishlist', icon: Heart },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
        <div className="flex flex-shrink-0 items-center px-6">
          <Link href="/" className="text-2xl font-serif font-bold tracking-tight text-gray-900">
            BOUTIQUE.
          </Link>
        </div>
        <div className="mt-8 flex flex-grow flex-col">
          <nav className="flex-1 space-y-1 px-4 pb-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 h-5 w-5 flex-shrink-0'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
