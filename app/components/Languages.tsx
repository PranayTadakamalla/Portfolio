"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Globe } from "lucide-react"
import SectionHeading from "./SectionHeading"

// Language flip card component
function LanguageCard({
  name,
  proficiency,
  level,
  index,
}: {
  name: string
  proficiency: string
  level: number
  index: number
}) {
  const [flipped, setFlipped] = useState(false)

  const dots = Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className={`w-3 h-3 rounded-full ${i < level ? "bg-indigo-500" : "bg-slate-700"}`}></div>
  ))

  // Back content per language
  const backContent: { [k: string]: { text: string; style?: any } } = {
    English: { text: "Hello, this is Vishnu Vardhan Yeduresi." },
    Telugu: {
      text: "హలో, ఇది విష్ణు వర్ధన్ యెడురెసి.",
      style: { fontFamily: `'Noto Sans Telugu', system-ui, -apple-system, "Segoe UI", Roboto` },
    },
    Hindi: {
      text: "नमस्ते, मैं विष्णु वर्धन येदुरेसी हूँ।",
      style: { fontFamily: `'Noto Sans Devanagari', system-ui, -apple-system, "Segoe UI", Roboto` },
    },
  }

  const back = backContent[name as keyof typeof backContent] || { text: "Hello, this is Vishnu Vardhan Yeduresi." }

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div
        className="relative w-full h-80 cursor-pointer"
        style={{ perspective: 1000 }}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
      >
        <div
          className="relative w-full h-full transition-all duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-slate-800 p-6 rounded-xl border border-indigo-500/20 shadow-lg flex flex-col justify-between"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div>
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-indigo-500/20 mr-4">
                  <Globe className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">{name}</h3>
              </div>

              <p className="text-slate-300 mb-4">{proficiency}</p>
            </div>

            <div className="flex space-x-2">{dots}</div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-indigo-900/20 p-6 rounded-xl border border-indigo-500/20 shadow-lg flex items-center justify-center"
            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
          >
            <div className="text-center">
              <p className="text-lg text-white font-semibold" style={back.style || {}}>
                {back.text}
              </p>
            </div>
          </div>
        </div>
      </div>
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
      <div className="absolute inset-0 bg-black z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading title="Languages" />

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {languages.map((lang, index) => (
            <LanguageCard key={index} name={lang.name} proficiency={lang.proficiency} level={lang.level} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
