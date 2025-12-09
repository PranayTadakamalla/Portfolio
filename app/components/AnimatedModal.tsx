"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export function AnimatedModal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.75, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.75,
      y: 50,
      transition: { duration: 0.2 },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-slate-900 rounded-lg p-6 max-w-md w-full mx-4 border border-blue-500/30"
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{title}</h2>
            <div className="text-gray-300 mb-6">{children}</div>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Tooltip({
  content,
  children,
  position = "top",
}: {
  content: string
  children: React.ReactNode
  position?: "top" | "bottom" | "left" | "right"
}) {
  const [isVisible, setIsVisible] = useState(false)

  const positionVariants = {
    top: { y: -10, x: 0 },
    bottom: { y: 10, x: 0 },
    left: { y: 0, x: -10 },
    right: { y: 0, x: 10 },
  }

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="absolute bg-slate-800 text-blue-300 px-3 py-1 rounded text-sm whitespace-nowrap border border-blue-500/30 z-50"
            initial={{ opacity: 0, ...positionVariants[position] }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, ...positionVariants[position] }}
            transition={{ duration: 0.2 }}
            style={{
              [position === "top" || position === "bottom"
                ? "left"
                : "top"]: "50%",
              transform: "translateX(-50%)",
              [position === "top" ? "bottom" : "top"]: "100%",
              marginTop: position === "top" ? "-8px" : "8px",
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<
    Array<{ id: number; message: string; type: "success" | "error" | "info" }>
  >([])

  const addNotification = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 3000)
  }

  const getColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  return {
    addNotification,
    NotificationList: () => (
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`${getColor(notif.type)} text-white px-4 py-3 rounded-lg shadow-lg`}
            >
              {notif.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    ),
  }
}
