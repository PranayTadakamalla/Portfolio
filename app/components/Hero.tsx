"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { GitlabIcon as GitHub, Linkedin, Mail, Cloud } from "lucide-react"
import { smoothScrollTo } from "@/utils/smoothScroll"

// Enhanced typing animation component
const TypingAnimation = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  return (
    <motion.span
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay }}
      className="inline-block"
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + index * 0.05, duration: 0.1 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}

// Improved code editor animation
const CodeEditorAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match the container
    const updateCanvasSize = () => {
      const container = canvas.parentElement
      if (container) {
        // Set a fixed aspect ratio to ensure content fits
        const width = Math.min(500, container.clientWidth)
        const height = Math.min(400, width * 0.8)

        canvas.width = width
        canvas.height = height

        // Update canvas style dimensions
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
      }
    }

    // Initial size update
    updateCanvasSize()

    // Listen for resize events
    window.addEventListener("resize", updateCanvasSize)

    // Colors
    const colors = {
      background: "#0f172a", // Darker background
      text: "#e2e8f0",
      comment: "#94a3b8",
      keyword: "#8b5cf6",
      string: "#10b981",
      function: "#3b82f6",
      variable: "#f59e0b",
      cursor: "#f8fafc",
    }

    // Code lines - shortened to ensure they fit
    const codeLines = [
      { text: "// AI Engineer Portfolio", color: colors.comment },
      { text: "import React from 'react';", color: colors.keyword },
      { text: "import { motion } from 'framer-motion';", color: colors.keyword },
      { text: "", color: colors.text },
      { text: "function Portfolio() {", color: colors.function },
      { text: "  const [projects, setProjects] = useState([]);", color: colors.variable },
      { text: "", color: colors.text },
      { text: "  useEffect(() => {", color: colors.function },
      { text: "    // Fetch projects data", color: colors.comment },
      { text: "    fetchProjects().then(data => {", color: colors.function },
      { text: "      setProjects(data);", color: colors.variable },
      { text: "    });", color: colors.text },
      { text: "  }, []);", color: colors.text },
      { text: "", color: colors.text },
      { text: "  return (", color: colors.keyword },
      { text: '    <div className="portfolio">', color: colors.text },
      { text: '      <Header title="Sai Pranay" />', color: colors.function },
      { text: "      <Hero />", color: colors.function },
      { text: "      <Projects data={projects} />", color: colors.function },
      { text: "      <Contact />", color: colors.function },
      { text: "    </div>", color: colors.text },
      { text: "  );", color: colors.text },
      { text: "}", color: colors.function },
      { text: "", color: colors.text },
      { text: "export default Portfolio;", color: colors.keyword },
    ]

    // Animation variables
    let currentLine = 0
    let currentChar = 0
    let cursorVisible = true
    let lastTime = 0
    let cursorBlinkTime = 0

    // Draw code editor
    const drawEditor = () => {
      if (!ctx) return

      // Get current dimensions
      const width = canvas.width
      const height = canvas.height

      // Scale factors based on canvas size
      const scaleFactor = width / 500 // Base scale on a 500px reference width
      const lineHeight = 16 * scaleFactor
      const startX = 40 * scaleFactor
      const startY = 30 * scaleFactor
      const tabSize = 20 * scaleFactor
      const fontSize = 12 * scaleFactor

      // Clear canvas
      ctx.fillStyle = colors.background
      ctx.fillRect(0, 0, width, height)

      // Draw line numbers background
      ctx.fillStyle = "#0a0f1c" // Even darker background for line numbers
      ctx.fillRect(0, 0, startX - 10 * scaleFactor, height)

      // Draw code lines
      for (let i = 0; i < Math.min(currentLine + 1, codeLines.length); i++) {
        // Safety check to prevent accessing beyond array bounds
        if (i >= codeLines.length) continue

        // Draw line number
        ctx.fillStyle = "#64748b"
        ctx.font = `${fontSize}px monospace`
        ctx.textAlign = "right"
        ctx.fillText(`${i + 1}`, startX - 15 * scaleFactor, startY + i * lineHeight)

        // Draw code text
        if (i < currentLine && i < codeLines.length) {
          // Completed lines
          ctx.fillStyle = codeLines[i].color
          ctx.font = `${fontSize}px monospace`
          ctx.textAlign = "left"

          // Handle indentation
          let indentLevel = 0
          if (codeLines[i].text.startsWith("  ")) {
            indentLevel = Math.floor(codeLines[i].text.match(/^\s+/)?.[0].length || 0) / 2
          }

          ctx.fillText(codeLines[i].text, startX + indentLevel * tabSize, startY + i * lineHeight)
        } else if (i === currentLine && i < codeLines.length) {
          // Current line (typing)
          const currentText = codeLines[i].text.substring(0, currentChar)
          ctx.fillStyle = codeLines[i].color
          ctx.font = `${fontSize}px monospace`
          ctx.textAlign = "left"

          // Handle indentation
          let indentLevel = 0
          if (codeLines[i].text.startsWith("  ")) {
            indentLevel = Math.floor(codeLines[i].text.match(/^\s+/)?.[0].length || 0) / 2
          }

          ctx.fillText(currentText, startX + indentLevel * tabSize, startY + i * lineHeight)

          // Draw cursor
          if (cursorVisible) {
            const cursorX = startX + indentLevel * tabSize + ctx.measureText(currentText).width
            ctx.fillStyle = colors.cursor
            ctx.fillRect(cursorX, startY + i * lineHeight - lineHeight + 3 * scaleFactor, 2 * scaleFactor, lineHeight)
          }
        }
      }
    }

    // Animation loop using requestAnimationFrame instead of setInterval
    const animate = (time: number) => {
      if (!isAnimating) return

      // Calculate delta time
      const deltaTime = time - lastTime
      lastTime = time

      // Handle cursor blinking
      cursorBlinkTime += deltaTime
      if (cursorBlinkTime > 500) {
        cursorVisible = !cursorVisible
        cursorBlinkTime = 0
      }

      // Handle typing (every 50ms)
      if (deltaTime > 10) {
        if (currentLine < codeLines.length) {
          if (currentChar < codeLines[currentLine].text.length) {
            currentChar++
          } else {
            currentLine++
            currentChar = 0
          }
        } else {
          // Reset animation
          currentLine = 0
          currentChar = 0
        }
      }

      drawEditor()
      requestAnimationFrame(animate)
    }

    // Start animation
    drawEditor()
    requestAnimationFrame(animate)

    // Cleanup
    return () => {
      setIsAnimating(false)
      window.removeEventListener("resize", updateCanvasSize)
    }
  }, [isAnimating])

  return (
    <div className="relative w-full max-w-[500px] mx-auto">
      <div className="absolute top-0 left-0 right-0 h-8 bg-slate-800 rounded-t-lg flex items-center px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs text-slate-400 mx-auto">portfolio.tsx</div>
      </div>
      <canvas
        ref={canvasRef}
        className="rounded-lg shadow-2xl border border-slate-700 w-full"
        style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
      />
    </div>
  )
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-slate-950 pt-20"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-950 z-0"></div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center">
        {/* Text content */}
        <motion.div
          className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="text-sm md:text-base uppercase tracking-widest text-indigo-400 mb-4 font-mono"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Hello, World!
          </motion.p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-display">
            <span className="text-white">
              <TypingAnimation text="I'm Sai Pranay Tadakamalla" />
            </span>
          </h1>

          <motion.div
            className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="px-4 py-2 bg-slate-800/80 backdrop-blur-sm rounded-full text-indigo-300 border border-indigo-500/20">
              AI Engineer
            </span>
            <span className="px-4 py-2 bg-slate-800/80 backdrop-blur-sm rounded-full text-blue-300 border border-blue-500/20">
              Web Developer
            </span>
            <span className="px-4 py-2 bg-slate-800/80 backdrop-blur-sm rounded-full text-violet-300 border border-violet-500/20">
              Project Manager
            </span>
          </motion.div>

          <motion.p
            className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Building next-generation applications with AI, ML, and MERN. Transforming ideas into innovative digital
            experiences through code and creativity.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <a
              href="https://www.linkedin.com/in/sai-pranay-tadakamalla-7570bb1a6/"
              className="p-3 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="mailto:pranaytadakamalla@gmail.com"
              className="p-3 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300"
              aria-label="Email Contact"
            >
              <Mail className="w-6 h-6" />
            </a>
            <a
              href="https://github.com/PranayTadakamalla/"
              className="p-3 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300"
              aria-label="GitHub Profile"
            >
              <GitHub className="w-6 h-6" />
            </a>
            <a
              href="https://www.cloudskillsboost.google/public_profiles/5843f2b1-b8a3-47c4-a161-cb4c3a58f712"
              className="p-3 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300"
              aria-label="Google Cloud Skills Boost"
            >
              <Cloud className="w-6 h-6" />
            </a>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <a
              href="https://drive.google.com/file/d/1weV701FP9WkU_JXlv3HdGJl0QIJ3Zryq/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Download Resume</span>
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
                →
              </motion.span>
            </a>
            <button
              onClick={() => smoothScrollTo("about")}
              className="px-8 py-3 border border-indigo-500 text-indigo-300 hover:bg-indigo-600/20 rounded-full transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Explore My Work</span>
              <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
                ↓
              </motion.span>
            </button>
          </motion.div>
        </motion.div>

        {/* Code Editor Animation */}
        <motion.div
          className="lg:w-1/2 w-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <CodeEditorAnimation />
        </motion.div>
      </div>
    </section>
  )
}
