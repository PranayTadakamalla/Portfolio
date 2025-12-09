"use client"

import { motion } from "framer-motion"
import { AnimatedCounter } from "./AnimatedCounter"

export function StatCard({
  label,
  value,
  suffix = "",
  icon: Icon,
  color = "blue",
}: {
  label: string
  value: number
  suffix?: string
  icon: React.ComponentType<{ className?: string }>
  color?: string
}) {
  const colorMap = {
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400",
    indigo: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 text-indigo-400",
    violet: "from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-400",
    green: "from-green-500/20 to-green-500/5 border-green-500/20 text-green-400",
    orange: "from-orange-500/20 to-orange-500/5 border-orange-500/20 text-orange-400",
  }

  return (
    <motion.div
      className={`bg-gradient-to-br ${colorMap[color as keyof typeof colorMap]} backdrop-blur-md p-6 rounded-2xl border hover:border-opacity-50 transition-all duration-300`}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.05, translateY: -5 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <motion.div
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-slate-300 font-medium">{label}</h3>
        <Icon className={`w-6 h-6 ${colorMap[color as keyof typeof colorMap].split(" ")[2]}`} />
      </motion.div>

      <motion.div
        className="text-4xl font-bold text-white"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, type: "spring" }}
      >
        <AnimatedCounter to={value} duration={2} suffix={suffix} />
      </motion.div>
    </motion.div>
  )
}

export function StatsDashboard({
  stats,
}: {
  stats: Array<{
    label: string
    value: number
    suffix?: string
    icon: React.ComponentType<{ className?: string }>
    color?: string
  }>
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  )
}
