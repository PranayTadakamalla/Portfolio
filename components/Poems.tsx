"use client"

import { AnimatePresence, motion } from "motion/react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { LANGS, POEMS_SITE, THEMES, poems, type Lang, type Poem, type Theme } from "@/lib/poems"
import { Reveal } from "./ui/Reveal"

const EASE = [0.22, 1, 0.36, 1] as const

function scriptClass(p: Poem) {
  // Devanagari and Telugu read better a touch larger with more line height
  const nonLatin = /[ऀ-ॿఀ-౿]/.test(p.stanzas[0][0])
  return nonLatin ? "text-[1.15em] leading-[1.9]" : "leading-[1.75]"
}

function Chip({ active, onClick, children, count }: { active: boolean; onClick: () => void; children: React.ReactNode; count?: number }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`relative isolate rounded-full border px-4 py-1.5 text-[13px] transition-colors duration-300 ${
        active ? "border-brass text-ink" : "border-white/12 text-bone-2 hover:border-white/25 hover:text-bone"
      }`}
    >
      {active && <motion.span layoutId="poem-theme-pill" className="absolute inset-0 -z-10 rounded-full bg-brass" transition={{ duration: 0.45, ease: EASE }} />}
      {children}
      {count !== undefined && <span className={`ml-1.5 font-type text-[11px] ${active ? "text-ink/70" : "text-bone-3"}`}>{count}</span>}
    </button>
  )
}

