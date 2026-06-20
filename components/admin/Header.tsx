'use client'

import { Menu, LogOut, User } from 'lucide-react'
import { adminLogout } from '@/lib/actions/admin-auth'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <div className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 bg-white/80 backdrop-blur-md px-4 sm:gap-x-6 sm:px-6 lg:px-8 border-b border-gray-100">
      <div className="lg:hidden flex items-center">
        <span className="text-xl font-heading font-black uppercase tracking-widest text-gray-900">
          SHAHI ADMIN
        </span>
      </div>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end items-center">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="flex items-center gap-x-4">
            <span className="hidden lg:flex lg:items-center">
              <span className="text-xs uppercase tracking-widest font-black leading-6 text-gray-900" aria-hidden="true">
                Administrator
              </span>
            </span>
            <div className="h-10 w-10 rounded-full bg-[#1C1C1C] flex items-center justify-center shadow-md">
              <User className="h-5 w-5 text-white" />
            </div>
            
            <form action={adminLogout}>
              <Button variant="ghost" size="icon" type="submit" title="Logout" className="text-gray-400 hover:text-white hover:bg-red-500 rounded-full transition-colors h-10 w-10">
                <LogOut className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
