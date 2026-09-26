import type React from "react"

// Re-mounts on every route change, so the iris plays per page (first visit is covered by the loader).
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="page-iris" aria-hidden />
      {children}
    </>
  )
}
