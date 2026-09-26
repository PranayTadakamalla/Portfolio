import type { Metadata } from "next"
import Contact from "@/components/Contact"

export const metadata: Metadata = { title: "Contact", description: "Get in touch with Sai Pranay Tadakamalla." }

export default function Page() {
  return (
    <main id="main" className="pt-12">
      <Contact />
    </main>
  )
}
