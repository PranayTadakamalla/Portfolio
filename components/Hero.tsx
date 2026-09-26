"use client"

import dynamic from "next/dynamic"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { profile } from "@/lib/data"
import { SplitWords } from "./ui/Reveal"
import Magnetic from "./ui/Magnetic"
import { scrollToId } from "./SmoothScroll"

const HeroScene = dynamic(() => import("./three/HeroScene"), { ssr: false })

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
  const scroll = useRef(0)
  const [active, setActive] = useState(true)
  const [lite, setLite] = useState(false)
  const [webgl, setWebgl] = useState(false)
  const [role, setRole] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setLite(window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4)
    try {
      const c = document.createElement("canvas")
      setWebgl(!reduce && !!(c.getContext("webgl2") || c.getContext("webgl")))
    } catch {
      setWebgl(false)
    }
    const obs = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 })
    if (section.current) obs.observe(section.current)
    const onScroll = () => {
      scroll.current = Math.min(1, window.scrollY / window.innerHeight)
    }
    addEventListener("scroll", onScroll, { passive: true })
    const id = setInterval(() => setRole((r) => (r + 1) % profile.roles.length), 2600)
    return () => {
      obs.disconnect()
      removeEventListener("scroll", onScroll)
      clearInterval(id)
    }
  }, [])

  return (
    <section ref={section} id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden" aria-label="Introduction">
      {/* backdrop: aurora glow + 3D field */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-[60vh] w-[60vh] rounded-full bg-saffron/[0.13] blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[50vh] w-[50vh] rounded-full bg-glacier/[0.08] blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(236,232,225,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(236,232,225,.5) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse at 60% 45%, #000 20%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at 60% 45%, #000 20%, transparent 70%)",
          }}
        />
      </div>
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 2, delay: 0.2 }}
      >
        {webgl ? (
          <HeroScene active={active} scroll={scroll} lite={lite} />
        ) : (
          <div aria-hidden className="absolute right-[8%] top-1/2 h-[46vmin] w-[46vmin] -translate-y-1/2 rounded-full border border-saffron/40 shadow-[0_0_120px_rgba(255,138,61,.25)_inset]" />
        )}
      </motion.div>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[70%] bg-gradient-to-t from-ink via-ink/80 to-transparent md:hidden" />
      <div className="wrap relative z-10 flex flex-1 flex-col justify-end pb-10 pt-32 md:justify-center md:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-6 flex flex-wrap items-center gap-3"
        >
          <span className="chip border-saffron/40 text-saffron">
            <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-saffron" />
            Founder &amp; CEO · 221B Labs
          </span>
          <span className="chip">4 papers on SSRN</span>
        </motion.div>

        <h1 className="h-display max-w-[14ch] text-[clamp(3.1rem,10.5vw,9.5rem)]">
          {loaded ? (
            <>
              <SplitWords text={profile.first} immediate delay={0.15} stagger={0.08} />
              <br />
              <span className="text-bone/90">
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
          className="mt-8 grid max-w-2xl gap-6"
        >
          <p className="font-display text-xl text-bone-2 md:text-2xl">
            <span className="text-bone">
              <span className="sr-only">{profile.roles.join(", ")}. </span>
              <span aria-hidden className="relative inline-flex h-[1.3em] min-w-[9ch] overflow-hidden align-bottom">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={role}
                    className="serif-accent block text-[1.15em]"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                  >
                    {profile.roles[role]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>{" "}
            — {profile.tagline}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#research"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId("#research")
                }}
                data-cursor="go"
                className="group inline-flex items-center gap-3 rounded-full bg-bone px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-saffron"
              >
                Explore the work
                <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-bone transition-transform group-hover:rotate-45">↗</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={profile.resume}
                download
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm text-bone backdrop-blur transition-colors hover:border-saffron hover:text-saffron"
              >
                Download résumé ↓
              </a>
            </Magnetic>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ delay: 1.1, duration: 1 }}
        className="wrap relative z-10 grid grid-cols-2 gap-4 border-t border-white/[0.07] py-5 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3 md:grid-cols-4"
      >
        <span>{profile.location}</span>
        <Clock />
        <span className="hidden md:block">Currently · Pathana Sakthi</span>
        <button
          type="button"
          onClick={() => scrollToId("#about")}
          className="hidden items-center gap-3 justify-self-end text-bone-2 hover:text-bone md:flex"
        >
          Scroll
          <span className="relative block h-8 w-[1px] overflow-hidden bg-white/15">
            <motion.span
              className="absolute left-0 top-0 block h-3 w-full bg-saffron"
              animate={{ y: [-12, 32] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </button>
      </motion.div>
    </section>
  )
}
