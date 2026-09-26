import type { Metadata } from "next"
import Venture from "@/components/Venture"

export const metadata: Metadata = { title: "221B Labs", description: "221B Labs Private Limited \u2014 Festora event ticketing and Pathana Sakthi, a speech-AI read-along tutor." }

export default function Page() {
  return (
    <main id="main" className="pt-12">
      <Venture />
    </main>
  )
}
