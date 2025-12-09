"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export function SkillBar({
  name,
  percentage,
  icon: Icon,
  color = "blue",
}: {
  name: string
  percentage: number
  icon: React.ComponentType<{ className?: string }>
  color?: string
}) {
  const [isHovered, setIsHovered] = useState(false)

  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    indigo: "from-indigo-500 to-indigo-600",
    violet: "from-violet-500 to-violet-600",
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600",
  }

  return (
    <motion.div
      className="space-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-blue-400" />
          <span className="text-slate-300 font-medium">{name}</span>
        </div>
        <motion.span
          className="text-sm text-blue-400 font-semibold"
          animate={{ scale: isHovered ? 1.2 : 1 }}
        >
          {percentage}%
        </motion.span>
      </div>

      {/* Skill bar */}
      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${colorMap[color as keyof typeof colorMap]} rounded-full shadow-lg shadow-blue-500/50`}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)" }}
        />
      </div>
    </motion.div>
  )
}

export function SkillCategory({
  category,
  skills,
}: {
  category: string
  skills: Array<{
    name: string
    percentage: number
    icon: React.ComponentType<{ className?: string }>
    color?: string
  }>
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-bold text-white">{category}</h3>
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <SkillBar {...skill} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
