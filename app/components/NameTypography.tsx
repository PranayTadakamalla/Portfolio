"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useLoading } from "./LoadingProvider"

export function NameTypography({
  text,
  className = "text-white",
  speed = 80,
  replayKey,
}: {
  text: string
  className?: string
  speed?: number
  replayKey?: number
}) {
  const { isLoading } = useLoading()
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // If replayKey changes, reset animation
    setIndex(0)
    setDone(false)
  }, [replayKey, text])

  useEffect(() => {
    // Don't start typing until loading completes
    if (isLoading) {
      return
    }

    if (index >= text.length) {
      setDone(true)
      return
    }

    const timer = setTimeout(() => {
      setIndex((i) => i + 1)
    }, speed)

    return () => clearTimeout(timer)
  }, [index, speed, text.length, isLoading])

  const visible = text.slice(0, index)

  return (
    <div className={`inline-flex items-center gap-0 ${className}`}>
      <span className="whitespace-pre-wrap font-display text-inherit">{visible}</span>
      <motion.span
        aria-hidden
        className="ml-1"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: done ? 0 : Infinity }}
      >
        <span className="inline-block w-1 h-6 bg-white align-middle" />
      </motion.span>
    </div>
  )
}

export default NameTypography
