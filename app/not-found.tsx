import Link from "next/link"
import { SherlockFace } from "@/components/Guide"

export default function NotFound() {
  return (
    <main id="main" className="wrap grid min-h-[80svh] place-items-center pt-24 text-center">
      <div>
        <SherlockFace className="mx-auto h-32 w-32" />
        <p className="mt-6 font-type text-[12px] uppercase tracking-[0.3em] text-brass">Case 404 · Unsolved</p>
        <h1 className="h-display mt-4 text-[clamp(2.6rem,7vw,5.5rem)]">
          This page has <span className="serif-accent">vanished.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-bone-2">When you have eliminated the impossible, whatever remains — is probably the home page.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink hover:bg-bone">
          Back to 221B ↗
        </Link>
      </div>
    </main>
  )
}
