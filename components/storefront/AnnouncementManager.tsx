'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

export function AnnouncementManager({ announcements }: { announcements: any[] }) {
  const [closedIds, setClosedIds] = useState<string[]>([])
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    // Load closed announcements from session storage
    const stored = sessionStorage.getItem('shahi_closed_announcements')
    if (stored) {
      setClosedIds(JSON.parse(stored))
    }

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setHasScrolled(true)
        window.removeEventListener('scroll', handleScroll)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClose = (id: string) => {
    const newClosed = [...closedIds, id]
    setClosedIds(newClosed)
    sessionStorage.setItem('shahi_closed_announcements', JSON.stringify(newClosed))
  }

  // Filter out closed ones
  const activeAnnouncements = announcements.filter(a => !closedIds.includes(a.id))

  const globalBanner = activeAnnouncements.find(a => a.display_type === 'GLOBAL_BANNER')
  const homePopup = activeAnnouncements.find(a => a.display_type === 'HOME_POPUP')
  const cornerToast = activeAnnouncements.find(a => a.display_type === 'CORNER_TOAST')

  return (
    <>
      {/* 1. Global Banner */}
      {globalBanner && (
        <div className="bg-[#1C1C1C] text-white py-2 px-4 relative z-50">
          <div className="max-w-7xl mx-auto flex justify-center items-center text-xs md:text-sm font-medium tracking-wide">
            <span className="text-center">{globalBanner.title} {globalBanner.description ? `- ${globalBanner.description}` : ''}</span>
            {globalBanner.action_link && globalBanner.action_text && (
              <Link href={globalBanner.action_link} className="ml-3 underline font-bold uppercase tracking-widest text-[10px] hover:text-[#FF7A00] transition-colors">
                {globalBanner.action_text}
              </Link>
            )}
            <button onClick={() => handleClose(globalBanner.id)} className="absolute right-4 p-1 hover:text-gray-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Homepage Popup (Modal) */}
      {/* Note: In a real app, you might restrict this strictly to pathname === '/' using usePathname() */}
      {homePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl overflow-hidden max-w-lg w-full mx-4 relative shadow-2xl animate-in zoom-in-95 duration-500">
            <button onClick={() => handleClose(homePopup.id)} className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full backdrop-blur-md transition-colors">
              <X className="w-5 h-5 text-black" />
            </button>
            {homePopup.image_url && (
              <div className="w-full h-64 bg-gray-100">
                <img src={homePopup.image_url} alt={homePopup.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-8 text-center space-y-4">
              <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900">{homePopup.title}</h2>
              {homePopup.description && <p className="text-gray-600 font-medium">{homePopup.description}</p>}
              {homePopup.action_link && homePopup.action_text && (
                <div className="pt-4">
                  <Link href={homePopup.action_link} onClick={() => handleClose(homePopup.id)} className="inline-block bg-[#1C1C1C] hover:bg-[#FF7A00] text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-full transition-colors w-full">
                    {homePopup.action_text}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Corner Slide-in Toast */}
      {cornerToast && hasScrolled && (
        <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 animate-in slide-in-from-bottom-8 fade-in duration-500">
          <button onClick={() => handleClose(cornerToast.id)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-900 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="flex gap-4">
            {cornerToast.image_url && (
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                <img src={cornerToast.image_url} alt={cornerToast.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="pt-1">
              <h4 className="font-black text-gray-900 text-sm tracking-tight">{cornerToast.title}</h4>
              {cornerToast.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{cornerToast.description}</p>}
              {cornerToast.action_link && cornerToast.action_text && (
                <Link href={cornerToast.action_link} className="inline-block mt-3 text-[10px] font-bold uppercase tracking-widest text-[#FF7A00] hover:text-[#1C1C1C] transition-colors">
                  {cornerToast.action_text} &rarr;
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
