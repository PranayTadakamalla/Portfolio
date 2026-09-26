"use client"

import { AnimatePresence, motion } from "motion/react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const TIPS: Record<string, string> = {
  "/about": "Hover the photo — I like a closer look.",
  "/research": "Watch the agent. It walks into the trap, then tunnels out.",
  "/labs": "Two products, one company. Both are real and running.",
  "/projects": "Filter the evidence by type. Private repos are marked.",
  "/journey": "Scroll slowly. The timeline draws itself.",
  "/writing": "You see, but do you observe? Read slowly here.",
  "/contact": "One click copies the email. Elementary.",
}

// A small flat Sherlock: deerstalker, curls, blue scarf, calabash pipe.
export function SherlockFace({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="36" r="17" fill="#e9c7a4" />
      <circle cx="18" cy="34" r="4" fill="#2a1d14" />
      <circle cx="46" cy="34" r="4" fill="#2a1d14" />
      <path d="M13 30c0-11 8.5-18 19-18s19 7 19 18c-5-2-10-3-19-3s-14 1-19 3z" fill="#6a5540" />
      <path d="M13 30c-3 1-6 2-6 4 5 1 8-1 10-2zM51 30c3 1 6 2 6 4-5 1-8-1-10-2z" fill="#5d4a36" />
      <path d="M20 17l24 0M18 22l28 0" stroke="#3b2e22" strokeWidth="1.2" opacity=".6" />
      <circle cx="32" cy="11" r="2" fill="#3b2e22" />
      <circle cx="26" cy="37" r="2.2" fill="#17120e" />
      <circle cx="38" cy="37" r="2.2" fill="#17120e" />
      <circle cx="26.7" cy="36.3" r=".7" fill="#fff" />
      <circle cx="38.7" cy="36.3" r=".7" fill="#fff" />
      <path d="M29 45c2 1.5 4 1.5 6 0" stroke="#8a4a3a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M36 45c3 2 6 3 9 2" stroke="#2a1a10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M44 42h5l-1 7h-3z" fill="#c99b52" />
      <path d="M20 52c4 3 20 3 24 0l-2 5H22z" fill="#2c4a6e" />
    </svg>
  )
}

export default function Guide() {
  const pathname = usePathname()
  const tip = TIPS[pathname]
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setOpen(false)
    let off = false
    try {
      off = sessionStorage.getItem(`guide:${pathname}`) === "off"
    } catch {}
    setDismissed(off)
    if (!tip || off) return
    const a = setTimeout(() => setOpen(true), 2600)
    const b = setTimeout(() => setOpen(false), 9500)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [pathname, tip])

  if (!tip) return null

  return (
    <div className="fixed bottom-4 right-4 z-[95] flex items-end gap-3 md:bottom-6 md:right-6">
      <AnimatePresence>
        {open && !dismissed && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="relative mb-6 max-w-[240px] rounded-2xl rounded-br-sm border border-brass/40 bg-ink-2/95 px-4 py-3 font-type text-[13px] leading-snug text-bone shadow-2xl backdrop-blur"
          >
            {tip}
            <button
              type="button"
              onClick={() => {
                setDismissed(true)
                try {
                  sessionStorage.setItem(`guide:${pathname}`, "off")
                } catch {}
              }}
              className="mt-2 block font-type text-[11px] uppercase tracking-[0.2em] text-bone-3 hover:text-brass"
            >
              Noted ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        aria-label={open ? "Hide Sherlock's tip" : "Ask Sherlock for a tip"}
        onClick={() => {
          setDismissed(false)
          setOpen((v) => !v)
        }}
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 16 }}
        whileHover={{ rotate: -8, scale: 1.08 }}
        className="grid h-14 w-14 place-items-center rounded-full border border-brass/50 bg-ink-2 shadow-[0_10px_30px_rgba(0,0,0,.5)] md:h-16 md:w-16"
      >
        <SherlockFace className="h-12 w-12 md:h-14 md:w-14" />
      </motion.button>
    </div>
  )
}
