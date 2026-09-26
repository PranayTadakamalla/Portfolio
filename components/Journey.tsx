"use client"

import { motion, useScroll, useSpring } from "motion/react"
import { useRef } from "react"
import { timeline, languages } from "@/lib/data"
import SectionHeader from "./ui/SectionHeader"
import { Reveal } from "./ui/Reveal"

const KIND_COLOR: Record<string, string> = {
  Award: "text-saffron border-saffron/40",
  Venture: "text-saffron border-saffron/40",
  Research: "text-glacier border-glacier/40",
  Leadership: "text-bone border-white/25",
  Experience: "text-bone border-white/25",
  Club: "text-bone-2 border-white/15",
  Education: "text-glacier border-glacier/40",
}

export default function Journey() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.6"] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  return (
    <section id="journey" className="section" aria-labelledby="journey-title">
      <div className="wrap">
        <div id="journey-title">
          <SectionHeader
            index="05"
            eyebrow="Journey"
            title="Experience, leadership"
            accent="& the road so far."
            intro="Positions, clubs, awards and the classrooms that shaped them — newest first."
          />
        </div>

        <ol ref={ref} className="relative ml-3 md:ml-0">
          <span aria-hidden className="absolute left-0 top-0 h-full w-px bg-white/[0.08] md:left-1/2" />
          <motion.span
            aria-hidden
            style={{ scaleY }}
            className="absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-saffron via-saffron to-glacier md:left-1/2"
          />
          {timeline.map((t, i) => (
            <li key={t.title + t.period} className={`relative pb-14 pl-8 md:w-1/2 md:pl-0 ${i % 2 ? "md:ml-auto md:pl-14" : "md:pr-14 md:text-right"}`}>
              <motion.span
                aria-hidden
                className={`absolute left-0 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-ink bg-saffron ${i % 2 ? "md:left-0" : "md:left-auto md:right-0 md:translate-x-1/2"}`}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-40% 0px -40% 0px" }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              />
              <Reveal>
                <div className={`flex flex-wrap items-center gap-2 ${i % 2 ? "" : "md:justify-end"}`}>
                  <span className="font-mono text-[12px] text-bone-3">{t.period}</span>
                  <span className={`chip ${KIND_COLOR[t.kind] ?? ""}`}>{t.kind}</span>
                </div>
                <h3 className="mt-3 font-display text-2xl tracking-tight text-bone md:text-[1.75rem]">{t.title}</h3>
                <p className="mt-1 text-[14px] text-saffron-soft">{t.org}</p>
                <p className={`mt-3 max-w-md text-[15px] leading-relaxed text-bone-2 ${i % 2 ? "" : "md:ml-auto"}`}>{t.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="mt-4">
          <div className="card flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <p className="font-display text-xl text-bone">Speaks</p>
            <ul className="flex flex-wrap gap-6 md:gap-12">
              {languages.map((l) => (
                <li key={l.name}>
                  <p className="font-display text-2xl text-bone">{l.name}</p>
                  <p className="font-mono text-[11px] text-bone-3">{l.level}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
