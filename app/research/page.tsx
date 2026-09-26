import type { Metadata } from "next"
import Research from "@/components/Research"
import Publications from "@/components/Publications"

export const metadata: Metadata = { title: "Research", description: "Tunnelling Through Deception, the memory gap between prediction and explanation, and four papers on SSRN." }

export default function Page() {
  return (
    <main id="main" className="pt-12">
      <Research />
      <Publications />
    </main>
  )
}
