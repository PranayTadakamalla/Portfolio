"use client"

import { motion } from "framer-motion"
import { Code, Database, Server, PencilRuler, FileText, Layers, Cloud, Network, Code2 } from "lucide-react"
import SectionHeading from "./SectionHeading"

// Animated background component
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-slate-900 to-slate-950 z-0"></div>

      {/* Animated particles */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-indigo-500/30"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.5 + 0.3,
            }}
            animate={{
              x: [
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
              ],
              y: [
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
              ],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="skill-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#skill-grid)" />
        </svg>
      </div>
    </div>
  )
}

// Skill card component
const SkillCard = ({
  icon: Icon,
  title,
  technologies,
  description,
  color = "indigo",
}: {
  icon: any
  title: string
  technologies: string
  description: string
  color?: string
}) => {
  const colors = {
    indigo: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 text-indigo-400",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400",
    green: "from-green-500/20 to-green-500/5 border-green-500/20 text-green-400",
    red: "from-red-500/20 to-red-500/5 border-red-500/20 text-red-400",
    teal: "from-teal-500/20 to-teal-500/5 border-teal-500/20 text-teal-400",
    violet: "from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-400",
    orange: "from-orange-500/20 to-orange-500/5 border-orange-500/20 text-orange-400",
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400",
  }

  const colorClass = colors[color as keyof typeof colors] || colors.indigo

  return (
    <motion.div
      className={`bg-gradient-to-br ${colorClass} backdrop-blur-md p-6 rounded-xl border hover:border-opacity-50 transition-all duration-300 h-full`}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.2)" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-4">
        <div className="p-3 rounded-full bg-slate-800 mr-4 border border-slate-700">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white font-display">{title}</h3>
      </div>
      <p className="text-sm text-slate-300 font-mono mb-4">{technologies}</p>
      <p className="text-slate-300">{description}</p>
    </motion.div>
  )
}

export default function Skills() {
  const skills = [
    {
      icon: Code,
      title: "Front-End Development",
      technologies: "HTML, CSS, JavaScript, React.js",
      description: "Building modern, responsive user interfaces with React.js and core front-end technologies.",
      color: "blue",
    },
    {
      icon: Server,
      title: "Back-End Development",
      technologies: "Python, Java, C, C++",
      description: "Developing scalable back-end solutions with multiple programming languages.",
      color: "green",
    },
    {
      icon: Layers,
      title: "Frameworks & Stacks",
      technologies: "MERN, Django, Spring Boot",
      description: "Expertise in full-stack development using modern frameworks for web applications.",
      color: "violet",
    },
    {
      icon: Database,
      title: "Databases",
      technologies: "MongoDB, MySQL",
      description: "Efficient database design and management for optimal data handling.",
      color: "red",
    },
    {
      icon: Network,
      title: "RESTful API Development",
      technologies: "REST API, JSON, Fetch, Axios",
      description: "Designing and implementing secure and efficient APIs for seamless data communication.",
      color: "teal",
    },
    {
      icon: Code2,
      title: "Data Interchange",
      technologies: "JSON, XML",
      description: "Working with structured data formats for APIs, databases, and software applications.",
      color: "cyan",
    },
    {
      icon: Cloud,
      title: "Salesforce Administration",
      technologies: "Salesforce CRM",
      description: "Managing Salesforce applications, workflows, and automation for business processes.",
      color: "indigo",
    },
    {
      icon: PencilRuler,
      title: "Design Tools",
      technologies: "Canva",
      description: "Creating visually appealing designs for presentations, social media, and branding.",
      color: "orange",
    },
    {
      icon: FileText,
      title: "Microsoft Office",
      technologies: "Word, Excel, PowerPoint, Outlook",
      description: "Proficient in document creation, data analysis, presentations, and email management.",
      color: "blue",
    },
  ]

  return (
    <section id="skills" className="py-20 relative overflow-hidden bg-slate-950">
      <AnimatedBackground />

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading title="Technical Skills" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <SkillCard
              key={index}
              icon={skill.icon}
              title={skill.title}
              technologies={skill.technologies}
              description={skill.description}
              color={skill.color}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
