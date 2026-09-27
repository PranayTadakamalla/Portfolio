"use client"

import Link from "next/link"
import { profile } from "@/lib/data"
import { PAGES } from "./Nav"

export default function Footer() {
  return (
    <footer className="relative z-[2] border-t border-white/[0.07]">
      <div className="wrap grid gap-10 pt-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-3xl text-bone">Sai Pranay Tadakamalla</p>
          <p className="mt-2 font-type text-[12px] uppercase tracking-[0.22em] text-bone-3">Consulting engineer · 221B Labs · Hyderabad</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-2 md:col-span-4">
          {PAGES.map((p) => (
            <Link key={p.href} href={p.href} className="link-underline w-fit text-[14px] text-bone-2 hover:text-bone">
              {p.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 text-[14px] md:col-span-3">
          <a href={`mailto:${profile.email}`} className="link-underline w-fit text-bone-2 hover:text-bone">{profile.email}</a>
          <a href={profile.links.github} target="_blank" rel="noreferrer" className="link-underline w-fit text-bone-2 hover:text-bone">GitHub ↗</a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="link-underline w-fit text-bone-2 hover:text-bone">LinkedIn ↗</a>
          <a href={profile.links.instagram} target="_blank" rel="noreferrer" className="link-underline w-fit text-bone-2 hover:text-bone">Instagram ↗</a>
        </div>
      </div>
      <div className="wrap overflow-hidden pt-10">
        <p
          aria-hidden
          className="select-none whitespace-nowrap text-center font-display text-[22vw] font-bold leading-[0.8] tracking-tightest text-transparent [-webkit-text-stroke:1px_rgba(212,169,79,0.22)]"
        >
          221B
        </p>
      </div>
      <div className="wrap flex flex-col items-start justify-between gap-4 py-8 font-type text-[12px] text-bone-3 md:flex-row md:items-center">
        <span>© {new Date().getFullYear()} {profile.name}. The game is afoot.</span>
        <a href={profile.resume} download className="hover:text-bone">
          Download résumé ↓
        </a>
      </div>
    </footer>
  )
}
