"use client"

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react"
import { useMemo, useState } from "react"
import { GH, projects, type Project } from "@/lib/data"
import SectionHeader from "./ui/SectionHeader"
import { Reveal } from "./ui/Reveal"

const FILTERS = ["All", "AI", "Security", "Web"] as const

function seeded(name: string) {
  let h = 2166136261
  for (const c of name) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296
}

// Unique generative artwork per project: flow lines + orbit, seeded by name.
function Art({ name, category }: { name: string; category: Project["category"] }) {
  const { lines, orbit } = useMemo(() => {
    const r = seeded(name)
    const hueA = category === "Security" ? "#8fb3d9" : "#d4a94f"
    const lines = Array.from({ length: 14 }, (_, i) => {
      const y0 = 10 + i * 8 + r() * 4
      const amp = 6 + r() * 18
      const f = 0.02 + r() * 0.03
      const ph = r() * 6
      const d = Array.from({ length: 41 }, (_, k) => {
        const x = k * 10
        return `${k ? "L" : "M"}${x},${(y0 + Math.sin(x * f + ph) * amp * (0.4 + (k / 40) * 0.8)).toFixed(1)}`
      }).join("")
      return { d, o: 0.15 + r() * 0.45, c: r() > 0.7 ? hueA : "#efe4cf" }
    })
    return { lines, orbit: { cx: 260 + r() * 100, cy: 30 + r() * 60, r: 22 + r() * 30, c: hueA } }
  }, [name, category])
  return (
    <svg viewBox="0 0 400 130" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      {lines.map((l, i) => (
        <path key={i} d={l.d} fill="none" stroke={l.c} strokeOpacity={l.o} strokeWidth="0.8" />
      ))}
      <circle cx={orbit.cx} cy={orbit.cy} r={orbit.r} fill="none" stroke={orbit.c} strokeOpacity=".8" />
      <circle cx={orbit.cx} cy={orbit.cy} r={orbit.r * 0.3} fill={orbit.c} fillOpacity=".9" className="animate-pulse" />
    </svg>
  )
}

function Card({ p, i }: { p: Project; i: number }) {
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 150, damping: 15 })
  const sry = useSpring(ry, { stiffness: 150, damping: 15 })
  const primary = p.demo ?? p.href
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: i * 0.04 }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return
        const r = e.currentTarget.getBoundingClientRect()
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 8)
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8)
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`)
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`)
      }}
      onPointerLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
      className={`card glow-border group flex flex-col overflow-hidden ${p.featured ? "md:col-span-2 xl:col-span-1" : ""}`}
    >
      <div className="relative h-36 overflow-hidden border-b border-white/[0.06] bg-ink-2">
        <Art name={p.name} category={p.category} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-2 to-transparent" />
        <span className="absolute left-5 top-4 font-mono text-[11px] text-bone-3">{String(i + 1).padStart(2, "0")}</span>
        {p.highlight && (
          <span className="absolute right-4 top-4 rounded-full bg-brass px-3 py-1 font-mono text-[10px] font-medium text-ink">{p.highlight}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-type text-[10px] uppercase tracking-[0.2em] text-bone-3">{p.kind}</p>
        <h3 className="mt-2 font-display text-2xl tracking-tight text-bone">{p.name}</h3>
        <p className="mt-3 flex-1 text-[14px] leading-relaxed text-bone-2">{p.body}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <li key={s} className="rounded-md bg-white/[0.05] px-2 py-1 font-mono text-[10px] text-bone-2">
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center gap-4 border-t border-white/[0.06] pt-4 text-[13px]">
          {p.href && (
            <a href={p.href} target="_blank" rel="noreferrer" className="link-underline text-bone hover:text-brass">
              Code ↗
            </a>
          )}
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noreferrer" className="link-underline text-bone hover:text-brass">
              Live demo ↗
            </a>
          )}
          {!primary && <span className="font-mono text-[11px] text-bone-3">Private repository</span>}
        </div>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All")
  const list = projects.filter((p) => p.category !== "Research" && (filter === "All" || p.category === filter))

  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="wrap">
        <div id="projects-title">
          <SectionHeader
            index="04"
            eyebrow="Projects"
            title="Things I've built"
            accent="from my GitHub."
            intro="Security, AI and the web — from BERT-powered intrusion detection to on-chain credentials."
          />
        </div>

        <Reveal>
          <div role="tablist" aria-label="Filter projects" className="mb-10 inline-flex flex-wrap gap-1 rounded-full border border-white/10 p-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`relative isolate rounded-full px-5 py-2 text-[13px] transition-colors ${filter === f ? "text-ink" : "text-bone-2 hover:text-bone"}`}
              >
                {filter === f && <motion.span layoutId="proj-pill" className="absolute inset-0 -z-10 rounded-full bg-bone" />}
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        <motion.div layout className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <Card key={p.name} p={p} i={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        <Reveal className="mt-12 text-center">
          <a
            href={GH}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3 text-sm text-bone transition-colors hover:border-brass hover:text-brass"
          >
            All repositories on GitHub ↗
          </a>
        </Reveal>
      </div>
    </section>
  )
}
