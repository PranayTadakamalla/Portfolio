import type { Metadata } from "next"
import About from "@/components/About"
import Skills from "@/components/Skills"

export const metadata: Metadata = { title: "About", description: "Sai Pranay Tadakamalla \u2014 AI & ML undergraduate, founder of 221B Labs, researcher and writer." }

export default function Page() {
  return (
    <main id="main" className="pt-12">
      <About />
      <Skills />
    </main>
  )
}
