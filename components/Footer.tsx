"use client"

import { profile } from "@/lib/data"
import { scrollToId } from "./SmoothScroll"

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07]">
      <div className="wrap overflow-hidden pt-12">
        <p
          aria-hidden
          className="select-none whitespace-nowrap text-center font-display text-[17vw] font-semibold leading-[0.8] tracking-tightest text-transparent [-webkit-text-stroke:1px_rgba(236,232,225,0.14)]"
        >
          Sai Pranay
        </p>
      </div>
      <div className="wrap flex flex-col items-start justify-between gap-4 py-8 font-mono text-[11px] text-bone-3 md:flex-row md:items-center">
        <span>© {new Date().getFullYear()} {profile.name}. Written, designed and engineered in Hyderabad.</span>
        <div className="flex gap-6">
          <a href={profile.resume} download className="hover:text-bone">
            Résumé
          </a>
          <button type="button" onClick={() => scrollToId("#top")} className="hover:text-bone">
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
