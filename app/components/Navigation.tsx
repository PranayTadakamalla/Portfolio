"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Home, User, Briefcase, Code, GraduationCap, MessageSquare, Cpu, ChevronUp } from "lucide-react"
import { smoothScrollTo } from "@/utils/smoothScroll"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [scrollY, setScrollY] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const navItems = [
    { id: "hero", label: "Home", icon: <Home className="w-5 h-5" /> },
    { id: "about", label: "About", icon: <User className="w-5 h-5" /> },
    { id: "experience", label: "Experience", icon: <Briefcase className="w-5 h-5" /> },
    { id: "skills", label: "Skills", icon: <Code className="w-5 h-5" /> },
    { id: "projects", label: "Projects", icon: <Cpu className="w-5 h-5" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="w-5 h-5" /> },
    { id: "contact", label: "Contact", icon: <MessageSquare className="w-5 h-5" /> },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      setShowScrollTop(window.scrollY > 500)

      // Determine active section based on scroll position
      const sections = navItems.map((item) => item.id)
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [navItems])

  const handleNavClick = (id: string) => {
    smoothScrollTo(id)
    setIsOpen(false)
  }

  return (
    <>
      {/* Fixed Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        initial={{ y: -100 }}
        animate={{
          y: 0,
          backgroundColor: scrollY > 50 ? "rgba(15, 23, 42, 0.9)" : "rgba(15, 23, 42, 0.4)",
        }}
        style={{ backdropFilter: "blur(10px)" }}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            className="text-2xl font-bold text-white font-display"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
              Sai Pranay
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <motion.li key={item.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`relative px-3 py-2 rounded-full flex items-center gap-2 transition-colors ${
                      activeSection === item.id
                        ? "text-white bg-indigo-600"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Mobile Navigation Toggle */}
          <motion.button
            className="md:hidden bg-slate-800/80 backdrop-blur-md p-3 rounded-full shadow-lg"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-md md:hidden pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.ul
              className="flex flex-col items-center justify-center h-full gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {navItems.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`text-2xl font-medium flex items-center gap-3 ${
                      activeSection === item.id ? "text-indigo-400" : "text-slate-300"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={() => smoothScrollTo("hero")}
            className="fixed bottom-8 right-8 z-40 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              boxShadow: [
                "0 4px 6px rgba(79, 70, 229, 0.2)",
                "0 4px 15px rgba(79, 70, 229, 0.4)",
                "0 4px 6px rgba(79, 70, 229, 0.2)",
              ],
            }}
            exit={{ opacity: 0, scale: 0, rotate: 180 }}
            transition={{
              duration: 0.3,
              boxShadow: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
              },
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
