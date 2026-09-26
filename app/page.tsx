import Hero from "@/components/Hero"
import About from "@/components/About"
import Research from "@/components/Research"
import Publications from "@/components/Publications"
import Venture from "@/components/Venture"
import Journey from "@/components/Journey"
import Projects from "@/components/Projects"
import Skills from "@/components/Skills"
import Beyond from "@/components/Beyond"
import Contact from "@/components/Contact"

export default function Home() {
  return (
    <main id="main" className="relative">
      <Hero />
      <About />
      <Research />
      <Publications />
      <Venture />
      <Journey />
      <Projects />
      <Skills />
      <Beyond />
      <Contact />
    </main>
  )
}
