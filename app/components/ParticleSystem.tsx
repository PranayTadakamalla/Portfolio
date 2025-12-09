"use client"

import { useEffect, useRef } from "react"

export function ParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    const particleCount = 100

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string
      alpha: number
      canvasRef: HTMLCanvasElement
      ctxRef: CanvasRenderingContext2D

      constructor(canvasElement: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvasRef = canvasElement
        this.ctxRef = context
        this.x = Math.random() * canvasElement.width
        this.y = Math.random() * canvasElement.height
        this.vx = (Math.random() - 0.5) * 1
        this.vy = (Math.random() - 0.5) * 1
        this.radius = Math.random() * 2 + 1
        this.color = Math.random() > 0.5 ? "#3b82f6" : "#818cf8"
        this.alpha = Math.random() * 0.5 + 0.3
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > this.canvasRef.width) this.vx *= -1
        if (this.y < 0 || this.y > this.canvasRef.height) this.vy *= -1
      }

      draw() {
        this.ctxRef.fillStyle = this.color
        this.ctxRef.globalAlpha = this.alpha
        this.ctxRef.beginPath()
        this.ctxRef.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        this.ctxRef.fill()
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas, ctx))
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = 1

      particles.forEach((p) => {
        p.update()
        p.draw()

        // Draw connections
        particles.forEach((other) => {
          const dx = p.x - other.x
          const dy = p.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.strokeStyle = "#3b82f6"
            ctx.globalAlpha = 0.1
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(other.x, other.y)
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-30"
    />
  )
}

export function BlobShape() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let time = 0

    const animate = () => {
      time += 0.01
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 150

      ctx.fillStyle = "rgba(59, 130, 246, 0.1)"
      ctx.beginPath()

      for (let i = 0; i < Math.PI * 2; i += 0.01) {
        const noiseValue = Math.sin(i * 3 + time) * 20 + Math.cos(i * 2 + time) * 15
        const x = centerX + (radius + noiseValue) * Math.cos(i)
        const y = centerY + (radius + noiseValue) * Math.sin(i)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.closePath()
      ctx.fill()

      ctx.strokeStyle = "rgba(59, 130, 246, 0.3)"
      ctx.lineWidth = 2
      ctx.stroke()

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-20"
    />
  )
}
