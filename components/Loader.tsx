"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

const WORDS = ["research", "build", "write", "listen"]

// Counts to 100 while fonts and the page load, then lifts away like a curtain.
export default function Loader() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    document.body.classList.add("is-loading")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const minTime = reduce ? 300 : 2200
    const start = performance.now()
    let loaded = document.readyState === "complete"
    const onLoad = () => (loaded = true)
    window.addEventListener("load", onLoad)

    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / minTime)
      const eased = 1 - Math.pow(1 - t, 3)
      const target = loaded ? eased * 100 : Math.min(eased * 100, 92)
      setProgress((p) => Math.max(p, Math.floor(target)))
      if (t >= 1 && loaded) {
        setProgress(100)
        setTimeout(() => {
          setDone(true)
          document.body.classList.remove("is-loading")
          window.dispatchEvent(new Event("loader:done"))
          ;(window as unknown as { __loaded?: boolean }).__loaded = true
        }, reduce ? 0 : 350)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("load", onLoad)
    }
  }, [])

  const word = WORDS[Math.min(WORDS.length - 1, Math.floor((progress / 101) * WORDS.length))]

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          role="status"
          aria-live="polite"
          aria-label={`Loading ${progress}%`}
          className="fixed inset-0 z-[150] flex flex-col justify-between bg-ink px-[var(--gutter)] py-8"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.28em] text-bone-3">
            <span>Sai Pranay Tadakamalla</span>
            <span>Hyderabad · IN</span>
          </div>

          <div className="relative">
            <div className="mb-6 flex items-center gap-4">
              <motion.span
                className="block h-2 w-2 rounded-full bg-saffron"
                animate={{ scale: [1, 1.8, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <span className="font-display text-xl text-bone-2 md:text-2xl">
                I{" "}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={word}
                    className="serif-accent inline-block text-2xl md:text-3xl"
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    {word}
                  </motion.span>
                </AnimatePresence>
                .
              </span>
            </div>
            <div className="flex items-end justify-between gap-6">
              <span className="font-display text-[26vw] font-medium leading-[0.8] tracking-tightest text-bone tabular-nums md:text-[18vw]">
                {progress}
              </span>
              <span className="mb-4 font-display text-4xl text-bone-3 md:text-7xl">%</span>
            </div>
            <div className="mt-6 h-px w-full bg-white/10">
              <div className="h-px bg-saffron transition-[width] duration-150" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
