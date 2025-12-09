"use client"

import { motion } from "framer-motion"

export function GlitchText({ text, className = "" }: { text: string; className?: string }) {
  const glitchVariants = {
    initial: { x: 0 },
    animate: {
      x: [0, -2, 2, -2, 0],
      transition: {
        duration: 0.3,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 3,
      },
    },
  }

  return (
    <motion.div className={`relative inline-block ${className}`}>
      {/* Main text */}
      <span className="relative z-10">{text}</span>

      {/* Glitch layers */}
      <motion.span
        className="absolute top-0 left-0 text-blue-500 opacity-80"
        variants={glitchVariants}
        initial="initial"
        animate="animate"
      >
        {text}
      </motion.span>

      <motion.span
        className="absolute top-0 left-0 text-violet-500 opacity-80"
        variants={{
          initial: { x: 0 },
          animate: {
            x: [0, 2, -2, 2, 0],
            transition: {
              duration: 0.3,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
              delay: 0.05,
            },
          },
        }}
        initial="initial"
        animate="animate"
      >
        {text}
      </motion.span>
    </motion.div>
  )
}

export function NeonText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <motion.span
      className={`text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 ${className}`}
      animate={{
        textShadow: [
          "0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)",
          "0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.6)",
          "0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)",
        ],
      }}
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
      }}
    >
      {text}
    </motion.span>
  )
}
