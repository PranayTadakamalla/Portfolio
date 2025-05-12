"use client"

import { motion } from "framer-motion"
import { Mail, MapPin, Phone, ExternalLink } from "lucide-react"
import SectionHeading from "./SectionHeading"

// Contact card component
const ContactCard = ({
  icon: Icon,
  title,
  content,
  link,
  delay,
  color = "indigo",
}: {
  icon: any
  title: string
  content: string
  link: string
  delay: number
  color?: string
}) => {
  const colors = {
    indigo: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/30 hover:border-indigo-500/50",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/30 hover:border-blue-500/50",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/30 hover:border-purple-500/50",
  }

  const bgColor = colors[color as keyof typeof colors] || colors.indigo

  return (
    <motion.a
      href={link}
      className={`bg-gradient-to-br ${bgColor} backdrop-blur-md p-8 rounded-xl border transition-all duration-300 hover:-translate-y-2 group shadow-lg`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-slate-700 transition-colors duration-300">
        <Icon className={`w-8 h-8 text-${color}-400`} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-300 mb-4">{content}</p>
      <div className="flex items-center text-indigo-400 text-sm">
        <span>Connect</span>
        <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.a>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="py-20 relative overflow-hidden bg-slate-950">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-900 to-slate-950 z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading title="Let's Connect" />

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <ContactCard
            icon={Mail}
            title="Email"
            content="pranaytadakamalla@gmail.com"
            link="mailto:pranaytadakamalla@gmail.com"
            delay={0.1}
            color="indigo"
          />

          <ContactCard
            icon={Phone}
            title="Phone"
            content="+91 - 86881 83168"
            link="tel:+918688183168"
            delay={0.2}
            color="blue"
          />

          <ContactCard
            icon={MapPin}
            title="Location"
            content="Hyderabad, Telangana, India"
            link="#"
            delay={0.3}
            color="purple"
          />
        </div>
      </div>
    </section>
  )
}
