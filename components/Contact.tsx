"use client"

import { useState } from "react"
import { profile } from "@/lib/data"
import { Reveal, SplitWords } from "./ui/Reveal"
import Magnetic from "./ui/Magnetic"

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ name: "", message: "" })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(`Hello from ${form.name || "your portfolio"}`)}&body=${encodeURIComponent(form.message)}`

  return (
    <section id="contact" className="section relative overflow-hidden" aria-labelledby="contact-title">
      <div aria-hidden className="pointer-events-none absolute bottom-[-30vh] left-1/2 h-[70vh] w-[90vw] -translate-x-1/2 rounded-full bg-saffron/[0.12] blur-[160px]" />
      <div className="wrap relative">
        <Reveal>
          <span className="eyebrow">
            <span className="text-saffron">09</span> Contact
          </span>
        </Reveal>
        <h2 id="contact-title" className="h-display mt-8 max-w-[16ch]">
          <SplitWords text="Let's build something" />{" "}
          <span className="serif-accent">
            <SplitWords text="whole." delay={0.2} />
          </span>
        </h2>

        <div className="mt-16 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="max-w-md text-[17px] leading-relaxed text-bone-2">
              Research collaborations, 221B Labs partnerships, speaking, or a good poem — my inbox is open.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <button
                  type="button"
                  onClick={copy}
                  data-cursor="copy"
                  className="group inline-flex items-center gap-3 rounded-full bg-bone px-6 py-4 text-left text-ink transition-colors hover:bg-saffron"
                >
                  <span className="font-display text-base md:text-lg">{profile.email}</span>
                  <span className="rounded-full bg-ink px-3 py-1 font-mono text-[10px] text-bone" aria-live="polite">
                    {copied ? "Copied ✓" : "Copy"}
                  </span>
                </button>
              </Magnetic>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-6 text-[14px]">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">Phone</dt>
                <dd className="mt-1">
                  <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="link-underline text-bone">
                    {profile.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">Based in</dt>
                <dd className="mt-1 text-bone">{profile.location}</dd>
              </div>
            </dl>
            <ul className="mt-10 flex flex-wrap gap-2">
              {[
                ["GitHub", profile.links.github],
                ["LinkedIn", profile.links.linkedin],
                ["ORCID", profile.links.orcid],
                ["SSRN", profile.links.ssrn],
              ].map(([l, h]) => (
                <li key={l}>
                  <a href={h} target="_blank" rel="noreferrer" className="chip px-4 py-2 text-[12px] hover:border-saffron hover:text-saffron">
                    {l} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form
            className="card md:col-span-6 p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault()
              window.location.href = mailto
            }}
          >
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">Your name</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoComplete="name"
                className="mt-2 w-full border-b border-white/15 bg-transparent py-3 font-display text-xl text-bone outline-none transition-colors placeholder:text-bone-3/50 focus:border-saffron"
                placeholder="Ada Lovelace"
              />
            </label>
            <label className="mt-8 block">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">Message</span>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-2 w-full resize-none border-b border-white/15 bg-transparent py-3 text-[16px] text-bone outline-none transition-colors placeholder:text-bone-3/50 focus:border-saffron"
                placeholder="I'd love to talk about…"
              />
            </label>
            <button
              type="submit"
              className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full border border-saffron/60 px-6 py-4 text-sm text-saffron transition-colors hover:bg-saffron hover:text-ink"
            >
              Send via email ↗
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
