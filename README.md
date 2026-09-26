# Sai Pranay Tadakamalla — Portfolio

Personal site: AI researcher, founder of 221B Labs, writer.

## Stack
- **Next.js 16 / React 19**, statically prerendered
- **3D:** three.js via React Three Fiber, Drei and postprocessing (bloom, vignette)
  - Hero: 16k-particle GPU field (custom GLSL, simplex-noise flow) morphing sphere → torus knot on scroll, mouse-reactive
  - Research: a live "deceptive reward landscape" with an agent tunnelling through the barrier
- **Motion:** Motion (framer), GSAP + ScrollTrigger, Lenis smooth scroll
- **Type:** Space Grotesk, Inter, Instrument Serif, JetBrains Mono, Noto Telugu / Devanagari (self-hosted via Fontsource)
- Tailwind CSS

## Content
All copy lives in `lib/data.ts`. The résumé PDF is built by `resume/build_resume.py` and copied to `public/`.

## Develop
```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build && pnpm start
```

Accessibility and performance: respects `prefers-reduced-motion`, WebGL feature detection with fallbacks, 3D pauses offscreen,
lighter particle counts on mobile / low-core devices, skip link, keyboard focus styles, screen-reader tables for charts.
