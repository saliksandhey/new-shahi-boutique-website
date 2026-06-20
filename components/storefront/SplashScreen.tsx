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
    }, 3200)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }} // Sleek slide-up exit
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999] bg-[#111111] flex items-center justify-center pointer-events-none overflow-hidden"
        >
          <div className="relative flex flex-col items-center justify-center text-center z-10">
            <div className="overflow-hidden pb-4 px-4 max-w-[95vw]">
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
                className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-white font-heading font-black tracking-tighter uppercase relative leading-none"
              >
                SHAHI BOUTIQUE
                {/* Brand Accent Underline */}
                <motion.span 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1.2, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute -bottom-2 md:-bottom-3 left-0 w-full h-1.5 md:h-3 bg-[#FF7A00] origin-left"
                ></motion.span>
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
              className="mt-8 flex items-center gap-4"
            >
              <span className="w-8 h-[1px] bg-gray-600"></span>
              <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold">
                Where tradition meets royalty
              </p>
              <span className="w-8 h-[1px] bg-gray-600"></span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
