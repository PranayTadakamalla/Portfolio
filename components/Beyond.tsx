"use client"

import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { beyond, quotes } from "@/lib/data"
import SectionHeader from "./ui/SectionHeader"
import { Reveal, SplitWords } from "./ui/Reveal"

export default function Beyond() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const rotate = useTransform(scrollYProgress, [0, 1], [-12, 12])
  const y = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"])
  const q = quotes.holmes[1]

  return (
    <section id="writing" className="section overflow-x-clip" aria-labelledby="writing-title">
      <div className="wrap">
        <div id="writing-title">
          <SectionHeader index="06" eyebrow="Beyond the code" title="Poetry" accent="& writing." intro={beyond.intro} />
        </div>

        <div ref={ref} className="relative grid items-center gap-12 md:grid-cols-12">
          {/* a detective's notebook page */}
          <motion.div style={{ rotate, y }} className="relative mx-auto w-full max-w-md md:col-span-5">
            <div className="relative rounded-md bg-bone p-8 pb-10 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)] [background-image:repeating-linear-gradient(transparent,transparent_31px,rgba(44,74,110,.18)_32px)]">
              <span className="absolute left-8 top-0 h-full w-px bg-oxblood/40" aria-hidden />
              <p className="pl-6 font-type text-[11px] uppercase tracking-[0.25em] text-ink/60">Notebook · 221B</p>
              <p className="mt-6 pl-6 font-serif text-[1.7rem] italic leading-[32px]">Observe the small things.</p>
              <p className="pl-6 font-serif text-[1.7rem] italic leading-[32px]">Write them down.</p>
              <p className="pl-6 font-serif text-[1.7rem] italic leading-[32px]">Build what they reveal.</p>
              <span className="stamp absolute -right-3 bottom-6 bg-bone/80">Noted</span>
            </div>
          </motion.div>

          <figure className="md:col-span-7">
            <span aria-hidden className="font-display text-7xl leading-none text-brass">“</span>
            <blockquote className="font-serif text-[clamp(2rem,4.4vw,3.6rem)] font-medium italic leading-[1.05] text-bone">
              <SplitWords text={q.text} stagger={0.05} />
            </blockquote>
            <figcaption className="mt-6 font-type text-[12px] uppercase tracking-[0.25em] text-bone-3">— {q.source}</figcaption>
          </figure>
        </div>


        <ul className="mt-24 grid gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          {beyond.hobbies.map((h, i) => (
            <Reveal as="li" key={h.name} delay={i * 0.08} className="group relative bg-ink p-7 transition-colors duration-500 hover:bg-ink-2">
              <span className="font-type text-[12px] text-brass">0{i + 1}</span>
              <h3 className="mt-10 font-serif text-4xl font-medium italic text-bone transition-transform duration-500 group-hover:-translate-y-1">{h.name}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-bone-2">{h.body}</p>
              <span aria-hidden className="absolute bottom-0 left-0 h-px w-0 bg-brass transition-all duration-700 group-hover:w-full" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
