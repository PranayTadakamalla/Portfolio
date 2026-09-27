import type { Metadata } from "next"
import Beyond from "@/components/Beyond"
import Poems from "@/components/Poems"

export const metadata: Metadata = { title: "Writing", description: "Poems by Sai Pranay Tadakamalla in English, Hindi–Urdu and Telugu — love, longing, heartbreak and the self." }

export default function Page() {
  return (
    <main id="main" className="pt-12">
      <Beyond />
      <Poems />
    </main>
  )
}
