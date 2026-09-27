"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { PAGES } from "./Nav"
import SectionHeader from "./ui/SectionHeader"
import { quotes } from "@/lib/data"
import { SplitWords } from "./ui/Reveal"

const BLURBS: Record<string, string> = {
  "/about": "Who I am, what I study, and the tools I use.",
  "/research": "Tunnelling Through Deception, and four papers on SSRN.",
  "/labs": "221B Labs: Festora and Pathana Sakthi.",
  "/projects": "Security, AI and web projects from my GitHub.",
  "/journey": "Roles, clubs, awards and education.",
  "/writing": "35 poems in English, Hindi–Urdu and Telugu.",
  "/contact": "Say hello. My inbox is open.",
}

export default function CaseFiles() {
  const q = quotes.holmes[0]
  return (
    <section className="section" aria-labelledby="files-title">
      <div className="wrap">
        <div id="files-title">
          <SectionHeader index="00" eyebrow="The case files" title="Pick a file," accent="start anywhere." intro="Each page is its own case. Open one — Sherlock will leave you a tip." />
        </div>
        <ul className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {PAGES.map((p, i) => (
            <motion.li
              key={p.href}
              initial={{ opacity: 0, y: 40, rotate: i % 2 ? 1.5 : -1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 0.6 : -0.6 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={p.href} className="group relative block pt-6" data-cursor="open">
                {/* folder tab */}
                <span className="absolute left-0 top-0 h-7 w-28 rounded-t-lg bg-[#c9ae7c] px-3 pt-1 font-type text-[11px] uppercase tracking-[0.2em] text-ink/80">
                  File {p.no}
                </span>
                {/* paper peeking out */}
                <span
                  aria-hidden
                  className="absolute inset-x-4 top-8 h-24 rounded-sm bg-bone shadow-md transition-transform duration-500 group-hover:-translate-y-5 group-hover:rotate-[-2deg]"
                >
                  <span className="block px-3 pt-2 font-type text-[10px] uppercase tracking-[0.2em] text-ink/50">Evidence</span>
                </span>
                <div className="relative min-h-[190px] rounded-b-lg rounded-tr-lg bg-[linear-gradient(160deg,#d9bf8c,#b8995f)] p-5 text-ink shadow-[0_24px_50px_-20px_rgba(0,0,0,.8)] transition-transform duration-500 [transform-origin:bottom] group-hover:[transform:perspective(900px)_rotateX(-14deg)]">
                  <p className="mt-10 font-display text-3xl font-semibold leading-none">{p.label}</p>
                  <p className="mt-3 text-[14px] leading-snug text-ink/75">{BLURBS[p.href]}</p>
                  <span className="absolute bottom-4 right-4 grid h-9 w-9 place-items-center rounded-full border border-ink/30 transition-all group-hover:rotate-45 group-hover:bg-ink group-hover:text-brass">
                    ↗
                  </span>
                  {i === 1 && <span className="stamp absolute right-3 top-3 scale-75 border-oxblood text-oxblood">Solved</span>}
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>

        <figure className="mx-auto mt-32 max-w-4xl text-center md:mt-44">
          <span aria-hidden className="font-display text-7xl leading-none text-brass">“</span>
          <blockquote className="font-serif text-[clamp(2rem,5vw,4.2rem)] font-medium italic leading-[1.05] text-bone">
            <SplitWords text={q.text} stagger={0.05} />
          </blockquote>
          <figcaption className="mt-6 font-type text-[12px] uppercase tracking-[0.3em] text-bone-3">— {q.source}</figcaption>
        </figure>
      </div>
    </section>
  )
}
