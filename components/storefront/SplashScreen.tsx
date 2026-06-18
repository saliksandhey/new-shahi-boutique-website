'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function SplashScreen() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Ensure this shows ONLY ONCE per user session
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash')
    if (hasSeenSplash) {
      setShow(false)
      return
    }
    sessionStorage.setItem('hasSeenSplash', 'true')
    
    // Hide the splash screen after the animation sequence completes
    const timer = setTimeout(() => {
      setShow(false)
    }, 4500) // Increased time for a luxurious, unhurried pace

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }} // Luxurious fade out
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] bg-[#000000] flex items-center justify-center pointer-events-none overflow-hidden"
        >
          {/* Subtle background luxury glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-transparent to-transparent"
          />

          <div className="relative flex flex-col items-center justify-center text-center z-10">
            {/* The text with a wipe effect simulating calligraphy drawing */}
            <div className="relative pb-4 px-8">
              {/* Faded background text for depth */}
              <h1 
                className="text-6xl md:text-8xl text-white/5 font-light tracking-wide absolute left-0 top-0 w-full text-center"
                style={{ fontFamily: 'var(--font-great-vibes)' }}
              >
                Shahi Boutique
              </h1>
              
              {/* Foreground text animating in */}
              <motion.h1 
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 2.2, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
                className="text-6xl md:text-8xl text-[#D4AF37] font-light tracking-wide relative"
                style={{ 
                  fontFamily: 'var(--font-great-vibes)',
                  textShadow: '0 0 30px rgba(212, 175, 55, 0.3)'
                }}
              >
                Shahi Boutique
              </motion.h1>
            </div>

            {/* Elegant fading Line */}
            <motion.div 
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 2.4, ease: "easeInOut" }}
              className="w-48 md:w-64 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-4 origin-center"
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 2.8, ease: "easeOut" }}
              className="text-[#D4AF37] text-[10px] md:text-xs uppercase tracking-[0.4em] mt-6 font-bold"
            >
              The Epitome of Luxury
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
