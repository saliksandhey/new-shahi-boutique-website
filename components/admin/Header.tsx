'use client'

import { Menu, LogOut, User } from 'lucide-react'
import { adminLogout } from '@/lib/actions/admin-auth'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <div className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b border-gray-100 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="lg:hidden flex items-center">
        <span className="text-xl font-heading font-black uppercase tracking-widest text-gray-900">
          SHAHI ADMIN
        </span>
      </div>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end items-center">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="flex items-center gap-x-4">
            <span className="hidden lg:flex lg:items-center">
              <span className="text-xs uppercase tracking-widest font-bold leading-6 text-gray-900" aria-hidden="true">
                Administrator
              </span>
            </span>
            <div className="h-9 w-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-400" />
            </div>
            
            <form action={adminLogout}>
              <Button variant="ghost" size="icon" type="submit" title="Logout" className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full">
                <LogOut className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
