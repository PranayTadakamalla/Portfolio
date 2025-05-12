import Hero from "./components/Hero"
import About from "./components/About"
import Experience from "./components/Experience"
import Skills from "./components/Skills"
import Certifications from "./components/Certifications"
import Education from "./components/Education"
import Contact from "./components/Contact"
import Projects from "./components/Projects"
import Languages from "./components/Languages"
import ThreeScene from "./components/ThreeScene"

export default function Home() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <ThreeScene />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Education />
      <Certifications />
      <Projects />
      <Languages />
      <Contact />
    </main>
  )
}
