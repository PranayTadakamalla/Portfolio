"use client"

import { AnimatePresence, motion, useAnimationControls } from "motion/react"
import { useEffect, useMemo, useRef, useState } from "react"

const DEDUCTIONS = [
  "Dusting the keyboard for prints…",
  "Reading four papers on SSRN…",
  "Inspecting 221B Labs…",
  "Cross-referencing GitHub…",
  "Tuning the violin…",
  "Eliminating the impossible…",
]

type Phase = "scan" | "stamp" | "door" | "open" | "done"

// Deterministic fingerprint: nested, slightly wobbly loops open at the bottom, with a few broken ridges.
function useFingerprint() {
  return useMemo(() => {
    let seed = 221
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    const paths: string[] = []
    const N = 22
    for (let k = 0; k < N; k++) {
      const rx = 5 + k * 3.9
      const ry = 7 + k * 5.1
      const cx = 100
      const cy = 104 - k * 0.9
      const gap = k < 3 ? 0.4 : 0.9 + k * 0.035
      const start = Math.PI / 2 + gap / 2
      const span = Math.PI * 2 - gap
      const segs = k > 6 && rnd() > 0.55 ? 2 : 1
      const cut = 0.25 + rnd() * 0.5
      for (let s = 0; s < segs; s++) {
        const a0 = segs === 1 ? 0 : s === 0 ? 0 : cut + 0.04
        const a1 = segs === 1 ? 1 : s === 0 ? cut : 1
        const pts: string[] = []
        for (let i = 0; i <= 90; i++) {
          const u = a0 + (a1 - a0) * (i / 90)
          const th = start + span * u
          const wob = 1 + 0.035 * Math.sin(3 * th + k * 0.7) + 0.018 * Math.sin(7 * th + k)
          pts.push(`${(cx + Math.cos(th) * rx * wob).toFixed(1)},${(cy + Math.sin(th) * ry * wob).toFixed(1)}`)
        }
        paths.push(`M${pts.join("L")}`)
      }
    }
    return paths
  }, [])
}

function Fingerprint({ paths, progress, color, width = 1.25 }: { paths: string[]; progress: number; color: string; width?: number }) {
  return (
    <g fill="none" stroke={color} strokeWidth={width} strokeLinecap="round">
      {paths.map((d, i) => {
        const start = (i / paths.length) * 0.85
        const local = Math.min(1, Math.max(0, (progress - start) / 0.15))
        return <path key={i} d={d} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - local} opacity={0.35 + 0.65 * local} />
      })}
    </g>
  )
}

function Door({ side }: { side: "left" | "right" }) {
  const left = side === "left"
  return (
    <div
      className="relative h-full w-full overflow-hidden border-brass/20 bg-[linear-gradient(90deg,#16110d,#1d1611_40%,#140f0b)]"
      style={{ borderRight: left ? "1px solid rgba(0,0,0,.6)" : undefined, borderLeft: left ? undefined : "1px solid rgba(0,0,0,.6)" }}
    >
      {/* raised panels */}
      <div className="absolute inset-[7%] grid grid-rows-[1fr_1.4fr] gap-[6%]">
        {[0, 1].map((r) => (
          <div key={r} className="rounded-sm border border-brass/15 shadow-[inset_0_0_0_6px_rgba(0,0,0,.35),inset_0_0_40px_rgba(0,0,0,.6)]" />
        ))}
      </div>
      {/* split brass plaque */}
      <div className={`absolute top-[16%] ${left ? "left-full" : "left-0"} -translate-x-1/2`}>
        <div className="rounded-md border border-brass-deep bg-[linear-gradient(180deg,#e6c77f,#b58a36_55%,#8c6a2a)] px-6 py-2 font-display text-[clamp(2.4rem,7vw,5rem)] font-bold leading-none tracking-tight text-ink shadow-[0_8px_30px_rgba(0,0,0,.6)]">
          221B
        </div>
      </div>
      {/* knocker */}
      {!left && (
        <div className="absolute left-[10%] top-[45%] grid place-items-center">
          <div className="h-5 w-5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#f0d58f,#8c6a2a)]" />
          <div className="-mt-1 h-12 w-12 rounded-full border-[5px] border-[#b58a36] shadow-[0_4px_12px_rgba(0,0,0,.6)]" />
        </div>
      )}
      <div className={`absolute top-1/2 h-3 w-3 rounded-full bg-[radial-gradient(circle_at_35%_35%,#f0d58f,#8c6a2a)] ${left ? "right-[6%]" : "left-[6%]"}`} />
    </div>
  )
}

