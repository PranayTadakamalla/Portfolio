import "./globals.css"
import { Inter, Space_Grotesk } from "next/font/google"
import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import LoadingScreen from "@/app/components/LoadingScreen"
import { LoadingProvider } from "@/app/components/LoadingProvider"
import { InteractiveCursor, FloatingParticles, AnimatedBackground } from "@/app/components/InteractiveEffects"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" })

export const metadata = {
  title: "Vishnu Vardhan Yeduresi | Professional Portfolio",
  description: "Portfolio of Vishnu Vardhan Yeduresi - Professional achievements, experience, and projects.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-black text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <LoadingProvider>
            <AnimatedBackground />
            <FloatingParticles />
            <InteractiveCursor />
            <LoadingScreen />
            {children}
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
