"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

export function scrollToId(id: string) {
  const el = document.querySelector(id) as HTMLElement | null
  if (!el) return
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -10, duration: 1.4 })
  else el.scrollIntoView({ behavior: "smooth" })
}

// Lenis drives the page; GSAP's ticker drives Lenis so ScrollTrigger stays in lockstep.
export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    window.__lenis = lenis
    lenis.on("scroll", ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const stopWhileLoading = () => (document.body.classList.contains("is-loading") ? lenis.stop() : lenis.start())
    stopWhileLoading()
    const onDone = () => lenis.start()
    window.addEventListener("loader:done", onDone)

    return () => {
      gsap.ticker.remove(raf)
      window.removeEventListener("loader:done", onDone)
      lenis.destroy()
      delete window.__lenis
    }
  }, [])
  return null
}
