"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

export function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Array<{
    name: string
    role: string
    content: string
    rating: number
  }>
}) {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-blue-500/20 p-8"
        >
          {/* Stars */}
          <div className="flex gap-1 mb-4">
            {Array.from({ length: testimonials[current].rating }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </motion.div>
            ))}
          </div>

          {/* Content */}
          <motion.p className="text-slate-300 text-lg mb-6 leading-relaxed">
            "{testimonials[current].content}"
          </motion.p>

          {/* Author */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-white font-semibold">{testimonials[current].name}</p>
            <p className="text-blue-400 text-sm">{testimonials[current].role}</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={prev}
          className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        {/* Indicators */}
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === current ? "bg-blue-500" : "bg-slate-700"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={next}
          className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  )
}
