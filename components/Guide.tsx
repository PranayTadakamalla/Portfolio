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
  "/writing": "Tap any poem to read it in full. Arrow keys turn the page.",
  "/contact": "One click copies the email. Elementary.",
}

// The detective's silhouette (from the hero model), in brass.
export function SherlockFace({ className = "" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/models/sherlock-silhouette.webp" alt="" aria-hidden className={`object-contain ${className}`} />
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
        <SherlockFace className="h-10 w-10 translate-y-0.5 md:h-12 md:w-12" />
      </motion.button>
    </div>
  )
}
