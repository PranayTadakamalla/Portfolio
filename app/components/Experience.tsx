"use client"

import { motion } from "framer-motion"
import { Briefcase, Calendar, MapPin, Zap } from "lucide-react"
import SectionHeading from "./SectionHeading"

export default function Experience() {
  const experiences = [
    {
      period: "Feb 2025 - Present",
      role: "Project Manager",
      company: "Pramila Foundation",
      color: "indigo",
      projects: [
        {
          title: "🌐 Website Development & Maintenance",
          description:
            "Oversaw the creation of the foundation's website, including design, functionality, and content updates. Continuously ensuring the website aligns with the foundation's goals and provides an accessible, user-friendly experience.",
        },
        {
          title: "📱 Social Media Strategy & Management",
          description:
            "Developed and implemented social media strategies to increase engagement and visibility for Pramila Foundation. Managed content creation, scheduling, and performance analytics for platforms like Facebook, Instagram, and Twitter.",
        },
        {
          title: "📋 Project Coordination & Team Management",
          description:
            "Responsible for overseeing and guiding the activities of the team. Assigned roles and ensured smooth communication across all projects, focusing on both short-term deliverables and long-term goals for the foundation.",
        },
      ],
    },
    {
      period: "Mar 2025 - Present",
      role: "Web Developer",
      company: "Unifesto",
      color: "blue",
      projects: [
        {
          title: "🌐 Event Management Website",
          description:
            "Developed an event management platform for Unifesto, a student initiative startup. Responsible for designing the website, implementing key features like event registration, event schedule management, and user authentication.",
        },
        {
          title: "🛠️ Website Maintenance & Updates",
          description:
            "Ongoing maintenance of the Unifesto website, ensuring timely updates, bug fixes, and implementing new features based on feedback from users and event organizers.",
        },
      ],
    },
    {
      period: "Oct 2024 - Nov 2024",
      role: "Front-End Developer Intern",
      company: "CodeAlpha",
      color: "violet",
      projects: [
        {
          title: "🎵 Music Player",
          description:
            "Developed an interactive web-based music player using HTML, CSS, and JavaScript, featuring custom audio controls and playlist functionality.",
        },
        {
          title: "🖼️ Image Gallery",
          description:
            "Created a dynamic and responsive image gallery with JavaScript, implementing features like image zoom, lightbox view, and filtering.",
        },
      ],
    },
  ]

  return (
    <section id="experience" className="py-20 relative overflow-hidden bg-slate-950">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-900 to-slate-950 z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading title="Experience" />

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
                    <Briefcase className={`w-8 h-8 text-${exp.color}-400`} />
                  </div>
                </div>

                {/* Content */}
                <div className="ml-8 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-indigo-500/20 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2 font-display">
                      <Zap className={`w-5 h-5 text-${exp.color}-400`} />
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
