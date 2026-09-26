"use client"

import dynamic from "next/dynamic"
import { motion, useInView } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { featuredResearch as R, GH } from "@/lib/data"
import SectionHeader from "./ui/SectionHeader"
import { Reveal } from "./ui/Reveal"

const TunnelScene = dynamic(() => import("./three/TunnelScene"), { ssr: false })

// Chart marks use the validated data palette (brass #b8862f, scarf #5a8fd4); UI accents stay brighter.
const TONE = { muted: "#8a7e6a", accent: "#b8862f", accent2: "#5a8fd4" }

function ResultsChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [hover, setHover] = useState<number | null>(null)
  return (
    <figure ref={ref} className="mt-8">
      <figcaption className="mb-4 flex items-baseline justify-between gap-4">
        <span className="font-type text-[11px] uppercase tracking-[0.2em] text-bone-3">Normalised return · 40 seeds</span>
        <span className="font-mono text-[11px] text-bone-2">{R.pValue}</span>
      </figcaption>
      <div className="relative space-y-4" onPointerLeave={() => setHover(null)}>
        {/* recessive gridlines */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[7.5rem] right-12 flex justify-between">
          {[0, 0.25, 0.5, 0.75, 1].map((g) => (
            <span key={g} className="h-full w-px bg-white/[0.05]" />
          ))}
        </div>
        {R.results.map((r, i) => (
          <div
            key={r.label}
            className="relative grid grid-cols-[7rem_1fr_3rem] items-center gap-2"
            onPointerEnter={() => setHover(i)}
            data-cursor={r.value.toFixed(3)}
          >
            <span className={`text-[13px] ${hover === null || hover === i ? "text-bone" : "text-bone-3"} transition-colors`}>{r.label}</span>
            <div className="relative h-7">
              <motion.div
                className="absolute left-0 top-1/2 h-2.5 -translate-y-1/2 rounded-r-[4px]"
                style={{ backgroundColor: TONE[r.tone], opacity: hover === null || hover === i ? 1 : 0.35 }}
                initial={{ width: 0 }}
                animate={{ width: inView ? `${r.value * 100}%` : 0 }}
                transition={{ duration: 1.4, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              />
              {hover === i && (
                <div
                  role="tooltip"
                  className="absolute -top-9 z-10 whitespace-nowrap rounded-lg border border-white/10 bg-ink-2 px-3 py-1.5 font-mono text-[11px] text-bone shadow-xl"
                  style={{ left: `calc(${r.value * 100}% - 3rem)` }}
                >
                  {r.label}: <b>{r.value.toFixed(3)}</b>
                  {i > 0 && <span className="text-bone-2"> · +{(((r.value - R.results[0].value) / R.results[0].value) * 100).toFixed(0)}% vs baseline</span>}
                </div>
              )}
            </div>
            <span className="text-right font-mono text-[13px] tabular-nums text-bone">{r.value.toFixed(3)}</span>
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>Normalised return across 40 seeds, {R.pValue}</caption>
        <thead>
          <tr>
            <th>Method</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {R.results.map((r) => (
            <tr key={r.label}>
              <td>{r.label}</td>
              <td>{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

// log2(t+1) bits to forecast vs t bits to audit counterfactually.
function MemoryGap() {
  const W = 320
  const H = 180
  const T = 64
  const pad = { l: 34, r: 12, t: 12, b: 26 }
  const x = (t: number) => pad.l + (t / T) * (W - pad.l - pad.r)
  const y = (b: number) => H - pad.b - (b / T) * (H - pad.t - pad.b)
  const pred = Array.from({ length: T + 1 }, (_, t) => [x(t), y(Math.log2(t + 1))])
  const audit = Array.from({ length: T + 1 }, (_, t) => [x(t), y(t)])
  const path = (pts: number[][]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("")
  const [ht, setHt] = useState<number | null>(null)
  return (
    <figure className="mt-6">
      <div className="mb-3 flex flex-wrap gap-4 font-mono text-[11px] text-bone-2">
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-4 rounded bg-[#5a8fd4]" /> Forecasting · log₂(t+1)
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-4 rounded bg-[#b8862f]" /> Counterfactual audit · t
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Bits of memory needed as history length t grows: forecasting grows as log2(t+1), counterfactual auditing grows linearly as t."
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          const px = ((e.clientX - r.left) / r.width) * W
          const t = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * T)
          setHt(t >= 0 && t <= T ? t : null)
        }}
        onPointerLeave={() => setHt(null)}
      >
        {[0, 16, 32, 48, 64].map((b) => (
          <g key={b}>
            <line x1={pad.l} x2={W - pad.r} y1={y(b)} y2={y(b)} stroke="rgba(239,228,207,.06)" />
            <text x={pad.l - 6} y={y(b) + 3} textAnchor="end" fontSize="8" fill="#8a7e6a" fontFamily="monospace">
              {b}
            </text>
          </g>
        ))}
        <text x={W - pad.r} y={H - 8} textAnchor="end" fontSize="8" fill="#8a7e6a" fontFamily="monospace">
          history length t →
        </text>
        <path d={path(audit)} fill="none" stroke="#b8862f" strokeWidth="2" strokeLinecap="round" />
        <path d={path(pred)} fill="none" stroke="#5a8fd4" strokeWidth="2" strokeLinecap="round" />
        <text x={x(T) - 4} y={y(T) + 12} textAnchor="end" fontSize="9" fill="#efe4cf">
          64 bits
        </text>
        <text x={x(T) - 4} y={y(Math.log2(T + 1)) - 6} textAnchor="end" fontSize="9" fill="#efe4cf">
          ≈6 bits
        </text>
        {ht !== null && (
          <g>
            <line x1={x(ht)} x2={x(ht)} y1={pad.t} y2={H - pad.b} stroke="rgba(239,228,207,.3)" strokeDasharray="2 3" />
            <circle cx={x(ht)} cy={y(ht)} r="4" fill="#b8862f" stroke="#0f0c0a" strokeWidth="2" />
            <circle cx={x(ht)} cy={y(Math.log2(ht + 1))} r="4" fill="#5a8fd4" stroke="#0f0c0a" strokeWidth="2" />
            <g transform={`translate(${Math.min(x(ht) + 8, W - 108)},${pad.t + 4})`}>
              <rect width="100" height="40" rx="6" fill="#17120e" stroke="rgba(239,228,207,.12)" />
              <text x="8" y="14" fontSize="9" fill="#c2b59b" fontFamily="monospace">
                t = {ht}
              </text>
              <text x="8" y="27" fontSize="9" fill="#efe4cf" fontFamily="monospace">
                forecast {Math.log2(ht + 1).toFixed(1)} bits
              </text>
              <text x="8" y="37" fontSize="9" fill="#efe4cf" fontFamily="monospace">
                audit {ht} bits
              </text>
            </g>
          </g>
        )}
      </svg>
    </figure>
  )
}

export default function Research() {
  const box = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [webgl, setWebgl] = useState(false)
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const c = document.createElement("canvas")
    setWebgl(!reduce && !!(c.getContext("webgl2") || c.getContext("webgl")))
    const obs = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "200px" })
    if (box.current) obs.observe(box.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="research" className="section" aria-labelledby="research-title">
      <div className="wrap">
        <div id="research-title">
          <SectionHeader
            index="02"
            eyebrow="Research"
            title="Agents in a world"
            accent="that lies to them."
            intro="What should an agent do when the reward signal is a trap? My work sits where reinforcement learning, quantum-inspired search and the theory of memory meet."
          />
        </div>

        <Reveal>
          <article className="card glow-border grid overflow-hidden md:grid-cols-2" onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`)
            e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`)
          }}>
            <div ref={box} className="relative min-h-[320px] border-b border-white/[0.06] bg-[radial-gradient(ellipse_at_center,rgba(212,169,79,.08),transparent_70%)] md:min-h-[560px] md:border-b-0 md:border-r">
              {webgl && <TunnelScene active={active} />}
              <div className="pointer-events-none absolute left-5 top-5 font-type text-[10px] uppercase tracking-[0.2em] text-bone-3">
                Deceptive reward landscape
              </div>
              <ul className="pointer-events-none absolute bottom-5 left-5 flex flex-wrap gap-2 font-mono text-[10px] text-bone-2">
                <li className="chip border-brass/30"><span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-brass" />Decoy peak</li>
                <li className="chip border-white/15"><span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-bone" />Agent</li>
                <li className="chip border-scarf/30"><span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-scarf" />True goal behind barrier</li>
              </ul>
            </div>
            <div className="p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip border-brass/40 text-brass">Featured study</span>
                <span className="chip">{R.period}</span>
              </div>
              <h3 className="mt-5 font-display text-3xl tracking-tight text-bone md:text-4xl">{R.title}</h3>
              <p className="serif-accent mt-1 text-xl">{R.subtitle}</p>
              <p className="mt-5 text-[15px] leading-relaxed text-bone-2">{R.summary}</p>
              <ul className="mt-5 grid gap-2 text-[14px] text-bone-2">
                {R.details.map((d) => (
                  <li key={d} className="flex gap-3">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brass" />
                    {d}
                  </li>
                ))}
              </ul>
              <ResultsChart />
              <p className="mt-6 font-mono text-[11px] text-bone-3">{R.role} · {R.guide}</p>
              <a href={R.link} target="_blank" rel="noreferrer" className="link-underline mt-4 inline-block text-sm text-bone hover:text-brass">
                Code &amp; comparative demo on GitHub ↗
              </a>
            </div>
          </article>
        </Reveal>

        <Reveal className="mt-6">
          <article className="card grid gap-8 p-6 md:grid-cols-2 md:p-10">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip border-scarf/40 text-scarf">Theory · 2026 preprint</span>
                <span className="chip">with S. M. R. Prakash &amp; S. M. Asad</span>
              </div>
              <h3 className="mt-5 font-display text-2xl tracking-tight text-bone md:text-3xl">
                Predictive state is not explanatory state
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-bone-2">
                A system tuned to forecast can quietly lose the ability to explain itself. For threshold processes over binary event
                streams, prediction needs only log₂(t+1) bits — but answering every counterfactual about the past needs the full t.
                An exponential separation, verified with two independent implementations and 572 adversarial trials up to t = 4096.
              </p>
              <a
                href={`${GH}/predictive-state-not-explanatory-state`}
                target="_blank"
                rel="noreferrer"
                className="link-underline mt-5 inline-block text-sm text-bone hover:text-brass"
              >
                Paper &amp; verification code ↗
              </a>
            </div>
            <MemoryGap />
          </article>
        </Reveal>
      </div>
    </section>
  )
}
