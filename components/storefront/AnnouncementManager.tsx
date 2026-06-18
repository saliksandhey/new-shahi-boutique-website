'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

export function AnnouncementManager({ announcements }: { announcements: any[] }) {
  const router = useRouter()
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

  const handleCloseAll = () => {
    const allIds = announcements.map(a => a.id)
    setClosedIds(allIds)
    sessionStorage.setItem('shahi_closed_announcements', JSON.stringify(allIds))
  }

  const handleToastClick = (url: string) => {
    handleCloseAll()
    router.push(url)
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
        <div className="bg-gradient-to-r from-black via-[#111] to-black text-[#D4AF37] py-2.5 px-4 relative z-50 border-b border-[#D4AF37]/20 shadow-[0_4px_20px_rgba(212,175,55,0.05)]">
          <div className="max-w-7xl mx-auto flex justify-center items-center text-[9px] md:text-xs font-black tracking-[0.2em] uppercase">
            <div className="flex items-center space-x-3 text-center">
              <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
              <span>{globalBanner.title} {globalBanner.description ? `— ${globalBanner.description}` : ''}</span>
              {globalBanner.action_link && globalBanner.action_text && (
                <Link href={globalBanner.action_link} className="ml-2 md:ml-4 text-white underline decoration-[#D4AF37]/50 hover:decoration-[#D4AF37] transition-all">
                  {globalBanner.action_text}
                </Link>
              )}
            </div>
            <button onClick={() => handleClose(globalBanner.id)} className="absolute right-4 p-1 text-gray-500 hover:text-[#D4AF37] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Homepage Popup (Modal) */}
      {homePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white rounded-[2rem] overflow-hidden max-w-md w-full mx-4 relative shadow-[0_0_50px_rgba(212,175,55,0.15)] animate-in zoom-in-95 duration-700 border border-[#D4AF37]/20">
            <button onClick={() => handleClose(homePopup.id)} className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors">
              <X className="w-5 h-5" />
            </button>
            {homePopup.image_url && (
              <div className="w-full h-72 relative">
                <img src={homePopup.image_url} alt={homePopup.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
              </div>
            )}
            <div className={`p-8 text-center space-y-4 ${homePopup.image_url ? '-mt-16 relative z-10' : ''}`}>
              <div className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase mb-2">Exclusive Notice</div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 leading-none">{homePopup.title}</h2>
              {homePopup.description && <p className="text-gray-500 font-medium text-sm leading-relaxed px-4">{homePopup.description}</p>}
              {homePopup.action_link && homePopup.action_text && (
                <div className="pt-6">
                  <Link href={homePopup.action_link} onClick={() => handleClose(homePopup.id)} className="inline-block bg-[#1C1C1C] hover:bg-[#D4AF37] text-white font-black uppercase tracking-widest text-xs px-10 py-5 rounded-full transition-colors w-full shadow-lg">
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
        <div 
          onClick={cornerToast.action_link ? () => handleToastClick(cornerToast.action_link) : undefined}
          className={`fixed bottom-6 left-6 md:left-auto md:right-6 z-40 max-w-[16rem] w-[calc(100%-3rem)] md:w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-[#D4AF37]/20 p-3 animate-in slide-in-from-bottom-12 fade-in duration-700 ${cornerToast.action_link ? 'cursor-pointer hover:border-[#D4AF37] hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)] transition-all' : ''}`}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); handleClose(cornerToast.id); }} 
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-200 rounded-full transition-colors z-10"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="flex gap-3">
            {cornerToast.image_url && (
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100 shadow-inner">
                <img src={cornerToast.image_url} alt={cornerToast.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex flex-col justify-center pr-4">
              <div className="flex items-center space-x-1.5 mb-0.5">
                <span className="w-1 h-1 rounded-full bg-[#D4AF37] animate-pulse"></span>
                <span className="text-[7px] font-black tracking-widest text-[#D4AF37] uppercase">Just For You</span>
              </div>
              <h4 className="font-bold text-gray-900 text-xs tracking-tight leading-tight line-clamp-1">{cornerToast.title}</h4>
              {cornerToast.description && <p className="text-[10px] text-gray-500 line-clamp-1 leading-relaxed mt-0.5">{cornerToast.description}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
