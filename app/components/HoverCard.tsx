"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export function InteractiveHoverCard({
  children,
  className = "",
  glow = true,
}: {
  children: React.ReactNode
  className?: string
  glow?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {glow && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 blur-xl opacity-30 -z-10"
          layoutId="glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
        />
      )}
      {children}
    </motion.div>
  )
}

export function GradientBorder({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 opacity-0"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <div className="relative bg-slate-950 rounded-2xl">{children}</div>
    </motion.div>
  )
}
