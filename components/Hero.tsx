"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { profile } from "@/lib/data"
import { SplitWords } from "./ui/Reveal"
import Magnetic from "./ui/Magnetic"
import { SherlockFace } from "./Guide"

const SherlockScene = dynamic(() => import("./three/SherlockScene"), { ssr: false })

function useLoaded() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    if ((window as unknown as { __loaded?: boolean }).__loaded) setLoaded(true)
    const on = () => setLoaded(true)
    window.addEventListener("loader:done", on)
    return () => window.removeEventListener("loader:done", on)
  }, [])
  return loaded
}

function Clock() {
  const [t, setT] = useState("")
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Kolkata" })
    const id = setInterval(() => setT(f.format(new Date())), 1000)
    setT(f.format(new Date()))
    return () => clearInterval(id)
  }, [])
  return <span className="tabular-nums">{t || "--:--:--"} IST</span>
}

export default function Hero() {
  const loaded = useLoaded()
  const section = useRef<HTMLElement>(null)
  const [active, setActive] = useState(true)
  const [lite, setLite] = useState(false)
  const [wide, setWide] = useState(true)
  const [webgl, setWebgl] = useState<boolean | null>(null)
  const [role, setRole] = useState(0)
  const [line, setLine] = useState<string | null>(null)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const measure = () => setWide(window.innerWidth >= 1024)
    measure()
    addEventListener("resize", measure)
    setLite(window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4)
    try {
      const c = document.createElement("canvas")
      setWebgl(!reduce && !!(c.getContext("webgl2") || c.getContext("webgl")))
    } catch {
      setWebgl(false)
    }
    const obs = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 })
    if (section.current) obs.observe(section.current)
    const id = setInterval(() => setRole((r) => (r + 1) % profile.roles.length), 2600)
    return () => {
      obs.disconnect()
      removeEventListener("resize", measure)
      clearInterval(id)
    }
  }, [])

  return (
    <section ref={section} id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden" aria-label="Introduction">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[70vh] w-[70vh] rounded-full bg-brass/[0.10] blur-[150px]" />
        <div className="absolute bottom-0 right-[10%] h-[50vh] w-[50vh] rounded-full bg-scarf-deep/[0.25] blur-[150px]" />
      </div>

      {/* Sherlock: full-bleed on desktop (camera offset puts him right), a stage above the text on mobile */}
      <motion.div
        className="relative h-[50svh] w-full lg:absolute lg:inset-0 lg:h-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 1.6, delay: 0.3 }}
      >
        {webgl ? (
          <SherlockScene active={active} lite={lite} offsetX={wide ? 1.75 : 0} onSay={setLine} />
        ) : webgl === false ? (
          <div className="grid h-full place-items-center lg:justify-end lg:pr-[14%]">
            <SherlockFace className="h-48 w-48 drop-shadow-[0_0_60px_rgba(212,169,79,.35)] md:h-72 md:w-72" />
          </div>
        ) : null}
        <div
          role="status"
          aria-live="polite"
          className={`pointer-events-none absolute left-1/2 top-[8%] w-max max-w-[230px] rounded-2xl rounded-bl-sm border border-brass/40 bg-ink-2/95 px-4 py-2.5 font-type text-[13px] leading-snug text-bone shadow-2xl transition-all duration-500 lg:left-[68%] lg:top-[16%] ${
            line ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-90 opacity-0"
          }`}
        >
          {line}
        </div>
      </motion.div>

      <div className="wrap pointer-events-none relative z-10 -mt-10 flex flex-1 flex-col justify-end pb-8 lg:mt-0 lg:justify-center lg:pb-0 lg:pt-24">
        <div className="pointer-events-auto max-w-[40rem]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 flex flex-wrap items-center gap-3"
          >
            <span className="tag-file">Case file · 221B</span>
            <span className="chip border-brass/40 text-brass">Founder &amp; CEO · 221B Labs</span>
          </motion.div>

          <h1 className="h-display text-[clamp(3rem,8.6vw,7.6rem)]">
            {loaded ? (
              <>
                <SplitWords text={profile.first} immediate delay={0.15} stagger={0.08} />
                <br />
                <span className="serif-accent font-semibold">
                  <SplitWords text={profile.last} immediate delay={0.3} />
                </span>
              </>
            ) : (
              <span className="opacity-0">{profile.name}</span>
            )}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-7 grid gap-6"
          >
            <div>
              <p className="sr-only">{profile.roles.join(", ")}.</p>
              <div aria-hidden className="relative h-[1.35em] overflow-hidden font-serif text-2xl font-semibold italic text-brass md:text-3xl">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={role}
                    className="absolute left-0 top-0 block"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                  >
                    {profile.roles[role]}
                  </motion.span>
                </AnimatePresence>
              </div>
              <p className="mt-2 font-display text-xl text-bone-2 md:text-2xl">{profile.tagline}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <Link
                  href="/research"
                  data-cursor="open"
                  className="group inline-flex items-center gap-3 rounded-full bg-brass px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-bone"
                >
                  Open the case files
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-bone transition-transform group-hover:rotate-45">↗</span>
                </Link>
              </Magnetic>
              <Magnetic>
                <a
                  href={profile.resume}
                  download
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-ink/40 px-6 py-3.5 text-sm text-bone backdrop-blur transition-colors hover:border-brass hover:text-brass"
                >
                  Download résumé ↓
                </a>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ delay: 1.1, duration: 1 }}
        className="wrap relative z-10 grid grid-cols-2 gap-4 border-t border-white/[0.07] py-5 font-type text-[12px] uppercase tracking-[0.18em] text-bone-3 md:grid-cols-4"
      >
        <span>{profile.location}</span>
        <Clock />
        <span className="hidden md:block">Currently · Pathana Sakthi</span>
        <span className="hidden justify-self-end text-bone-2 md:block">Click Sherlock ✦</span>
      </motion.div>
    </section>
  )
}
