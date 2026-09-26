"use client"

import { certifications, skills } from "@/lib/data"
import SectionHeader from "./ui/SectionHeader"
import { Reveal } from "./ui/Reveal"

function Row({ items, reverse, dur }: { items: string[]; reverse?: boolean; dur: string }) {
  const doubled = [...items, ...items]
  return (
    <div className="mask-fade-x overflow-hidden py-2" aria-hidden>
      <div className="marquee gap-3" data-reverse={reverse} style={{ ["--dur" as string]: dur }}>
        {doubled.map((s, i) => (
          <span
            key={i}
            className="mr-3 inline-flex shrink-0 items-center gap-3 whitespace-nowrap rounded-full border border-white/10 px-6 py-3 font-display text-lg text-bone md:text-2xl"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  const all = skills.flatMap((g) => g.items)
  const half = Math.ceil(all.length / 2)
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="wrap">
        <div id="skills-title">
          <SectionHeader index="07" eyebrow="Toolkit" title="Skills &" accent="certifications." />
        </div>
      </div>
      <Row items={all.slice(0, half)} dur="55s" />
      <Row items={all.slice(half)} reverse dur="48s" />

      <div className="wrap mt-16 grid gap-6 md:grid-cols-3">
        {skills.map((g, i) => (
          <Reveal key={g.group} delay={i * 0.08}>
            <div className="card h-full p-6">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-saffron">{g.group}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="wrap mt-6">
        <Reveal>
          <div className="card p-6 md:p-8">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-saffron">Certifications</h3>
            <ul className="mt-5 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.map((c) => (
                <li key={c.name} className="flex items-start justify-between gap-4 border-b border-white/[0.06] py-4">
                  <span className="text-[15px] text-bone">{c.name}</span>
                  <span className="shrink-0 text-right font-mono text-[11px] text-bone-3">{c.issuer}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
