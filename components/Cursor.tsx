"use client"

import { useEffect, useRef } from "react"

// A dot that sticks to the pointer and a ring that trails it; grows over interactive targets.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    const pos = { x: innerWidth / 2, y: innerHeight / 2 }
    const ringPos = { ...pos }
    let scale = 1
    let targetScale = 1
    let raf = 0

    const move = (e: PointerEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      const t = (e.target as HTMLElement)?.closest?.("a,button,[data-cursor]") as HTMLElement | null
      targetScale = t ? 2.4 : 1
      if (label.current) label.current.textContent = t?.dataset.cursor ?? ""
      document.documentElement.classList.add("has-cursor")
    }
    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16
      ringPos.y += (pos.y - ringPos.y) * 0.16
      scale += (targetScale - scale) * 0.18
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px,${pos.y}px,0) translate(-50%,-50%)`
      if (ring.current)
        ring.current.style.transform = `translate3d(${ringPos.x}px,${ringPos.y}px,0) translate(-50%,-50%) scale(${scale})`
      raf = requestAnimationFrame(loop)
    }
    const leave = () => document.documentElement.classList.remove("has-cursor")
    window.addEventListener("pointermove", move, { passive: true })
    document.addEventListener("pointerleave", leave)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", move)
      document.removeEventListener("pointerleave", leave)
    }
  }, [])

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[120] hidden h-9 w-9 items-center justify-center rounded-full border border-bone/40 mix-blend-difference [.has-cursor_&]:flex"
      >
        <span ref={label} className="font-mono text-[5px] uppercase tracking-widest text-bone" />
      </div>
      <div
        ref={dot}
        aria-hidden
        className="cursor-dot pointer-events-none fixed left-0 top-0 z-[121] hidden h-1.5 w-1.5 rounded-full bg-brass [.has-cursor_&]:block"
      />
    </>
  )
}
