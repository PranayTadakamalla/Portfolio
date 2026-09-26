import type { Metadata } from "next"
import Journey from "@/components/Journey"

export const metadata: Metadata = { title: "Journey", description: "Experience, leadership, clubs, awards and education." }

export default function Page() {
  return (
    <main id="main" className="pt-12">
      <Journey />
    </main>
  )
}
