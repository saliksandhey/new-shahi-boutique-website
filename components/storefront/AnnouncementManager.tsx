'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const target = new Date(targetDate).getTime()
    
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = target - now
      
      if (distance < 0) {
        clearInterval(interval)
        return
      }
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="flex items-center gap-2 mt-2 mb-4">
      <div className="flex flex-col items-center">
        <span className="text-white font-black text-xl md:text-2xl leading-none tracking-tighter">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="text-[8px] md:text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Days</span>
      </div>
      <span className="text-gray-500 font-black text-xl leading-none -mt-3">:</span>
      <div className="flex flex-col items-center">
        <span className="text-white font-black text-xl md:text-2xl leading-none tracking-tighter">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-[8px] md:text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Hours</span>
      </div>
      <span className="text-gray-500 font-black text-xl leading-none -mt-3">:</span>
      <div className="flex flex-col items-center">
        <span className="text-white font-black text-xl md:text-2xl leading-none tracking-tighter">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-[8px] md:text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Mins</span>
      </div>
      <span className="text-gray-500 font-black text-xl leading-none -mt-3">:</span>
      <div className="flex flex-col items-center">
        <span className="text-white font-black text-xl md:text-2xl leading-none tracking-tighter">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-[8px] md:text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Secs</span>
      </div>
    </div>
  )
}

export function AnnouncementManager({ announcements }: { announcements: any[] }) {
  const router = useRouter()
  const [closedIds, setClosedIds] = useState<string[]>([])
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
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

      {/* 2. Homepage Popup (Modal) matching Design 1 */}
      {homePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-500 p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-[850px] w-full relative shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-700 flex flex-col md:flex-row">
            <button onClick={() => handleClose(homePopup.id)} className="absolute top-4 right-4 z-20 p-2 bg-gray-100/50 hover:bg-gray-200 text-gray-500 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
            
            {/* Left Image Section */}
            <div className="w-full md:w-1/2 h-48 md:h-auto relative bg-gradient-to-br from-[#E2F0F9] to-[#F4F9FB] flex items-center justify-center p-8 overflow-hidden">
              {/* Abstract decorative blob */}
              <div className="absolute top-0 right-0 bottom-0 w-[120%] bg-[#D0E7F4] rounded-l-full transform translate-x-1/4"></div>
              {homePopup.image_url ? (
                <img src={homePopup.image_url} alt={homePopup.title} className="relative z-10 w-full h-full object-contain max-h-[300px] drop-shadow-2xl" />
              ) : (
                <div className="relative z-10 w-32 h-32 bg-white/50 rounded-2xl flex items-center justify-center border border-white">
                  <span className="text-[#15B0B8] font-bold text-4xl">SHAHI</span>
                </div>
              )}
            </div>

            {/* Right Content Section */}
            <div className={`p-8 md:p-12 text-center flex flex-col justify-center items-center w-full ${homePopup.image_url ? 'md:w-1/2' : ''}`}>
              <h2 className="text-2xl md:text-3xl font-sans font-black text-gray-900 leading-tight mb-4 tracking-tight">{homePopup.title}</h2>
              {homePopup.description && <p className="text-gray-500 font-medium text-sm md:text-[15px] leading-relaxed mb-8 max-w-xs">{homePopup.description}</p>}
              
              {homePopup.action_link && homePopup.action_text && (
                <div className="flex items-center bg-[#15B0B8] rounded-full p-1.5 w-full max-w-[280px] shadow-lg shadow-[#15B0B8]/20 hover:shadow-[#15B0B8]/40 transition-shadow">
                  <span className="text-white font-bold px-4 md:px-6 text-sm truncate flex-1 text-center">
                    {homePopup.action_text.toLowerCase().includes('code') || homePopup.action_text.includes('%') ? homePopup.action_text : `#${homePopup.action_text.replace(/\s+/g, '')}`}
                  </span>
                  <Link href={homePopup.action_link} onClick={() => handleClose(homePopup.id)} className="bg-[#1a2b3c] text-white font-bold text-xs md:text-sm px-6 py-2.5 rounded-full hover:bg-black transition-colors whitespace-nowrap">
                    {homePopup.action_text.toLowerCase().includes('code') || homePopup.action_text.includes('%') ? 'Copy' : 'Shop Now'}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Corner Slide-in Toast matching Design 2 */}
      {cornerToast && hasScrolled && (
        <div 
          className="fixed bottom-6 left-6 md:left-auto md:right-8 z-40 max-w-[380px] w-[calc(100%-3rem)] md:w-full bg-[#1e293b] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-5 animate-in slide-in-from-bottom-12 fade-in duration-700 border border-white/10"
        >
          <button 
            onClick={() => handleClose(cornerToast.id)} 
            className="absolute top-3 left-3 p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          
          <div className="flex gap-5 h-full">
            {/* Left Image */}
            <div className="w-[100px] shrink-0 bg-white rounded-2xl p-2 relative flex flex-col items-center justify-center">
              {cornerToast.image_url ? (
                <img src={cornerToast.image_url} alt={cornerToast.title} className="w-full h-auto object-contain drop-shadow-md" />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs font-bold">Image</span>
                </div>
              )}
              {/* Optional Badge over image if needed, usually baked into image in the design */}
            </div>
            
            {/* Right Content */}
            <div className="flex flex-col justify-center flex-1 py-1">
              <h4 className="font-bold text-white text-[15px] tracking-tight leading-tight mb-1">{cornerToast.title}</h4>
              
              {/* Countdown Timer (if end_date exists, otherwise just description) */}
              {cornerToast.end_date ? (
                <CountdownTimer targetDate={cornerToast.end_date} />
              ) : (
                <p className="text-xs text-gray-400 mb-4 line-clamp-2">{cornerToast.description}</p>
              )}
              
              <div className="space-y-3 mt-1">
                {cornerToast.action_link && (
                  <button 
                    onClick={() => handleToastClick(cornerToast.action_link)}
                    className="w-full bg-white text-[#1e293b] font-bold text-xs py-2.5 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
                  >
                    {cornerToast.action_text || 'Shop Now'}
                  </button>
                )}
                <button 
                  onClick={() => handleClose(cornerToast.id)}
                  className="w-full text-[10px] text-gray-400 font-medium hover:text-white transition-colors uppercase tracking-widest text-center block"
                >
                  No Thanks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
