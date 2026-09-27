import type React from "react"

// Re-mounts on every route change: a brass bar sweeps the top while the page rises in.
// Pure CSS (transform/opacity), so it stays smooth even while the new page hydrates.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="page-bar" aria-hidden />
      <div className="page-enter">{children}</div>
    </>
  )
}
