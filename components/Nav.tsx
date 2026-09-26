"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { profile } from "@/lib/data"
import { scrollToId } from "./SmoothScroll"

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#research", label: "Research" },
  { href: "#venture", label: "221B Labs" },
  { href: "#journey", label: "Journey" },
  { href: "#projects", label: "Projects" },
  { href: "#beyond", label: "Beyond" },
  { href: "#contact", label: "Contact" },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState("")

  useEffect(() => {
    let last = scrollY
    const onScroll = () => {
      const y = scrollY
      setScrolled(y > 40)
      setHidden(y > last && y > 400 && !open)
      last = y
    }
    addEventListener("scroll", onScroll, { passive: true })
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    )
    LINKS.forEach((l) => {
      const el = document.querySelector(l.href)
      if (el) obs.observe(el)
    })
    return () => {
      removeEventListener("scroll", onScroll)
      obs.disconnect()
    }
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    if (open) window.__lenis?.stop()
    else window.__lenis?.start()
  }, [open])

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    setTimeout(() => scrollToId(href), open ? 350 : 0)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-transform duration-500 ${hidden ? "-translate-y-full" : ""}`}
      >
        <div className="wrap flex items-center justify-between py-4 md:py-5">
          <a
            href="#top"
            onClick={go("#top")}
            className="group flex items-center gap-3"
            aria-label="Sai Pranay Tadakamalla, back to top"
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-full border border-saffron/60 font-display text-[13px] font-semibold text-bone">
              SP
              <span className="absolute inset-0 animate-ping rounded-full border border-saffron/30 [animation-duration:3s]" />
            </span>
            <span className="hidden font-display text-sm tracking-tight text-bone-2 transition-colors group-hover:text-bone sm:block">
              Sai Pranay Tadakamalla
            </span>
          </a>

          <nav
            aria-label="Primary"
            className={`hidden items-center gap-1 rounded-full border px-2 py-1.5 transition-all duration-500 lg:flex ${
              scrolled ? "border-white/10 bg-ink/70 backdrop-blur-xl" : "border-transparent"
            }`}
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={go(l.href)}
                className={`relative isolate rounded-full px-4 py-1.5 text-[13px] transition-colors ${
                  active === l.href ? "text-ink" : "text-bone-2 hover:text-bone"
                }`}
              >
                {active === l.href && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-bone" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={profile.resume}
              download
              className="hidden rounded-full border border-white/15 px-4 py-2 text-[13px] text-bone transition-colors hover:border-saffron hover:text-saffron sm:inline-flex"
            >
              Résumé ↓
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-ink/60 backdrop-blur lg:hidden"
            >
              <span className={`absolute h-px w-5 bg-bone transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1"}`} />
              <span className={`absolute h-px w-5 bg-bone transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1"}`} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[99] flex flex-col justify-between bg-ink/95 px-[var(--gutter)] pb-10 pt-28 backdrop-blur-2xl lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 2.6rem) 2.6rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.6rem) 2.6rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.6rem) 2.6rem)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={go(l.href)}
                  className="flex items-baseline gap-4 border-b border-white/[0.07] py-3 font-display text-[9vw] leading-none tracking-tight text-bone sm:text-5xl"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <span className="font-mono text-xs text-saffron">0{i + 1}</span>
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <div className="flex flex-wrap gap-3 font-mono text-xs text-bone-2">
              <a href={profile.resume} download className="rounded-full border border-white/15 px-4 py-2">Résumé ↓</a>
              <a href={`mailto:${profile.email}`} className="rounded-full border border-white/15 px-4 py-2">Email</a>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2">LinkedIn</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