export default function Loader() {
  const paths = useFingerprint()
  const [phase, setPhase] = useState<Phase>("scan")
  const [progress, setProgress] = useState(0)
  const [lens, setLens] = useState({ x: 100, y: 100 })
  const [line, setLine] = useState(0)
  const [typed, setTyped] = useState("")
  const shake = useAnimationControls()
  const skipRef = useRef(false)

  const finish = () => {
    if (skipRef.current) return
    skipRef.current = true
    setPhase("open")
    // "fresh" suppresses the page iris until the first real navigation (the door already did the reveal)
    document.documentElement.classList.add("seen", "fresh")
    try {
      sessionStorage.setItem("seen221b", "1")
    } catch {}
    document.body.classList.remove("is-loading")
    window.dispatchEvent(new Event("loader:done"))
    ;(window as unknown as { __loaded?: boolean }).__loaded = true
    setTimeout(() => setPhase("done"), 1400)
  }

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem("seen221b") === "1"
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (seen || reduce) {
      skipRef.current = true
      document.documentElement.classList.add("seen")
      setPhase("done")
      ;(window as unknown as { __loaded?: boolean }).__loaded = true
      window.dispatchEvent(new Event("loader:done"))
      try {
        sessionStorage.setItem("seen221b", "1")
      } catch {}
      return
    }
    document.body.classList.add("is-loading")
    const start = performance.now()
    const MIN = 3000
    let loaded = document.readyState === "complete"
    const onLoad = () => (loaded = true)
    window.addEventListener("load", onLoad)
    let raf = 0
    const tick = (now: number) => {
      const el = now - start
      const t = Math.min(1, el / MIN)
      const eased = 1 - Math.pow(1 - t, 2.2)
      setProgress((p) => Math.max(p, loaded ? eased : Math.min(eased, 0.94)))
      // lens drifts in a lissajous over the print
      setLens({ x: 100 + Math.sin(el / 520) * 42, y: 100 + Math.sin(el / 380 + 1) * 48 })
      if (t >= 1 && loaded) {
        setProgress(1)
        setPhase("stamp")
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const lines = setInterval(() => setLine((l) => (l + 1) % DEDUCTIONS.length), 620)
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(lines)
      window.removeEventListener("load", onLoad)
    }
  }, [])

  // stamp → type the name → close the door → open it
  useEffect(() => {
    if (phase !== "stamp") return
    shake.start({ x: [0, -10, 8, -5, 3, 0], y: [0, 6, -4, 2, 0], transition: { duration: 0.45, delay: 0.18 } })
    const name = "Sai Pranay Tadakamalla"
    let i = 0
    const id = setInterval(() => {
      i++
      setTyped(name.slice(0, i))
      if (i >= name.length) clearInterval(id)
    }, 38)
    const toDoor = setTimeout(() => setPhase("door"), 1500)
    return () => {
      clearInterval(id)
      clearTimeout(toDoor)
    }
  }, [phase, shake])

  useEffect(() => {
    if (phase !== "door") return
    const id = setTimeout(finish, 900)
    return () => clearTimeout(id)
  }, [phase])

  if (phase === "done") return null
  const pct = Math.round(progress * 100)
  const showScene = phase === "scan" || phase === "stamp"

  return (
    <div className="loader-root fixed inset-0 z-[150]" data-phase={phase} role="status" aria-live="polite" aria-label={`Opening case file, ${pct}%`}>
      <AnimatePresence>
        {showScene && (
          <motion.div
            key="scene"
            animate={shake}
            exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.5 } }}
            className="absolute inset-0 flex flex-col justify-between overflow-hidden bg-ink px-[var(--gutter)] py-7"
          >
            <div className="fog !absolute" aria-hidden />
            <div className="relative flex items-center justify-between font-type text-[12px] uppercase tracking-[0.25em] text-bone-3">
              <span>Case file No. 221B</span>
              <button type="button" onClick={finish} className="rounded-full border border-white/15 px-3 py-1 text-bone-2 hover:border-brass hover:text-brass">
                Skip ›
              </button>
            </div>

            <div className="relative mx-auto grid place-items-center">
              <svg viewBox="0 0 200 200" className="h-[min(62vw,340px)] w-[min(62vw,340px)] overflow-visible" aria-hidden>
                <defs>
                  <clipPath id="lens-clip">
                    <circle cx={lens.x} cy={lens.y} r="30" />
                  </clipPath>
                  <radialGradient id="lens-glow">
                    <stop offset="0.6" stopColor="#d4a94f" stopOpacity="0" />
                    <stop offset="1" stopColor="#d4a94f" stopOpacity="0.18" />
                  </radialGradient>
                </defs>
                <Fingerprint paths={paths} progress={progress} color="rgba(239,228,207,.55)" />
                {/* magnified copy under the lens */}
                <g clipPath="url(#lens-clip)">
                  <rect width="200" height="200" fill="#17120e" />
                  <g transform={`translate(${lens.x} ${lens.y}) scale(1.9) translate(${-lens.x} ${-lens.y})`}>
                    <Fingerprint paths={paths} progress={progress} color="#e6c77f" width={0.9} />
                  </g>
                  <circle cx={lens.x} cy={lens.y} r="30" fill="url(#lens-glow)" />
                </g>
                {showScene && phase === "scan" && (
                  <g>
                    <circle cx={lens.x} cy={lens.y} r="31" fill="none" stroke="#d4a94f" strokeWidth="3.2" />
                    <circle cx={lens.x} cy={lens.y} r="33.5" fill="none" stroke="#8c6a2a" strokeWidth="1.2" />
                    <line
                      x1={lens.x + 22}
                      y1={lens.y + 22}
                      x2={lens.x + 50}
                      y2={lens.y + 50}
                      stroke="#3a2414"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />
                    <path d={`M${lens.x - 16} ${lens.y - 18} q 8 -6 18 -4`} stroke="rgba(255,255,255,.5)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                  </g>
                )}
              </svg>

              <AnimatePresence>
                {phase === "stamp" && (
                  <motion.div
                    className="absolute inset-0 grid place-items-center"
                    initial={{ scale: 2.8, opacity: 0, rotate: -4 }}
                    animate={{ scale: 1, opacity: 1, rotate: -12 }}
                    transition={{ type: "spring", stiffness: 520, damping: 22 }}
                  >
                    <span className="stamp bg-ink/40 px-5 py-2 text-[clamp(1.4rem,5vw,2.6rem)]">Identified</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative flex items-end justify-between gap-6">
              <div className="min-h-[4.5rem] max-w-[60%]">
                {phase === "scan" ? (
                  <>
                    <p className="font-type text-[11px] uppercase tracking-[0.25em] text-brass">Examining the evidence</p>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={line}
                        className="mt-2 font-type text-sm text-bone-2 md:text-base"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                      >
                        {DEDUCTIONS[line]}
                      </motion.p>
                    </AnimatePresence>
                  </>
                ) : (
                  <>
                    <p className="font-type text-[11px] uppercase tracking-[0.25em] text-brass">Consulting engineer</p>
                    <p className="mt-2 font-display text-2xl text-bone md:text-4xl">
                      {typed}
                      <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-brass align-middle">&nbsp;</span>
                    </p>
                  </>
                )}
              </div>
              <p className="font-display text-[clamp(3.5rem,12vw,8rem)] font-semibold leading-none tabular-nums text-bone">
                {pct}
                <span className="text-[0.4em] text-bone-3">%</span>
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/5">
              <div className="h-full bg-brass" style={{ width: `${pct}%` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 221B door: closes over the case file, then swings open onto the site */}
      {(phase === "door" || phase === "open" || phase === "stamp") && (
        <div className="pointer-events-none absolute inset-0 flex [perspective:1600px]">
          {(["left", "right"] as const).map((side) => (
            <motion.div
              key={side}
              className="h-full w-1/2"
              style={{ transformOrigin: side === "left" ? "left center" : "right center" }}
              initial={{ x: side === "left" ? "-100%" : "100%" }}
              animate={
                phase === "stamp"
                  ? { x: side === "left" ? "-100%" : "100%" }
                  : phase === "door"
                    ? { x: "0%", rotateY: 0 }
                    : { x: "0%", rotateY: side === "left" ? 105 : -105, opacity: 0 }
              }
              transition={
                phase === "open"
                  ? { rotateY: { duration: 1.2, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.4, delay: 0.9 } }
                  : { duration: 0.55, ease: [0.76, 0, 0.24, 1] }
              }
            >
              <Door side={side} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
