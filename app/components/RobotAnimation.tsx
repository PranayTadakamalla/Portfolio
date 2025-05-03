"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function RobotAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 200
    canvas.height = 200

    // Robot colors
    const colors = {
      head: "#3b82f6",
      eye: "#06b6d4",
      body: "#4f46e5",
      arm: "#8b5cf6",
      highlight: "#ffffff",
    }

    // Animation variables
    let eyeSize = 5
    let eyeDirection = 0.1
    let armAngle = 0
    let headBob = 0
    let headBobDirection = 0.02

    // Draw robot function
    const drawRobot = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Head
      ctx.fillStyle = colors.head
      ctx.beginPath()
      ctx.roundRect(60, 40 + headBob, 80, 70, 10)
      ctx.fill()

      // Eyes
      ctx.fillStyle = colors.eye
      ctx.beginPath()
      ctx.arc(85, 65 + headBob, eyeSize, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(115, 65 + headBob, eyeSize, 0, Math.PI * 2)
      ctx.fill()

      // Eye highlights
      ctx.fillStyle = colors.highlight
      ctx.beginPath()
      ctx.arc(82, 62 + headBob, 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(112, 62 + headBob, 2, 0, Math.PI * 2)
      ctx.fill()

      // Mouth
      ctx.strokeStyle = colors.highlight
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(100, 85 + headBob, 15, 0.2, Math.PI - 0.2)
      ctx.stroke()

      // Antenna
      ctx.strokeStyle = colors.highlight
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(100, 40 + headBob)
      ctx.lineTo(100, 30 + headBob)
      ctx.stroke()
      ctx.fillStyle = colors.eye
      ctx.beginPath()
      ctx.arc(100, 25 + headBob, 5, 0, Math.PI * 2)
      ctx.fill()

      // Body
      ctx.fillStyle = colors.body
      ctx.beginPath()
      ctx.roundRect(70, 110, 60, 60, 5)
      ctx.fill()

      // Control panel
      ctx.fillStyle = "#1e293b"
      ctx.beginPath()
      ctx.roundRect(80, 120, 40, 20, 3)
      ctx.fill()

      // Buttons
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(90, 130, 3, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#22c55e"
      ctx.beginPath()
      ctx.arc(100, 130, 3, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#eab308"
      ctx.beginPath()
      ctx.arc(110, 130, 3, 0, Math.PI * 2)
      ctx.fill()

      // Arms
      ctx.fillStyle = colors.arm
      // Left arm
      ctx.save()
      ctx.translate(70, 120)
      ctx.rotate(-Math.PI / 4 + Math.sin(armAngle) * 0.2)
      ctx.fillRect(-5, 0, 10, 40)
      ctx.restore()

      // Right arm
      ctx.save()
      ctx.translate(130, 120)
      ctx.rotate(Math.PI / 4 - Math.sin(armAngle) * 0.2)
      ctx.fillRect(-5, 0, 10, 40)
      ctx.restore()

      // Legs
      ctx.fillStyle = colors.body
      ctx.fillRect(80, 170, 10, 20)
      ctx.fillRect(110, 170, 10, 20)

      // Feet
      ctx.fillStyle = colors.head
      ctx.beginPath()
      ctx.roundRect(75, 190, 20, 5, 3)
      ctx.fill()
      ctx.beginPath()
      ctx.roundRect(105, 190, 20, 5, 3)
      ctx.fill()

      // Update animation variables
      eyeSize += eyeDirection
      if (eyeSize > 7 || eyeSize < 4) {
        eyeDirection *= -1
      }

      armAngle += 0.05
      headBob += headBobDirection
      if (headBob > 2 || headBob < -2) {
        headBobDirection *= -1
      }
    }

    // Animation loop
    const animate = () => {
      drawRobot()
      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <motion.div
      className="absolute bottom-10 right-10 z-10"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5, type: "spring" }}
    >
      <canvas ref={canvasRef} width="200" height="200" className="pointer-events-none" />
    </motion.div>
  )
}
