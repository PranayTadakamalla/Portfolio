"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import {
  ExternalLink,
  Github,
  Cpu,
  Globe,
  MessageSquare,
  Headphones,
  Utensils,
  FlaskRoundIcon as Flask,
  Calculator,
  TrelloIcon as TicTacToe,
  Sparkles,
  Bot,
  Braces,
} from "lucide-react"
import SectionHeading from "./SectionHeading"

// 3D Card effect component
const Card3D = ({ children }: { children: React.ReactNode }) => {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateXValue = (y - centerY) / 10
    const rotateYValue = (centerX - x) / 10

    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      className="h-full perspective-1000"
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.1s ease",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  )
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = [
    { id: "AI", label: "AI & ML", icon: <Cpu className="w-4 h-4" /> },
    { id: "Web", label: "Full-Stack", icon: <Globe className="w-4 h-4" /> },
  ]

  const projects = [
    {
      title: "Social Media Recommendation System",
      description: "ML-driven recommendation engine that increased content relevancy by 28% and boosted predicted user engagement by ~20%, using similarity modeling and behavioral analytics.",
      techStack: "Machine Learning, Python, Behavioral Analytics",
      link: "#",
      icon: <Bot className="w-6 h-6 text-indigo-400" />,
      type: "github",
      category: "AI",
      featured: true,
    },
    {
      title: "MEDI-CARE – Healthcare Management System",
      description: "Python-based healthcare platform that automated 70% of patient-data processing and reduced record handling time by ~40%, improving workflow efficiency.",
      techStack: "Python, Database Management, Healthcare Systems",
      link: "#",
      icon: <Flask className="w-6 h-6 text-green-400" />,
      type: "github",
      category: "AI",
      featured: true,
    },
    {
      title: "Fire Safety Detection (NLP)",
      description: "NLP-based fire-hazard detection model achieving 86% accuracy, enabling early risk identification through text-pattern analysis and automated hazard flagging.",
      techStack: "NLP, Python, Machine Learning, Text Analysis",
      link: "#",
      icon: <Cpu className="w-6 h-6 text-red-400" />,
      type: "github",
      category: "AI",
      featured: true,
    },
    {
      title: "Full-Stack Development Projects",
      description: "Developed multiple full-stack applications using React, Node.js, Express.js, MongoDB, and MySQL, building responsive UIs and scalable backend APIs during industry internship.",
      techStack: "React, Node.js, Express.js, MongoDB, MySQL, Full-Stack",
      link: "#",
      icon: <Globe className="w-6 h-6 text-blue-400" />,
      type: "github",
      category: "Web",
    },
  ]

  const filteredProjects = activeCategory ? projects.filter((project) => project.category === activeCategory) : projects

  return (
    <section id="projects" className="py-20 relative overflow-hidden bg-slate-950">
      {/* Background elements */}
      <div className="absolute inset-0 bg-black z-0"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading
          title="Projects"
          subtitle="AI/ML solutions and full-stack applications showcasing technical expertise"
        />

        {/* Category filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${
              activeCategory === null ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>All Projects</span>
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {category.icon}
              <span>{category.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <Card3D>
                  {/* Card with 3D effect */}
                  <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-indigo-500/20 h-full flex flex-col overflow-hidden">
                    {/* Featured badge */}
                    {project.featured && (
                      <div className="absolute top-4 right-4 px-2 py-1 bg-indigo-500/20 backdrop-blur-sm rounded-full text-xs text-indigo-300 flex items-center gap-1 border border-indigo-500/30">
                        <Sparkles className="w-3 h-3" />
                        <span>Featured</span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center mb-4">
                        <div className="p-3 rounded-full bg-slate-800 mr-4 border border-indigo-500/20">
                          {project.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white font-display">{project.title}</h3>
                      </div>

                      <p className="text-slate-300 mb-4">{project.description}</p>
                      <p className="text-sm text-slate-400 mb-6 mt-auto font-mono">{project.techStack}</p>

                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all duration-300"
                      >
                        {project.type === "github" ? (
                          <>
                            <Github className="w-4 h-4" />
                            View on GitHub
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4" />
                            Live Demo
                          </>
                        )}
                      </a>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
