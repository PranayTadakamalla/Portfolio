import type { Metadata } from "next"
import Beyond from "@/components/Beyond"

export const metadata: Metadata = { title: "Writing", description: "Poetry, writing and the habits of observation." }

export default function Page() {
  return (
    <main id="main" className="pt-12">
      <Beyond />
    </main>
  )
}
