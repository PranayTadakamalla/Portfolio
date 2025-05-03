"use client"

import type React from "react"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react"
import SectionHeading from "./SectionHeading"

// 3D Contact Form Animation
const ContactFormAnimation = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true)
      setFormData({ name: "", email: "", message: "" })

      // Reset after showing success message
      setTimeout(() => {
        setIsSubmitted(false)
      }, 3000)
    }, 1000)
  }

  return (
    <motion.div
      className="bg-slate-800/80 backdrop-blur-md rounded-xl border border-indigo-500/20 overflow-hidden shadow-xl"
      initial={{ rotateY: 10 }}
      whileHover={{ rotateY: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-6">Get In Touch</h3>

        {isSubmitted ? (
          <motion.div
            className="flex flex-col items-center justify-center py-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">Message Sent!</h4>
            <p className="text-slate-300 text-center">Thank you for reaching out. I'll get back to you soon.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                placeholder="Your name"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white resize-none"
                placeholder="Your message..."
              ></textarea>
            </div>

            <motion.button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </motion.button>
          </form>
        )}
      </div>
    </motion.div>
  )
}

// Contact card component
const ContactCard = ({
  icon: Icon,
  title,
  content,
  link,
  delay,
}: {
  icon: any
  title: string
  content: string
  link: string
  delay: number
}) => {
  return (
    <motion.a
      href={link}
      className="bg-slate-800/80 backdrop-blur-md p-6 rounded-xl border border-indigo-500/20 flex flex-col items-center text-center hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <motion.div
        className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 transition-colors duration-300"
        whileHover={{ rotate: 10 }}
      >
        <Icon className="w-8 h-8 text-indigo-400" />
      </motion.div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-300">{content}</p>
    </motion.a>
  )
}

// Floating particles animation
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
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
            x: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
            y: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
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

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const headerY = useTransform(scrollYProgress, [0, 0.5], [100, 0])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return (
    <section id="contact" className="py-20 relative overflow-hidden bg-slate-950" ref={containerRef}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-900 to-slate-950 z-0"></div>
      <FloatingParticles />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div style={{ y: headerY, opacity: headerOpacity }}>
          <SectionHeading title="Let's Connect" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <div className="space-y-6">
            <ContactCard
              icon={Mail}
              title="Email"
              content="pranaytadakamalla@gmail.com"
              link="mailto:pranaytadakamalla@gmail.com"
              delay={0.1}
            />

            <ContactCard icon={Phone} title="Phone" content="+91 - 86881 83168" link="tel:+918688183168" delay={0.2} />

            <ContactCard icon={MapPin} title="Location" content="Hyderabad, Telangana, India" link="#" delay={0.3} />
          </div>

          <ContactFormAnimation />
        </div>
      </div>
    </section>
  )
}