function Reader({ poem, onClose, onStep, index, total }: { poem: Poem; onClose: () => void; onStep: (d: 1 | -1) => void; index: number; total: number }) {
  const panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") onStep(1)
      if (e.key === "ArrowLeft") onStep(-1)
    }
    addEventListener("keydown", onKey)
    window.__lenis?.stop()
    document.body.style.overflow = "hidden"
    panel.current?.focus()
    return () => {
      removeEventListener("keydown", onKey)
      window.__lenis?.start()
      document.body.style.overflow = ""
    }
  }, [onClose, onStep])

  return (
    <motion.div
      className="fixed inset-0 z-[160] grid place-items-center bg-ink/80 p-3 backdrop-blur-sm md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={poem.title}
    >
      <motion.div
        ref={panel}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 30, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.55, ease: EASE }}
        data-lenis-prevent
        className="relative max-h-[88svh] w-full max-w-2xl overflow-y-auto rounded-md bg-bone text-ink shadow-[0_40px_120px_-20px_rgba(0,0,0,.9)] outline-none [background-image:repeating-linear-gradient(transparent,transparent_35px,rgba(44,74,110,.12)_36px)]"
      >
        <span aria-hidden className="pointer-events-none absolute bottom-0 left-8 top-0 w-px bg-oxblood/35 md:left-12" />
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-bone/95 px-5 py-3 backdrop-blur md:px-8">
          <span className="font-type text-[11px] uppercase tracking-[0.22em] text-ink/55">
            {poem.lang} · {poem.theme} · {index + 1}/{total}
          </span>
          <button type="button" onClick={onClose} className="rounded-full border border-ink/20 px-3 py-1 font-type text-[11px] uppercase tracking-[0.18em] text-ink/70 hover:bg-ink hover:text-bone">
            Close ✕
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={poem.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="px-12 pb-10 pt-8 md:px-20 md:pb-14 md:pt-10"
          >
            <h3 className="font-display text-3xl font-semibold leading-tight md:text-4xl">{poem.title}</h3>
            {poem.subtitle && <p className="mt-2 font-serif text-lg italic text-ink/60">{poem.subtitle}</p>}
            <div className={`mt-8 space-y-6 font-serif text-[1.25rem] md:text-[1.35rem] ${scriptClass(poem)}`}>
              {poem.stanzas.map((s, i) => (
                <p key={i}>
                  {s.map((line, k) => (
                    <span key={k} className="block pl-[1.4em] -indent-[1.4em]">
                      {line}
                    </span>
                  ))}
                </p>
              ))}
            </div>
            <div className="mt-10 flex items-center justify-between gap-4 font-type text-[11px] uppercase tracking-[0.2em] text-ink/50">
              <span>— Sai Pranay Tadakamalla</span>
              {poem.unfinished && <span className="stamp scale-90 border-oxblood text-oxblood">Unfinished</span>}
            </div>
          </motion.article>
        </AnimatePresence>

        <div className="sticky bottom-0 flex items-center justify-between border-t border-ink/10 bg-bone/95 px-5 py-3 backdrop-blur md:px-8">
          <button type="button" onClick={() => onStep(-1)} className="font-type text-[12px] uppercase tracking-[0.18em] text-ink/70 hover:text-oxblood">
            ‹ Previous
          </button>
          <button type="button" onClick={() => onStep(1)} className="font-type text-[12px] uppercase tracking-[0.18em] text-ink/70 hover:text-oxblood">
            Next ›
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Poems() {
  const [theme, setTheme] = useState<Theme | "All">("All")
  const [lang, setLang] = useState<Lang | "All">("All")
  const [open, setOpen] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const list = useMemo(
    () => poems.filter((p) => (theme === "All" || p.theme === theme) && (lang === "All" || p.lang === lang)),
    [theme, lang],
  )
  const count = (fn: (p: Poem) => boolean) => poems.filter(fn).length

  const close = useCallback(() => setOpen(null), [])
  const step = useCallback((d: 1 | -1) => setOpen((i) => (i === null ? i : (i + d + list.length) % list.length)), [list.length])

  return (
    <section id="poems" className="section pt-0 md:pt-0" aria-labelledby="poems-title">
      <div className="wrap">
        <Reveal>
          <div className="flex flex-col gap-6 border-t border-white/[0.08] pt-16 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">
                <span className="text-brass">06b</span> The poems
              </span>
              <h2 id="poems-title" className="h-section mt-5">
                {poems.length} poems, <span className="serif-accent">three languages.</span>
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-bone-2">
                English, Hindi–Urdu and Telugu — love, longing, heartbreak and the self. Tap a poem to read it in full.
              </p>
            </div>
            <a
              href={POEMS_SITE}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-3 self-start rounded-full border border-brass/50 px-5 py-3 text-sm text-brass transition-colors hover:bg-brass hover:text-ink md:self-auto"
            >
              Verses in Motion ↗
            </a>
          </div>
        </Reveal>

        <div className="mt-10 flex flex-col gap-3">
          <div role="group" aria-label="Filter by theme" className="flex flex-wrap gap-2">
            <Chip active={theme === "All"} onClick={() => setTheme("All")} count={poems.length}>
              All
            </Chip>
            {THEMES.map((t) => (
              <Chip key={t} active={theme === t} onClick={() => setTheme(t)} count={count((p) => p.theme === t)}>
                {t}
              </Chip>
            ))}
          </div>
          <div role="group" aria-label="Filter by language" className="flex flex-wrap gap-2">
            {(["All", ...LANGS] as const).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
                className={`rounded-full px-3 py-1 font-type text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                  lang === l ? "bg-white/10 text-bone" : "text-bone-3 hover:text-bone"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <motion.ul layout className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p, i) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  data-cursor="read"
                  className="card group flex h-full w-full flex-col p-6 text-left transition-colors duration-500 hover:border-brass/40"
                >
                  <div className="flex items-center justify-between gap-3 font-type text-[10px] uppercase tracking-[0.2em] text-bone-3">
                    <span>{p.lang}</span>
                    <span className="text-brass/80">{p.unfinished ? "Unfinished" : p.theme}</span>
                  </div>
                  <h3 className="mt-5 font-display text-2xl leading-tight text-bone transition-colors duration-300 group-hover:text-brass-soft">{p.title}</h3>
                  {p.subtitle && <p className="mt-1 font-serif text-[15px] italic text-bone-3">{p.subtitle}</p>}
                  <div className={`mt-4 flex-1 font-serif text-[1.05rem] italic text-bone-2 ${scriptClass(p)}`}>
                    <span className="block">{p.stanzas[0][0]}</span>
                    {p.stanzas[0][1] && <span className="block">{p.stanzas[0][1]}</span>}
                  </div>
                  <span className="mt-5 font-type text-[11px] uppercase tracking-[0.2em] text-bone-3 transition-colors group-hover:text-brass">Read ›</span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        {list.length === 0 && <p className="mt-10 text-bone-3">No poems match that combination yet.</p>}
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>{open !== null && list[open] && <Reader poem={list[open]} index={open} total={list.length} onClose={close} onStep={step} />}</AnimatePresence>,
          document.body,
        )}
    </section>
  )
}
