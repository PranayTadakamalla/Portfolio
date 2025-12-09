"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export function FlipCard({
  front,
  back,
  className = "",
}: {
  front: React.ReactNode
  back: React.ReactNode
  className?: string
}) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <motion.div
      className={`relative w-full h-64 cursor-pointer ${className}`}
      onClick={() => setIsFlipped(!isFlipped)}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.6 }}
      style={{ perspective: 1000 }}
    >
      {/* Front */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-md rounded-2xl border border-blue-500/30 p-6 flex items-center justify-center"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <motion.div initial={{ rotateY: 0 }} animate={{ rotateY: isFlipped ? 180 : 0 }}>
          {front}
        </motion.div>
      </motion.div>

      {/* Back */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 backdrop-blur-md rounded-2xl border border-indigo-500/30 p-6 flex items-center justify-center"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        <motion.div
          initial={{ rotateY: 180 }}
          animate={{ rotateY: isFlipped ? 0 : 180 }}
        >
          {back}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
