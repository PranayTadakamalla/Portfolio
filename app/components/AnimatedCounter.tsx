"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function AnimatedCounter({
  from = 0,
  to = 100,
  duration = 2,
  prefix = "",
  suffix = "",
}: {
  from?: number
  to: number
  duration?: number
  prefix?: string
  suffix?: string
}) {
  const [count, setCount] = useState(from)

  useEffect(() => {
    let start = Date.now()
    const timer = setInterval(() => {
      const now = Date.now()
      const elapsed = (now - start) / 1000
      
      if (elapsed >= duration) {
        setCount(to)
        clearInterval(timer)
      } else {
        const progress = elapsed / duration
        setCount(Math.floor(from + (to - from) * progress))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [from, to, duration])

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {prefix}
      {count}
      {suffix}
    </motion.span>
  )
}
