import Experience from "./components/Experience"
import Skills from "./components/Skills"
import Certifications from "./components/Certifications"
import Education from "./components/Education"
import Contact from "./components/Contact"
import Projects from "./components/Projects"
import Languages from "./components/Languages"
import ThreeScene from "./components/ThreeScene"
import Hero from "./components/Hero"

export default function Home() {
  return (
    <main className="min-h-screen">
      <ThreeScene />
      <Hero />
      <Experience />
      <Education />
      <Skills />
      <Certifications />
      <Projects />
      <Languages />
      <Contact />
    </main>
  )
}
