import Hero from "./components/Hero"
import About from "./components/About"
import Experience from "./components/Experience"
import Skills from "./components/Skills"
import Certifications from "./components/Certifications"
import Education from "./components/Education"
import Contact from "./components/Contact"
import Projects from "./components/Projects"
import Languages from "./components/Languages"
import Navigation from "./components/Navigation"
import ThreeScene from "./components/ThreeScene"
import RobotAnimation from "./components/RobotAnimation"

export default function Home() {
  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Navigation />
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
      <RobotAnimation />
    </main>
  )
}
