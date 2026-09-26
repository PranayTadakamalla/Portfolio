import type { Metadata, Viewport } from "next"
import type React from "react"
import "@fontsource-variable/playfair-display"
import "@fontsource/cormorant-garamond/500.css"
import "@fontsource/cormorant-garamond/500-italic.css"
import "@fontsource/cormorant-garamond/600-italic.css"
import "@fontsource/special-elite"
import "@fontsource-variable/inter"
import "@fontsource-variable/jetbrains-mono"
import "@fontsource/noto-sans-telugu/telugu-400.css"
import "./globals.css"
import Loader from "@/components/Loader"
import SmoothScroll from "@/components/SmoothScroll"
import Cursor from "@/components/Cursor"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import Guide from "@/components/Guide"
import { profile } from "@/lib/data"

const SITE = "https://pranaytadakamalla.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Sai Pranay Tadakamalla — AI Researcher, Founder & Writer", template: "%s · Sai Pranay Tadakamalla" },
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

export const viewport: Viewport = { themeColor: "#0f0c0a", width: "device-width", initialScale: 1 }

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
    <html lang="en" className="bg-ink" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("seen221b")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("seen")}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-ink font-sans text-bone antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a href="#main" className="skip-link">Skip to content</a>
        <Loader />
        <SmoothScroll />
        <Cursor />
        <div className="fog" aria-hidden />
        <div className="grain" aria-hidden />
        <Nav />
        <div className="relative z-[2]">{children}</div>
        <Footer />
        <Guide />
      </body>
    </html>
  )
}
