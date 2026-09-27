"use client"

import Image from "next/image"
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react"
import { useRef } from "react"
import { about, profile } from "@/lib/data"
import { Reveal } from "./ui/Reveal"
import Counter from "./ui/Counter"

const BLUR =
  "data:image/webp;base64,UklGRnwAAABXRUJQVlA4IHAAAABwBQCdASoYACAAPtFWok2oJSMiN+gBABoJQBdgBkoTKlg3qUjYgyCnh/WCr7ObWnVicYsAAP6uqoo0pM9Vu7s3BrZ8YTSvLTRN2FmAi90D4mvlwdTRbA/wxzHraRXiIMqlfnPY8s8qUcC95mRJ3EAA"

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <motion.span style={{ opacity }} className="inline">
      {word}{" "}
    </motion.span>
  )
}

function ScrollText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] })
  const words = text.split(" ")
  return (
    <p ref={ref} className="font-display text-[clamp(1.6rem,3.3vw,2.9rem)] leading-[1.12] tracking-tight text-bone" aria-label={text}>
      <span aria-hidden>
        {words.map((w, i) => (
          <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
        ))}
      </span>
    </p>
  )
}

function Portrait() {
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 120, damping: 14 })
  const sry = useSpring(ry, { stiffness: 120, damping: 14 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"])
  // transform/opacity only (no clip-path repaint) keeps the scroll reveal on the GPU
  const scale = useTransform(scrollYProgress, [0, 0.35], [0.86, 1])
  const fade = useTransform(scrollYProgress, [0, 0.25], [0.35, 1])

  return (
    <div className="[perspective:1200px]">
      <motion.div
        ref={ref}
        style={{ rotateX: srx, rotateY: sry, scale, opacity: fade }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return
          const r = e.currentTarget.getBoundingClientRect()
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 12)
          rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12)
          e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`)
          e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`)
        }}
        onPointerLeave={() => {
          rx.set(0)
          ry.set(0)
        }}
        data-cursor="hello"
        className="group relative aspect-[3/4] w-full overflow-hidden rounded-[28px] bg-ink-2 [transform-style:preserve-3d]"
      >
        <motion.div style={{ y }} className="absolute -inset-[8%]">
          <Image
            src="/img/pranay-1080.webp"
            alt="Sai Pranay Tadakamalla working at a laptop in a sunlit office"
            fill
            sizes="(max-width: 768px) 92vw, 40vw"
            placeholder="blur"
            blurDataURL={BLUR}
            className="object-cover object-[50%_30%] grayscale-[35%] transition-[filter] duration-700 group-hover:grayscale-0"
            priority={false}
          />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(360px circle at var(--mx,50%) var(--my,50%), rgba(230,199,127,.55), transparent 60%)" }}
        />
        {/* frame corners */}
        {["left-4 top-4 border-l border-t", "right-4 top-4 border-r border-t", "bottom-4 left-4 border-b border-l", "bottom-4 right-4 border-b border-r"].map((c) => (
          <span key={c} className={`absolute h-6 w-6 border-bone/60 ${c}`} />
        ))}
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between [transform:translateZ(40px)]">
          <div>
            <p className="font-display text-lg text-bone">{profile.name}</p>
            <p className="font-type text-[10px] uppercase tracking-[0.2em] text-bone-2">Founder · Researcher · Writer</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full border border-brass/60 font-mono text-[10px] text-brass">
            ✦
          </span>
        </div>
      </motion.div>
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="wrap">
        <Reveal>
          <span className="eyebrow">
            <span className="text-brass">01</span> About
          </span>
        </Reveal>
        <h2 id="about-title" className="sr-only">
          About Sai Pranay
        </h2>
        <div className="mt-10 grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-28">
              <Portrait />
            </div>
          </div>
          <div className="flex flex-col gap-10 md:col-span-7 md:pt-6">
            <ScrollText text={about.lead} />
            {about.body.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className="max-w-2xl text-[17px] leading-relaxed text-bone-2">{p}</p>
              </Reveal>
            ))}
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.06]">
              {about.stats.map((s) => (
                <div key={s.label} className="bg-ink p-5 md:p-7">
                  <dt className="font-type text-[10px] uppercase tracking-[0.2em] text-bone-3">{s.label}</dt>
                  <dd className="mt-3 font-display text-4xl tracking-tight text-bone md:text-5xl">
                    <Counter value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
                  </dd>
                </div>
              ))}
            </dl>
            <Reveal>
              <div className="flex flex-wrap gap-2">
                {["Reinforcement learning", "Agentic AI", "Quantum-inspired algorithms", "Speech tech for Indian languages"].map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
