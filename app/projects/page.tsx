import type { Metadata } from "next"
import Projects from "@/components/Projects"

export const metadata: Metadata = { title: "Projects", description: "Security, AI and web projects from Sai Pranay Tadakamalla's GitHub." }

export default function Page() {
  return (
    <main id="main" className="pt-12">
      <Projects />
    </main>
  )
}
