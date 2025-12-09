"use client"

import { motion } from "framer-motion"
import { Briefcase, Calendar, MapPin, Zap, Users, Crown } from "lucide-react"
import SectionHeading from "./SectionHeading"

export default function Experience() {
const experiences = [
  {
    period: "Jul 2024 – Jul 2025",
    role: "Full-Stack Development Intern",
    company: "Edureka | Veranda Enterprise",
    color: "blue",
    type: "internship",
    projects: [
      {
        title: "Full-Stack Application Development",
        description:
          "Developed full-stack applications using React, Node.js, Express.js, MongoDB, and MySQL, building responsive UIs and scalable backend APIs.",
      },
      {
        title: "Technology Stack Mastery",
        description:
          "Gained hands-on experience across the complete MERN stack with focus on frontend development (React, responsive design) and backend architecture (Node.js, Express.js, RESTful APIs).",
      },
      {
        title: "Database Management",
        description:
          "Worked with both NoSQL (MongoDB) and relational (MySQL) databases, implementing efficient data models and optimization strategies for scalable applications.",
      },
    ],
  },
  {
    period: "Current",
    role: "President",
    company: "Alan Turing Club",
    color: "violet",
    type: "leadership",
    projects: [
      {
        title: "Technical Leadership",
        description:
          "Led technical initiatives, organized workshops, and mentored students in software development and AI/ML activities.",
      },
      {
        title: "Community Building",
        description:
          "Fostered a vibrant community of developers and enthusiasts, providing guidance and support for learning and growth.",
      },
    ],
  },
  {
    period: "Current",
    role: "Board Member",
    company: "CSI (Computer Society of India), MRUH",
    color: "green",
    type: "leadership",
    projects: [
      {
        title: "Technical Event Planning",
        description:
          "Contributed to technical event planning, student coordination, and community-driven learning programs.",
      },
      {
        title: "Community Engagement",
        description:
          "Supported initiatives that promote computer science knowledge and professional development within the institution.",
      },
    ],
  },
  {
    period: "Current",
    role: "Board Member",
    company: "IE Cell (Innovation & Entrepreneurship Cell), MRUH",
    color: "orange",
    type: "leadership",
    projects: [
      {
        title: "Innovation Initiatives",
        description:
          "Supported innovation-focused events, project mentoring, and student engagement initiatives.",
      },
      {
        title: "Entrepreneurship Support",
        description:
          "Facilitated the development of innovative ideas and supported students in turning concepts into viable projects.",
      },
    ],
  },
];

  return (
    <section id="experience" className="py-20 relative overflow-hidden bg-slate-950">
      {/* Background elements */}
      <div className="absolute inset-0 bg-black z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading title="Experience & Leadership" />

        <div className="max-w-5xl mx-auto">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className="mb-12 relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Timeline connector */}
              {index < experiences.length - 1 && (
                <div className="absolute top-16 bottom-0 left-8 w-0.5 bg-gradient-to-b from-indigo-500 to-blue-500">
                  <motion.div
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-white"
                    animate={{
                      y: [0, 100, 200, 300, 400],
                      opacity: [1, 0.8, 0.6, 0.4, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                </div>
              )}

              <div className="flex items-start">
                {/* Timeline dot */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center z-10 relative border border-indigo-500/30">
                    {exp.type === "leadership" ? (
                      <Crown className={`w-8 h-8 text-${exp.color}-400`} />
                    ) : (
                      <Briefcase className={`w-8 h-8 text-${exp.color}-400`} />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="ml-8 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-indigo-500/20 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2 font-display">
                      {exp.type === "leadership" ? (
                        <Users className={`w-5 h-5 text-${exp.color}-400`} />
                      ) : (
                        <Zap className={`w-5 h-5 text-${exp.color}-400`} />
                      )}
                      {exp.role}
                    </h3>
                    <div className="flex items-center text-indigo-400 mt-2 md:mt-0">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  <div className="flex items-center mb-6">
                    <MapPin className="w-4 h-4 text-slate-400 mr-1" />
                    <span className="text-slate-300">{exp.company}</span>
                    {exp.type === "leadership" && (
                      <span className="ml-3 px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full border border-violet-500/30">
                        Leadership
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    {exp.projects.map((project, i) => (
                      <motion.div
                        key={i}
                        className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 group hover:border-indigo-500/30 transition-colors duration-300"
                        whileHover={{ x: 5 }}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.1 + 0.2 }}
                      >
                        <h4 className="text-lg font-semibold text-white mb-2">{project.title}</h4>
                        <p className="text-slate-300">{project.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
