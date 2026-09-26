"use client"

import { motion, useInView } from "motion/react"
import { useRef } from "react"
import type React from "react"

const EASE = [0.22, 1, 0.36, 1] as const

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
  as?: "div" | "li" | "article" | "p"
}) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </M>
  )
}

// Word-by-word masked rise. Screen readers get the plain sentence.
export function SplitWords({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  immediate = false,
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
  immediate?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const show = immediate || inView
  return (
    <span ref={ref} className={className} aria-label={text} role="text">
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-top">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "110%" }}
            animate={show ? { y: "0%" } : undefined}
            transition={{ duration: 0.9, delay: delay + i * stagger, ease: EASE }}
          >
            {w}
            {i < text.split(" ").length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
