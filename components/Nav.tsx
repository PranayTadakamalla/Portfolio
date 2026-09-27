"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { profile } from "@/lib/data"

export const PAGES = [
  { href: "/about", label: "About", no: "01" },
  { href: "/research", label: "Research", no: "02" },
  { href: "/labs", label: "221B Labs", no: "03" },
  { href: "/projects", label: "Projects", no: "04" },
  { href: "/journey", label: "Journey", no: "05" },
  { href: "/writing", label: "Writing", no: "06" },
  { href: "/contact", label: "Contact", no: "07" },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let last = scrollY
    const onScroll = () => {
      const y = scrollY
      setScrolled(y > 40)
      setHidden(y > last && y > 400)
      last = y
    }
    addEventListener("scroll", onScroll, { passive: true })
    return () => removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    if (open) window.__lenis?.stop()
    else window.__lenis?.start()
  }, [open])

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-[100] transition-transform duration-500 ${hidden && !open ? "-translate-y-full" : ""}`}>
        <div className="wrap flex items-center justify-between py-4 md:py-5">
          <Link href="/" className="group flex items-center gap-3" aria-label="Sai Pranay Tadakamalla, home">
            <span className="relative grid h-10 w-10 place-items-center rounded-full border border-brass/60 bg-ink/60 font-display text-[13px] font-bold text-brass backdrop-blur">
              221B
            </span>
            <span className="hidden font-display text-[15px] text-bone-2 transition-colors group-hover:text-bone sm:block">
              Sai Pranay Tadakamalla
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className={`hidden items-center gap-1 rounded-full border px-2 py-1.5 transition-all duration-500 xl:flex ${
              scrolled ? "border-white/10 bg-ink/75 backdrop-blur-xl" : "border-transparent"
            }`}
          >
            {PAGES.map((l) => {
              const active = pathname === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative isolate rounded-full px-4 py-1.5 text-[13px] transition-colors ${active ? "text-ink" : "text-bone-2 hover:text-bone"}`}
                >
                  {active && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-brass" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                  )}
                  {l.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={profile.resume}
              download
              className="hidden rounded-full border border-white/15 px-4 py-2 text-[13px] text-bone transition-colors hover:border-brass hover:text-brass sm:inline-flex"
            >
              Résumé ↓
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-ink/60 backdrop-blur xl:hidden"
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
            className="fixed inset-0 z-[99] flex flex-col justify-between bg-ink/95 px-[var(--gutter)] pb-10 pt-28 backdrop-blur-2xl xl:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 2.6rem) 2.6rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.6rem) 2.6rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.6rem) 2.6rem)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {[{ href: "/", label: "Home", no: "00" }, ...PAGES].map((l, i) => (
                <motion.div key={l.href} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12 + i * 0.045 }}>
                  <Link
                    href={l.href}
                    aria-current={pathname === l.href ? "page" : undefined}
                    className={`flex items-baseline gap-4 border-b border-white/[0.07] py-2.5 font-display text-[8.5vw] leading-none sm:text-5xl ${
                      pathname === l.href ? "text-brass" : "text-bone"
                    }`}
                  >
                    <span className="font-type text-xs text-brass">{l.no}</span>
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="flex flex-wrap gap-3 font-type text-xs text-bone-2">
              <a href={profile.resume} download className="rounded-full border border-white/15 px-4 py-2">Résumé ↓</a>
              <a href={`mailto:${profile.email}`} className="rounded-full border border-white/15 px-4 py-2">Email</a>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2">LinkedIn</a>
              <a href={profile.links.instagram} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2">Instagram</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
