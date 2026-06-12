'use client'

import { UserProfile } from '@/store/user-store'
import { Menu, User, LogOut } from 'lucide-react'
import { signout } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'

export function Header({ profile }: { profile: UserProfile | null }) {
  // Mobile menu state can be added here
  
  return (
    <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex flex-1 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center md:hidden">
          <button type="button" className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none">
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="flex flex-1 justify-end items-center space-x-4">
          <div className="flex items-center">
            <div className="flex items-center text-sm font-medium text-gray-700">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="" className="h-8 w-8 rounded-full bg-gray-100" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
              )}
              <span className="ml-3 hidden sm:block">{profile?.full_name || 'My Account'}</span>
            </div>
            <form action={signout} className="ml-4">
              <Button variant="ghost" size="icon" type="submit" title="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
