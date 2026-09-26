"use client"

import { motion, useScroll, useTransform } from "motion/react"
import { useEffect, useMemo, useRef, useState } from "react"
import { venture, quotes } from "@/lib/data"
import SectionHeader from "./ui/SectionHeader"
import { Reveal, SplitWords } from "./ui/Reveal"

function Ticket() {
  // Deterministic QR-like matrix (decorative).
  const cells = useMemo(() => {
    let s = 221
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    return Array.from({ length: 21 * 21 }, (_, i) => {
      const x = i % 21
      const y = Math.floor(i / 21)
      const finder = (cx: number, cy: number) => x >= cx && x < cx + 7 && y >= cy && y < cy + 7
      if (finder(0, 0) || finder(14, 0) || finder(0, 14)) {
        const lx = x >= 14 ? x - 14 : x
        const ly = y >= 14 ? y - 14 : y
        return lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4)
      }
      return rnd() > 0.52
    })
  }, [])
  return (
    <div className="relative mx-auto w-full max-w-[340px] [perspective:900px]">
      <motion.div
        className="relative flex overflow-hidden rounded-2xl bg-bone text-ink shadow-[0_30px_80px_-20px_rgba(212,169,79,.45)]"
        initial={{ rotateX: 18, rotateZ: -6, y: 30, opacity: 0 }}
        whileInView={{ rotateX: 8, rotateZ: -4, y: 0, opacity: 1 }}
        viewport={{ once: true }}
        whileHover={{ rotateX: 0, rotateZ: 0, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 90, damping: 14 }}
      >
        <div className="flex-1 p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink/60">Festora · Admit one</p>
          <p className="mt-2 font-display text-2xl font-semibold leading-none tracking-tight">MALCON ’26</p>
          <p className="mt-1 text-[11px] text-ink/70">Entry + two-day meal pass</p>
          <div className="mt-5 flex gap-4 font-mono text-[9px] uppercase text-ink/60">
            <span>
              Gate
              <br />
              <b className="text-[13px] text-ink">A</b>
            </span>
            <span>
              Status
              <br />
              <b className="text-[13px] text-emerald-700">Verified</b>
            </span>
          </div>
        </div>
        <div className="relative border-l-2 border-dashed border-ink/20 p-4">
          <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full bg-ink-2" />
          <span className="absolute -bottom-2.5 -left-2.5 h-5 w-5 rounded-full bg-ink-2" />
          <div className="relative grid grid-cols-[repeat(21,1fr)] gap-0 overflow-hidden" style={{ width: 96, height: 96 }} aria-hidden>
            {cells.map((on, i) => (
              <span key={i} className={on ? "bg-ink" : ""} />
            ))}
            <motion.span
              className="absolute inset-x-0 h-6 bg-gradient-to-b from-transparent via-brass/70 to-transparent"
              animate={{ top: ["-20%", "100%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const READ = ["పఠన", "శక్తి", "·", "The", "cat", "sat", "on", "the", "mat."]

function ReadAlong() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % (READ.length + 2)), 520)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="mx-auto w-full max-w-[380px] rounded-2xl border border-white/10 bg-ink/80 p-5 backdrop-blur">
      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-bone-3">
        <span>Listening</span>
        <span className="flex items-center gap-1.5 text-scarf">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-scarf" /> offline
        </span>
      </div>
      <div className="mt-4 flex h-14 items-center gap-[3px]" aria-hidden>
        {Array.from({ length: 42 }).map((_, k) => (
          <motion.span
            key={k}
            className="w-full rounded-full bg-scarf/70"
            animate={{ height: ["18%", `${25 + ((k * 37) % 70)}%`, "22%"] }}
            transition={{ duration: 0.9 + (k % 5) * 0.12, repeat: Infinity, delay: k * 0.03, ease: "easeInOut" }}
          />
        ))}
      </div>
      <p className="mt-4 flex flex-wrap gap-x-2 gap-y-1 font-display text-2xl leading-snug">
        {READ.map((w, k) => (
          <span
            key={k}
            className={`rounded-md px-1 transition-colors duration-300 ${
              k < i ? "text-bone" : "text-bone-3/60"
            } ${k === i - 1 ? "bg-brass/20 text-brass" : ""}`}
          >
            {w}
          </span>
        ))}
      </p>
      <p className="mt-3 font-mono text-[10px] text-bone-3">Word-level scoring · CTC forced alignment</p>
    </div>
  )
}

export default function Venture() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const x = useTransform(scrollYProgress, [0, 1], ["8%", "-28%"])

  return (
    <section ref={ref} id="venture" className="section overflow-hidden" aria-labelledby="venture-title">
      <motion.div
        aria-hidden
        style={{ x }}
        className="pointer-events-none absolute left-0 top-10 select-none whitespace-nowrap font-display text-[28vw] font-semibold leading-none tracking-tightest text-transparent [-webkit-text-stroke:1px_rgba(239,228,207,0.06)]"
      >
        221B LABS · 221B LABS
      </motion.div>
      <div className="wrap relative">
        <div id="venture-title">
          <SectionHeader index="03" eyebrow={`Venture · ${venture.period}`} title="221B Labs —" accent="where ideas get shipped." intro={venture.intro} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {venture.products.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <article className="card glow-border flex h-full flex-col overflow-hidden" onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`)
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`)
              }}>
                <div className="relative grid min-h-[280px] place-items-center overflow-hidden border-b border-white/[0.06] bg-ink-2 p-8">
                  <div
                    aria-hidden
                    className={`absolute inset-0 ${i === 0 ? "bg-[radial-gradient(circle_at_30%_20%,rgba(212,169,79,.18),transparent_60%)]" : "bg-[radial-gradient(circle_at_70%_30%,rgba(143,179,217,.14),transparent_60%)]"}`}
                  />
                  <div className="relative w-full">{i === 0 ? <Ticket /> : <ReadAlong />}</div>
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <p className="font-type text-[11px] uppercase tracking-[0.2em] text-bone-3">{p.kind}</p>
                  <h3 className="mt-2 font-display text-3xl tracking-tight text-bone md:text-4xl">{p.name}</h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-bone-2">{p.body}</p>
                  <dl className="mt-6 grid grid-cols-2 gap-4">
                    {p.metrics.map((m) => (
                      <div key={m.label} className="rounded-2xl border border-white/[0.07] p-4">
                        <dd className="font-display text-3xl tracking-tight text-bone">{m.value}</dd>
                        <dt className="mt-1 text-[12px] text-bone-3">{m.label}</dt>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6">
          <p className="font-type text-[11px] uppercase tracking-[0.2em] text-bone-3">
            {venture.name} · {venture.note} · Ideathon 4.0 runner-up · National Entrepreneurship Challenge 2026, Round 2
          </p>
        </Reveal>

        {/* interstitial quote */}
        <figure className="mx-auto mt-28 max-w-4xl text-center md:mt-40">
          <span aria-hidden className="font-serif text-7xl leading-none text-brass">“</span>
          <blockquote className="font-serif text-[clamp(2rem,5vw,4.2rem)] italic leading-[1.05] text-bone">
            <SplitWords text={quotes.kay.text} stagger={0.06} />
          </blockquote>
          <figcaption className="mt-6 font-type text-[11px] uppercase tracking-[0.3em] text-bone-3">— {quotes.kay.source}</figcaption>
        </figure>
      </div>
    </section>
  )
}
