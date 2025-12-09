"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  variant?: "glitch" | "neon" | "gradient" | "glass" | "pulse"
}

export function GlitchButton({
  children,
  onClick,
  className = "",
}: ButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-6 py-3 font-bold text-white overflow-hidden ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600" />
      <motion.div
        className="absolute inset-0 bg-blue-600"
        animate={{ x: [0, 2, -2, 0] }}
        transition={{ duration: 0.3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

export function NeonButton({
  children,
  onClick,
  className = "",
}: ButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-6 py-3 font-bold text-blue-300 bg-transparent border-2 border-blue-400 ${className}`}
      whileHover={{
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.8), inset 0 0 20px rgba(59, 130, 246, 0.1)",
        scale: 1.05,
      }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: [
          "0 0 10px rgba(59, 130, 246, 0.5)",
          "0 0 20px rgba(59, 130, 246, 0.8)",
          "0 0 10px rgba(59, 130, 246, 0.5)",
        ],
      }}
      transition={{
        boxShadow: { duration: 2, repeat: Number.POSITIVE_INFINITY },
      }}
    >
      {children}
    </motion.button>
  )
}

export function GradientButton({
  children,
  onClick,
  className = "",
}: ButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-6 py-3 font-bold text-white overflow-hidden group ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

export function GlassButton({
  children,
  onClick,
  className = "",
}: ButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`px-6 py-3 font-bold text-white backdrop-blur-md bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg hover:bg-opacity-20 transition-all ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}

export function PulseButton({
  children,
  onClick,
  className = "",
}: ButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-6 py-3 font-bold text-white ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"
        animate={{
          boxShadow: [
            "0 0 20px rgba(59, 130, 246, 0.5)",
            "0 0 40px rgba(59, 130, 246, 0.8)",
            "0 0 20px rgba(59, 130, 246, 0.5)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

export function AnimatedButton({
  children,
  onClick,
  variant = "gradient",
  className = "",
}: ButtonProps) {
  const variants = {
    glitch: GlitchButton,
    neon: NeonButton,
    gradient: GradientButton,
    glass: GlassButton,
    pulse: PulseButton,
  }

  const Component = variants[variant]
  return (
    <Component onClick={onClick} className={className}>
      {children}
    </Component>
  )
}
