"use client"

import { motion } from "motion/react"
import { profile, publications } from "@/lib/data"
import SectionHeader from "./ui/SectionHeader"
import { Reveal } from "./ui/Reveal"

function Authors({ text }: { text: string }) {
  const parts = text.split("Tadakamalla, S. P.")
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && <b className="font-medium text-bone">Tadakamalla, S. P.</b>}
        </span>
      ))}
    </>
  )
}

export default function Publications() {
  return (
    <section id="publications" className="section pt-0 md:pt-0" aria-labelledby="pubs-title">
      <div className="wrap">
        <div id="pubs-title">
          <SectionHeader
            index="03"
            eyebrow="Publications"
            title="Four papers,"
            accent="one restless mind."
            intro="Preprints on SSRN spanning speech AI, philosophy of physics, multi-agent robotics and AI-driven software testing."
          />
        </div>
        <ol className="border-t border-white/[0.08]">
          {publications.map((p, i) => (
            <Reveal as="li" key={p.href} delay={i * 0.05}>
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="read"
                className="group relative grid gap-3 overflow-hidden border-b border-white/[0.08] py-7 md:grid-cols-12 md:gap-6 md:py-9"
              >
                <motion.span
                  aria-hidden
                  className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-gradient-to-r from-saffron/[0.09] via-saffron/[0.04] to-transparent transition-transform duration-500 ease-out group-hover:scale-y-100"
                />
                <span className="font-mono text-sm text-saffron md:col-span-1">{p.year}</span>
                <div className="md:col-span-8">
                  <h3 className="font-display text-xl leading-snug tracking-tight text-bone transition-transform duration-500 group-hover:translate-x-2 md:text-[1.7rem]">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[13px] text-bone-3">
                    <Authors text={p.authors} /> · {p.venue} · <span className="font-mono">{p.idLabel}</span>
                  </p>
                </div>
                <div className="flex items-start justify-between gap-4 md:col-span-3 md:justify-end">
                  <span className="chip">{p.topic}</span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-bone transition-all duration-500 group-hover:rotate-45 group-hover:border-saffron group-hover:bg-saffron group-hover:text-ink">
                    ↗
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-8 flex flex-wrap gap-3">
          <a href={profile.links.ssrn} target="_blank" rel="noreferrer" className="chip px-4 py-2 hover:border-saffron hover:text-saffron">
            SSRN author page ↗
          </a>
          <a href={profile.links.orcid} target="_blank" rel="noreferrer" className="chip px-4 py-2 hover:border-saffron hover:text-saffron">
            ORCID 0009-0008-6521-9122 ↗
          </a>
        </Reveal>
      </div>
    </section>
  )
}
