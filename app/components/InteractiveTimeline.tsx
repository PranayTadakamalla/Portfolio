"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export function InteractiveTimeline({
  items,
}: {
  items: Array<{
    year: string
    title: string
    description: string
    icon?: React.ReactNode
  }>
}) {
  const [selected, setSelected] = useState(0)

  return (
    <div className="w-full">
      {/* Timeline */}
      <div className="flex justify-between items-center mb-8 overflow-x-auto pb-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center min-w-max"
            onClick={() => setSelected(index)}
          >
            {/* Year label */}
            <motion.button
              className={`px-4 py-2 rounded-full font-semibold transition-colors cursor-pointer ${
                selected === index
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.year}
            </motion.button>

            {/* Connecting line */}
            {index < items.length - 1 && (
              <motion.div
                className="w-1 h-12 bg-gradient-to-b from-blue-500 to-slate-800"
                animate={{
                  scaleY: selected >= index ? 1 : 0.5,
                  opacity: selected >= index ? 1 : 0.3,
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={selected}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-blue-500/20 p-8"
      >
        {items[selected].icon && (
          <motion.div
            className="mb-4 text-blue-400"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
          >
            {items[selected].icon}
          </motion.div>
        )}
        <h3 className="text-2xl font-bold text-white mb-3">{items[selected].title}</h3>
        <p className="text-slate-300 leading-relaxed">{items[selected].description}</p>
      </motion.div>
    </div>
  )
}
