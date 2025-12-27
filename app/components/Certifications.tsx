"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Award, CheckCircle, ExternalLink } from "lucide-react"
import SectionHeading from "./SectionHeading"

// Certificate card component
const CertificateCard = ({
  title,
  issuer,
  year,
  index,
}: {
  title: string
  issuer: string
  year: number
  index: number
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.8])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.95])
  const rotate = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? 2 : -2, index % 2 === 0 ? -2 : 2])

  return (
    <motion.div ref={cardRef} style={{ y, opacity, scale, rotate }} className="h-full">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-indigo-500/20 h-full shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 group">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-full bg-indigo-500/20">
            <Award className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="text-indigo-400 font-mono">{year}</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-slate-400 mb-4">{issuer}</p>

        <div className="flex items-center text-indigo-400 text-sm mt-auto">
          <CheckCircle className="w-4 h-4 mr-1" />
          <span>Verified</span>
          <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </motion.div>
  )
}

// Floating particles animation
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-indigo-500/20"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: Math.random() * 0.5 + 0.5,
            opacity: Math.random() * 0.5 + 0.3,
          }}
          animate={{
            x: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
            y: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

export default function Certifications() {
  const certifications = [
    {
      title: "Career Essentials in Generative AI",
      issuer: "Microsoft & LinkedIn",
      year: 2024,
    },
    {
      title: "Elements of AI: Introduction to AI",
      issuer: "University of Helsinki",
      year: 2024,
    },
    {
      title: "Professional Soft Skills Learning Pathway",
      issuer: "LinkedIn",
      year: 2023,
    },
    {
      title: "Career Essentials in Project Management",
      issuer: "Microsoft",
      year: 2024,
    },
    {
      title: "Managing Projects",
      issuer: "Project Management Institute",
      year: 2024,
    },
    {
      title: "Introduction to Responsible AI",
      issuer: "Google",
      year: 2024,
    },
  ]

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const headerY = useTransform(scrollYProgress, [0, 0.5], [100, 0])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return (
    <section id="certifications" className="py-20 relative overflow-hidden bg-slate-950" ref={containerRef}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-slate-900 to-slate-950 z-0"></div>
      <FloatingParticles />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div style={{ y: headerY, opacity: headerOpacity }}>
          <SectionHeading title="Certifications" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {certifications.map((cert, index) => (
            <CertificateCard key={index} title={cert.title} issuer={cert.issuer} year={cert.year} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
