"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // Create a group to hold all objects
    const group = new THREE.Group()
    scene.add(group)

    // Create floating cubes
    const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

    const createCube = (x: number, y: number, z: number, color: string) => {
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: 0.3,
        roughness: 0.4,
      })
      const cube = new THREE.Mesh(cubeGeometry, material)
      cube.position.set(x, y, z)
      cube.userData = {
        rotationSpeed: {
          x: Math.random() * 0.01 - 0.005,
          y: Math.random() * 0.01 - 0.005,
          z: Math.random() * 0.01 - 0.005,
        },
        floatSpeed: Math.random() * 0.005 + 0.002,
        floatDirection: Math.random() < 0.5 ? 1 : -1,
        floatOffset: Math.random() * Math.PI * 2,
      }
      group.add(cube)
      return cube
    }

    // Create multiple cubes
    const cubes = [
      createCube(-2, 1, 0, "#3b82f6"),
      createCube(2, -1, 1, "#8b5cf6"),
      createCube(0, 2, -1, "#06b6d4"),
      createCube(-1, -2, -2, "#4f46e5"),
      createCube(1.5, 1.5, 0.5, "#ec4899"),
    ]

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 2, 3)
    scene.add(directionalLight)

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Mouse movement effect
    const mouse = new THREE.Vector2()

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Animation loop
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      // Rotate the entire group slightly based on mouse position
      group.rotation.y = mouse.x * 0.5
      group.rotation.x = mouse.y * 0.5

      // Animate each cube individually
      cubes.forEach((cube) => {
        const data = cube.userData

        // Rotation
        cube.rotation.x += data.rotationSpeed.x
        cube.rotation.y += data.rotationSpeed.y
        cube.rotation.z += data.rotationSpeed.z

        // Floating effect
        cube.position.y += Math.sin(elapsedTime * data.floatSpeed + data.floatOffset) * 0.002 * data.floatDirection
      })

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 -z-10 pointer-events-none" />
}
