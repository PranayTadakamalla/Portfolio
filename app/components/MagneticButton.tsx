"use client"

import { useRef, useEffect, useState } from "react"

export function MagneticButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distance = 100
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < distance) {
        const angle = Math.atan2(dy, dx)
        const x = Math.cos(angle) * (distance - dist) * 0.3
        const y = Math.sin(angle) * (distance - dist) * 0.3
        setPosition({ x, y })
      } else {
        setPosition({ x: 0, y: 0 })
      }
    }

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 })
    }

    document.addEventListener("mousemove", handleMouseMove)
    button.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      button.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: "all 0.2s ease-out",
      }}
      className="px-8 py-3 font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
    >
      {children}
    </button>
  )
}

export function FloatingButton({
  children,
  onClick,
  position = "bottom-right",
}: {
  children: React.ReactNode
  onClick?: () => void
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
}) {
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  }

  return (
    <button
      onClick={onClick}
      className={`fixed ${positionClasses[position]} w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center`}
    >
      {children}
    </button>
  )
}
