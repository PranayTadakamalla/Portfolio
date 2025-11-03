"use client"

import { motion } from "framer-motion"
import { Briefcase, Calendar, MapPin, Zap, Users, Crown } from "lucide-react"
import SectionHeading from "./SectionHeading"

export default function Experience() {
  const experiences = [
    {
      period: "Jan 2025 - Jun 2025",
      role: "Project Manager",
      company: "Pramila Foundation",
      color: "indigo",
      type: "professional",
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
      period: "Apr 2025 - Oct 2025",
      role: "Vice-President",
      company: "Microsoft Learn Student Chapter, Malla Reddy University",
      color: "violet",
      type: "leadership",
      projects: [
        {
          title: "🚀 Strategic Leadership & Vision",
          description:
            "Leading strategic initiatives to foster a culture of continuous learning and innovation in cloud computing and AI technologies. Spearheading the chapter's digital transformation journey.",
        },
        {
          title: "🎯 Community Building & Engagement",
          description:
            "Orchestrating tech workshops, hackathons, and certification drives to empower students with cutting-edge Microsoft technologies. Building bridges between academia and industry.",
        },
        {
          title: "🌟 Mentorship & Development",
          description:
            "Mentoring fellow students in Azure, AI/ML, and modern development practices. Creating pathways for students to achieve Microsoft certifications and industry readiness.",
        },
      ],
    },
    {
      period: "Aug 2024 - Oct 2025",
      role: "Member",
      company: "GDG On Campus, Malla Reddy University",
      color: "blue",
      type: "leadership",
      projects: [
        {
          title: "🌍 Community Growth & Event Organization",
          description:
            "Collaborating with Google Developer Groups to organize workshops, study jams, and tech talks that promote open-source development and Google technologies.",
        },
        {
          title: "💡 Technical Workshops & Hackathons",
          description:
            "Coordinated and led hands-on sessions on technologies like Flutter, Firebase, and TensorFlow, enabling students to build real-world projects.",
        },
        {
          title: "🤝 Collaboration & Networking",
          description:
            "Strengthening connections between developers, innovators, and startups to foster a thriving local tech ecosystem within the campus.",
        },
      ],
    },
    {
      period: "Dec 2024 - Nov 2025",
      role: "Member",
      company: "Indian Knowledge Systems (IKS) Club, Malla Reddy University",
      color: "red",
      type: "member",
      projects: [
        {
          title: "🔬 Research & Innovation",
          description:
            "Contributing to research initiatives that bridge traditional Indian knowledge systems with modern technological applications, exploring AI-driven solutions for ancient wisdom preservation.",
        },
        {
          title: "📚 Knowledge Preservation",
          description:
            "Participating in digitization projects to preserve and modernize traditional Indian knowledge systems using contemporary technology frameworks and methodologies.",
        },
        {
          title: "🤝 Collaborative Learning",
          description:
            "Engaging in interdisciplinary collaborations to explore the intersection of traditional knowledge and emerging technologies like machine learning and data science.",
        },
      ],
    },
  ]

  return (
    <section id="experience" className="py-20 relative overflow-hidden bg-slate-950">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-900 to-slate-950 z-0"></div>

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
