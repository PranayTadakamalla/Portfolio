"use client"

import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { beyond, quotes } from "@/lib/data"
import SectionHeader from "./ui/SectionHeader"
import { Reveal, SplitWords } from "./ui/Reveal"

const SANSKRIT = ["ॐ पूर्णमदः पूर्णमिदं", "पूर्णात्पूर्णमुदच्यते ।", "पूर्णस्य पूर्णमादाय", "पूर्णमेवावशिष्यते ॥"]

export default function Beyond() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9])

  return (
    <section id="beyond" className="section overflow-hidden" aria-labelledby="beyond-title">
      <div className="wrap">
        <div id="beyond-title">
          <SectionHeader index="08" eyebrow="Beyond the code" title="Poetry, writing" accent="& the whole." intro={beyond.intro} />
        </div>

        <div ref={ref} className="relative grid items-center gap-12 md:grid-cols-12">
          <div className="relative md:col-span-5">
            <motion.svg
              style={{ rotate, scale }}
              viewBox="0 0 200 200"
              className="mx-auto w-[min(80vw,420px)]"
              aria-hidden
            >
              <defs>
                <radialGradient id="whole" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="#ff8a3d" stopOpacity=".35" />
                  <stop offset="1" stopColor="#ff8a3d" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="98" fill="url(#whole)" />
              {Array.from({ length: 12 }).map((_, i) => (
                <circle
                  key={i}
                  cx={100 + Math.cos((i / 12) * Math.PI * 2) * 34}
                  cy={100 + Math.sin((i / 12) * Math.PI * 2) * 34}
                  r="52"
                  fill="none"
                  stroke={i % 3 === 0 ? "#ff8a3d" : "#ece8e1"}
                  strokeOpacity={i % 3 === 0 ? 0.6 : 0.14}
                  strokeWidth=".6"
                />
              ))}
              <circle cx="100" cy="100" r="4" fill="#ece8e1" />
            </motion.svg>
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-bone-3">Take the whole from the whole</p>
          </div>

          <figure className="md:col-span-7">
            <div lang="sa" className="font-serif text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.35] text-saffron-soft">
              {SANSKRIT.map((l, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <span className="block">{l}</span>
                </Reveal>
              ))}
            </div>
            <blockquote className="mt-8 font-serif text-[clamp(1.4rem,2.6vw,2.1rem)] italic leading-snug text-bone">
              <SplitWords text={quotes[0].text} stagger={0.03} />
            </blockquote>
            <figcaption className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-bone-3">
              — {quotes[0].source}
              <span className="mt-2 block normal-case tracking-normal text-bone-2">{quotes[0].note}</span>
            </figcaption>
          </figure>
        </div>

        <ul className="mt-24 grid gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          {beyond.hobbies.map((h, i) => (
            <Reveal as="li" key={h.name} delay={i * 0.08} className="group relative bg-ink p-7 transition-colors duration-500 hover:bg-ink-2">
              <span className="font-mono text-[11px] text-saffron">0{i + 1}</span>
              <h3 className="mt-10 font-serif text-4xl italic text-bone transition-transform duration-500 group-hover:-translate-y-1">{h.name}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-bone-2">{h.body}</p>
              <span aria-hidden className="absolute bottom-0 left-0 h-px w-0 bg-saffron transition-all duration-700 group-hover:w-full" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
