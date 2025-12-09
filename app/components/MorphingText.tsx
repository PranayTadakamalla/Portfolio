"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function MorphingText({
  words,
  className = "",
}: {
  words: string[]
  className?: string
}) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [words.length])

  return (
    <div className={`relative inline-block overflow-hidden ${className}`}>
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="inline-block"
      >
        {words[index]}
      </motion.span>
    </div>
  )
}

export function RotatingText({
  texts,
  className = "",
  duration = 4,
}: {
  texts: string[]
  className?: string
  duration?: number
}) {
  return (
    <div className={`relative h-12 ${className}`}>
      {texts.map((text, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 flex items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [50, 0, 0, -50],
          }}
          transition={{
            duration: duration,
            delay: i * duration,
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          <span>{text}</span>
        </motion.div>
      ))}
    </div>
  )
}

export function TypewriterText({
  text,
  speed = 50,
  className = "",
}: {
  text: string
  speed?: number
  className?: string
}) {
  const [displayedText, setDisplayedText] = useState("")

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span className={className}>
      {displayedText}
      {displayedText.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
          className="inline-block w-1 h-6 bg-blue-400 ml-1"
        />
      )}
    </span>
  )
}
