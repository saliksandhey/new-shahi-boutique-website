'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { adminLogout } from '@/lib/actions/admin-auth'
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Users, 
  Ticket, 
  Image as ImageIcon, 
  Star, 
  Settings,
  ArrowLeft,
  Megaphone
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Tags },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-100 bg-white px-6 pb-4">
        <div className="flex h-20 shrink-0 items-center border-b border-gray-100 mb-2">
          <Link href="/admin" className="text-2xl font-heading font-black uppercase tracking-widest text-gray-900 hover:text-[#FF7A00] transition-colors">
            SHAHI ADMIN
          </Link>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          isActive
                            ? 'bg-[#1C1C1C] text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
                          'group flex gap-x-3 rounded-2xl p-3 text-sm leading-6 font-bold uppercase tracking-widest transition-all duration-300'
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-900',
                            'h-5 w-5 shrink-0 transition-colors duration-300'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
          </ul>
        </nav>
        
        <div className="mt-auto pb-4 space-y-3 pt-4 border-t border-gray-100">
          <Link
            href="/"
            className="group flex items-center gap-x-3 rounded-2xl p-3 text-xs uppercase tracking-widest leading-6 font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300"
          >
            <ArrowLeft
              className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-gray-900 transition-colors"
              aria-hidden="true"
            />
            Back to Store
          </Link>
          <form action={adminLogout}>
            <button
              type="submit"
              className="w-full group flex items-center gap-x-3 rounded-2xl p-3 text-xs uppercase tracking-widest leading-6 font-bold text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
