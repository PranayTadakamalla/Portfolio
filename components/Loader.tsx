"use client"

import { useEffect, useState } from "react"

// Total runtime of the CSS sequence in globals.css (.ld-*). Everything animates on the
// compositor, so the loader keeps moving even while the page is busy hydrating.
const DURATION = 4600

export default function Loader() {
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const done = () => {
      document.documentElement.classList.add("seen", "fresh")
      document.body.classList.remove("is-loading")
      try {
        sessionStorage.setItem("seen221b", "1")
      } catch {}
      ;(window as unknown as { __loaded?: boolean }).__loaded = true
      window.dispatchEvent(new Event("loader:done"))
    }
    if (document.documentElement.classList.contains("seen")) {
      setGone(true)
      done()
      return
    }
    document.body.classList.add("is-loading")
    const hand = setTimeout(done, DURATION - 700) // let the page start fading in under the exit
    const remove = setTimeout(() => setGone(true), DURATION + 200)
    const skip = () => {
      document.documentElement.classList.add("ld-skip")
      clearTimeout(hand)
      clearTimeout(remove)
      done()
      setTimeout(() => setGone(true), 700)
    }
    window.addEventListener("loader:skip", skip)
    return () => {
      clearTimeout(hand)
      clearTimeout(remove)
      window.removeEventListener("loader:skip", skip)
    }
  }, [])

  if (gone) return null

  const name = "Sai Pranay Tadakamalla"
  return (
    <div className="loader-root ld-root fixed inset-0 z-[150] grid place-items-center bg-ink" role="status" aria-label="Loading">
      <div className="fog !absolute" aria-hidden />
      <div className="relative flex w-full max-w-4xl flex-col items-center px-6">
        <p className="ld-kicker font-type text-[12px] uppercase tracking-[0.3em] text-bone-3">Case file No. 221B</p>

        <div className="ld-stage relative mt-8 w-full">
          <h2 className="ld-name text-center font-display text-[clamp(2rem,6vw,4.6rem)] font-semibold leading-[1.05] tracking-tight" aria-label={name}>
            {/* letters live inside word groups, so a line only ever breaks between words */}
            {name.split(" ").map((word, w, words) => {
              const offset = words.slice(0, w).join(" ").length + (w ? 1 : 0)
              return (
                <span key={w} aria-hidden className="inline-block whitespace-nowrap">
                  {word.split("").map((c, k) => (
                    <span key={k} className="ld-ch" style={{ ["--i" as string]: offset + k }}>
                      {c}
                    </span>
                  ))}
                  {w < words.length - 1 && <span className="inline-block w-[0.28em]" />}
                </span>
              )
            })}
          </h2>
          {/* magnifying glass that draws itself, then glides across the name */}
          <svg className="ld-glass pointer-events-none absolute left-0 top-1/2" viewBox="0 0 120 120" aria-hidden>
            <circle cx="46" cy="46" r="34" fill="rgba(212,169,79,.06)" stroke="#d4a94f" strokeWidth="5" pathLength={1} className="ld-draw" />
            <line x1="71" y1="71" x2="108" y2="108" stroke="#8c6a2a" strokeWidth="11" strokeLinecap="round" pathLength={1} className="ld-draw ld-draw-2" />
            <path d="M28 32 q8 -8 20 -6" stroke="rgba(255,255,255,.55)" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        <p className="ld-sub mt-6 font-serif text-xl italic text-bone-2 md:text-2xl">Consulting engineer · 221B Labs</p>

        <div className="mt-12 flex w-full max-w-md items-center gap-4">
          <div className="h-px flex-1 overflow-hidden bg-white/10">
            <div className="ld-bar h-full origin-left bg-brass" />
          </div>
          <span className="ld-count w-12 text-right font-type text-sm tabular-nums text-bone-2" aria-hidden />
        </div>
      </div>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event("loader:skip"))}
        className="absolute right-[var(--gutter)] top-7 rounded-full border border-white/15 px-3 py-1 font-type text-[12px] uppercase tracking-[0.2em] text-bone-2 transition-colors hover:border-brass hover:text-brass"
      >
        Skip ›
      </button>
    </div>
  )
}
