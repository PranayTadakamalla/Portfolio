"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Globe, MessageCircle, Check } from "lucide-react"
import SectionHeading from "./SectionHeading"

// 3D Globe Animation Component
const GlobeAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  return (
    <div ref={containerRef} className="h-full w-full flex items-center justify-center">
      <motion.div className="relative w-64 h-64" style={{ rotateY, scale }}>
        {/* Globe base */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600/80 to-indigo-800/80 shadow-xl overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-l border-white/10"
                style={{ left: `${(i + 1) * 12.5}%` }}
              ></div>
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-t border-white/10"
                style={{ top: `${(i + 1) * 12.5}%` }}
              ></div>
            ))}
          </div>

          {/* Continents (simplified) */}
          <div className="absolute w-20 h-12 bg-emerald-500/30 rounded-full top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute w-16 h-24 bg-emerald-500/30 rounded-full top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute w-24 h-16 bg-emerald-500/30 rounded-full top-2/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2"></div>

          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent"></div>
        </div>

        {/* Orbiting elements */}
        <motion.div
          className="absolute w-8 h-8 rounded-full bg-indigo-500/80 flex items-center justify-center text-white"
          animate={{
            x: [0, 80, 0, -80, 0],
            y: [-80, 0, 80, 0, -80],
            scale: [1, 1.2, 1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <MessageCircle className="w-4 h-4" />
        </motion.div>

        <motion.div
          className="absolute w-6 h-6 rounded-full bg-violet-500/80 flex items-center justify-center text-white"
          animate={{
            x: [60, 0, -60, 0, 60],
            y: [0, 60, 0, -60, 0],
            scale: [1, 1.1, 1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <Check className="w-3 h-3" />
        </motion.div>
      </motion.div>
    </div>
  )
}

// Language proficiency component
const LanguageProficiency = ({
  name,
  proficiency,
  level,
  index,
}: {
  name: string
  proficiency: string
  level: number
  index: number
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const x = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  // Generate dots for proficiency level
  const dots = Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className={`w-3 h-3 rounded-full ${i < level ? "bg-indigo-500" : "bg-slate-700"}`}></div>
  ))

  return (
    <motion.div
      ref={containerRef}
      style={{ x, opacity }}
      className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-indigo-500/20 shadow-lg hover:border-indigo-500/40 transition-all duration-300"
    >
      <div className="flex items-center mb-4">
        <div className="p-3 rounded-full bg-indigo-500/20 mr-4">
          <Globe className="w-6 h-6 text-indigo-400" />
        </div>
        <h3 className="text-2xl font-bold text-white">{name}</h3>
      </div>

      <p className="text-slate-300 mb-4">{proficiency}</p>

      <div className="flex space-x-2">{dots}</div>
    </motion.div>
  )
}

export default function Languages() {
  const languages = [
    {
      name: "Telugu",
      proficiency: "Native Proficiency",
      level: 5,
    },
    {
      name: "English",
      proficiency: "Professional Working Proficiency",
      level: 4,
    },
    {
      name: "Hindi",
      proficiency: "Limited Working Proficiency",
      level: 3,
    },
  ]

  return (
    <section id="languages" className="py-20 relative overflow-hidden bg-slate-950">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-900 to-slate-950 z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading title="Languages" />

        <div className="flex flex-col lg:flex-row items-center gap-12 mt-12">
          {/* 3D Globe Animation */}
          <motion.div
            className="lg:w-1/3 h-[300px]"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlobeAnimation />
          </motion.div>

          {/* Language Cards */}
          <div className="lg:w-2/3 space-y-8">
            {languages.map((lang, index) => (
              <LanguageProficiency
                key={index}
                name={lang.name}
                proficiency={lang.proficiency}
                level={lang.level}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
