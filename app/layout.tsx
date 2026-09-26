import type { Metadata, Viewport } from "next"
import type React from "react"
import "@fontsource-variable/space-grotesk"
import "@fontsource-variable/inter"
import "@fontsource-variable/jetbrains-mono"
import "@fontsource/instrument-serif/400.css"
import "@fontsource/instrument-serif/400-italic.css"
import "@fontsource/noto-sans-telugu/telugu-400.css"
import "@fontsource/noto-serif-devanagari/devanagari-400.css"
import "./globals.css"
import Loader from "@/components/Loader"
import SmoothScroll from "@/components/SmoothScroll"
import Cursor from "@/components/Cursor"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { profile } from "@/lib/data"

const SITE = "https://pranaytadakamalla.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Sai Pranay Tadakamalla — AI Researcher, Founder & Writer",
  description:
    "Founder & CEO of 221B Labs and AI & ML researcher at Malla Reddy University. Quantum-inspired exploration, speech AI for Indian languages, four papers on SSRN.",
  keywords: ["Sai Pranay Tadakamalla", "221B Labs", "AI researcher", "reinforcement learning", "speech AI", "Festora", "Pathana Sakthi"],
  authors: [{ name: profile.name, url: SITE }],
  openGraph: {
    title: "Sai Pranay Tadakamalla",
    description: "AI researcher, founder of 221B Labs, and writer.",
    url: SITE,
    siteName: "Sai Pranay Tadakamalla",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Sai Pranay Tadakamalla" }],
    type: "profile",
  },
  twitter: { card: "summary_large_image", title: "Sai Pranay Tadakamalla", images: ["/og.jpg"] },
}

export const viewport: Viewport = { themeColor: "#07080b", width: "device-width", initialScale: 1 }

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: SITE,
  image: `${SITE}/img/pranay-640.webp`,
  jobTitle: "Founder & CEO, 221B Labs Private Limited",
  alumniOf: "Malla Reddy University",
  sameAs: [profile.links.github, profile.links.linkedin, profile.links.orcid, profile.links.ssrn],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-ink">
      <body className="bg-ink font-sans text-bone antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a href="#main" className="skip-link">Skip to content</a>
        <Loader />
        <SmoothScroll />
        <Cursor />
        <div className="grain" aria-hidden />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  )
}
