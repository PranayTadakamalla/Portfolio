"use client"

import { GraduationCap, Calendar, Award, BookOpen, Star } from "lucide-react"
import SectionHeading from "./SectionHeading"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

// 3D Book Animation Component
const BookAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const rotateX = useTransform(scrollYProgress, [0, 1], [20, -20])
  const rotateY = useTransform(scrollYProgress, [0, 1], [-15, 15])
  const rotateZ = useTransform(scrollYProgress, [0, 1], [-5, 5])
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <div ref={containerRef} className="h-full w-full flex items-center justify-center">
      <motion.div
        className="relative w-64 h-80 perspective-1000"
        style={{
          rotateX,
          rotateY,
          rotateZ,
          translateY,
        }}
      >
        {/* Book cover */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-lg shadow-xl border-t-8 border-l-8 border-indigo-300/20 flex flex-col justify-between p-6">
          <div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Education</h3>
            <p className="text-indigo-200 text-sm">The journey of learning and growth</p>
          </div>

          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
          </div>
        </div>

        {/* Book pages */}
        <div className="absolute inset-y-0 right-0 w-[calc(100%-8px)] bg-white rounded-r-lg shadow-md transform origin-left rotate-y-[5deg] z-[-1]"></div>
        <div className="absolute inset-y-0 right-0 w-[calc(100%-12px)] bg-gray-100 rounded-r-lg shadow-md transform origin-left rotate-y-[10deg] z-[-2]"></div>
        <div className="absolute inset-y-0 right-0 w-[calc(100%-16px)] bg-gray-200 rounded-r-lg shadow-md transform origin-left rotate-y-[15deg] z-[-3]"></div>
      </motion.div>
    </div>
  )
}

// Education card component
const EducationCard = ({
  degree,
  institution,
  period,
  additional,
  icon: Icon,
  index,
}: {
  degree: string
  institution: string
  period: string
  additional: string
  icon: any
  index: number
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  })

  const x = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

  return (
    <motion.div ref={cardRef} style={{ x, opacity, scale }} className="relative">
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md p-6 rounded-xl border border-indigo-500/20 relative overflow-hidden hover:border-indigo-500/40 transition-colors duration-300 shadow-lg">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-br-full z-0"></div>

        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-indigo-500/20 mr-4">
              <Icon className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white font-display">{degree}</h3>
          </div>
          <p className="text-xl text-slate-300 mb-2">{institution}</p>
          <p className="text-slate-400 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {period}
          </p>
          <p className="text-slate-300 font-medium mt-2">{additional}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function Education() {
  const education = [
    {
      degree: "B.Tech in Artificial Intelligence & Machine Learning",
      institution: "Malla Reddy University",
      period: "2023 – 2027 (Pursuing)",
      additional: "CGPA: 8.93",
      icon: BookOpen,
    },
    {
      degree: "Intermediate (12th Grade)",
      institution: "Geetanjali Jr. College",
      period: "2021 – 2023",
      additional: "Percentage: 86%",
      icon: Award,
    },
    {
      degree: "10th Grade",
      institution: "Kendriya Vidyalaya",
      period: "2011 – 2021",
      additional: "Percentage: 76%",
      icon: GraduationCap,
    },
  ]

  return (
    <section id="education" className="py-20 relative overflow-hidden bg-slate-950">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-900 to-slate-950 z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading title="Education" />

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* 3D Book Animation */}
          <motion.div
            className="lg:w-1/3 h-[400px]"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <BookAnimation />
          </motion.div>

          {/* Education Cards */}
          <div className="lg:w-2/3 space-y-8">
            {education.map((edu, index) => (
              <EducationCard
                key={index}
                degree={edu.degree}
                institution={edu.institution}
                period={edu.period}
                additional={edu.additional}
                icon={edu.icon}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
