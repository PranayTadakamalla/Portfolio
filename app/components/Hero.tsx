"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { GitlabIcon as GitHub, Linkedin, Mail, Cloud } from "lucide-react"
import Image from "next/image"
import NameTypography from "./NameTypography"
import { smoothScrollTo } from "@/utils/smoothScroll"
import { GlitchText } from "./GlitchText"

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
  return null
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black pt-20"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-black z-0"></div>

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

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        {/* Text content */}
        <motion.div
          className="text-center w-full"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="text-sm md:text-base uppercase tracking-widest text-blue-400 mb-4 font-mono"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Hello, World!
          </motion.p>

          <div className="flex flex-col items-center md:flex-row md:items-center justify-center gap-6 mb-6">
            <motion.div
              className="w-44 h-56 md:w-56 md:h-72 rounded-md overflow-hidden ring-2 ring-white/10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src="/Pic.jpg"
                alt="Vishnu"
                width={224}
                height={288}
                className="object-cover w-full h-full"
                priority
              />
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display">
              <NameTypography text="Vishnu Vardhan Yeduresi" className="text-white" speed={200} />
            </h1>
          </div>

          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="px-4 py-2 bg-blue-900/80 backdrop-blur-sm rounded-full text-blue-300 border border-blue-500/20">
              Professional
            </span>
            <span className="px-4 py-2 bg-blue-900/80 backdrop-blur-sm rounded-full text-blue-300 border border-blue-500/20">
              Innovator
            </span>
            <span className="px-4 py-2 bg-blue-900/80 backdrop-blur-sm rounded-full text-blue-300 border border-blue-500/20">
              Builder
            </span>
          </motion.div>

          <motion.p
            className="text-lg md:text-xl text-blue-200 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Transforming ideas into innovative digital experiences through excellence and expertise.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <a
              href="https://www.linkedin.com/in/vishnu-vardhan-yeduresi-3b5a73335/"
              className="p-3 rounded-full bg-blue-900/80 backdrop-blur-sm border border-blue-700 hover:bg-blue-700 hover:border-blue-500 transition-all duration-300"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="mailto:vishnuvardhanyeduresi@gmail.com"
              className="p-3 rounded-full bg-blue-900/80 backdrop-blur-sm border border-blue-700 hover:bg-blue-700 hover:border-blue-500 transition-all duration-300"
              aria-label="Email Contact"
            >
              <Mail className="w-6 h-6" />
            </a>
            <a
              href="https://github.com/Vishnu11593/"
              className="p-3 rounded-full bg-blue-900/80 backdrop-blur-sm border border-blue-700 hover:bg-blue-700 hover:border-blue-500 transition-all duration-300"
              aria-label="GitHub Profile"
            >
              <GitHub className="w-6 h-6" />
            </a>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <a
              href="/Vishnu Vardhan Resume.pdf"
              download
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Download Resume</span>
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
                →
              </motion.span>
            </a>
            <button
              onClick={() => smoothScrollTo("experience")}
              className="px-8 py-3 border border-blue-500 text-blue-300 hover:bg-blue-600/20 rounded-full transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Explore My Work</span>
              <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
                ↓
              </motion.span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
