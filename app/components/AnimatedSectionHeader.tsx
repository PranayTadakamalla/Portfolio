"use client"

import { motion } from "framer-motion"

interface AnimatedSectionHeaderProps {
  title: string
}

export default function AnimatedSectionHeader({ title }: AnimatedSectionHeaderProps) {
  return (
    <motion.div
      className="mb-12 text-center relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 inline-block">
        {title}
      </h2>
      <motion.div
        className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mx-auto mt-2 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        initial={{ width: 0 }}
        whileInView={{ width: 96 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
    </motion.div>
  )
}
