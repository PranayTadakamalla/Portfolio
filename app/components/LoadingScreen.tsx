"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useLoading } from "./LoadingProvider"

const quotes = [
  "Unlike your last two brain cells",
  "Initializing portfolio magic...",
  "Loading Vishnu's brilliance...",
  "Processing code, not excuses...",
  "Buffering genius...",
  "Compiling awesomeness...",
  "Decoding excellence...",
  "Rendering perfection...",
  "Syncing with the cloud (and reality)...",
  "Unleashing potential...",
]

export default function LoadingScreen() {
  const { isLoading } = useLoading()
  const [currentQuote, setCurrentQuote] = useState(quotes[0])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate faster progress to avoid perceived lag
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev
        return Math.min(95, prev + Math.random() * 30)
      })
    }, 80)

    // Change quote slower for readability
    let quoteIndex = 0
    const quoteInterval = setInterval(() => {
      setCurrentQuote(quotes[quoteIndex % quotes.length])
      quoteIndex++
    }, 600)

    // Set progress to 100 when loading completes
    if (!isLoading) {
      setProgress(100)
    }

    return () => {
      clearInterval(progressInterval)
      clearInterval(quoteInterval)
    }
  }, [isLoading])

  if (!isLoading) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background animated grid */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="flex flex-col items-center gap-6 relative z-10 px-6">
        {/* Simple centered dot loader above quotes */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center mb-4">
            <motion.span
              className="w-3 h-3 bg-white rounded-full mx-1"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
            />
            <motion.span
              className="w-3 h-3 bg-white rounded-full mx-1"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.15 }}
            />
            <motion.span
              className="w-3 h-3 bg-white rounded-full mx-1"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
            />
          </div>

          {/* Quote */}
          <motion.div
            key={currentQuote}
            className="text-xl text-blue-300 italic text-center h-8 overflow-hidden mb-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            "{currentQuote}"
          </motion.div>

          <motion.p className="text-sm text-slate-400 mt-2">Crafting excellence in real-time</motion.p>

          {/* Small progress bar */}
          <div className="mt-6 w-56">
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

