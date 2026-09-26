"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

// Reward landscape: a decoy peak (the trap), and the true goal hidden inside a barrier ring.
const TRAP = new THREE.Vector2(-1.1, 0.4)
const GOAL = new THREE.Vector2(1.35, -0.45)
function height(x: number, z: number) {
  const trap = 0.85 * Math.exp(-((x - TRAP.x) ** 2 + (z - TRAP.y) ** 2) / 0.32)
  const r = Math.hypot(x - GOAL.x, z - GOAL.y)
  const ring = 0.62 * Math.exp(-((r - 0.78) ** 2) / 0.012)
  const goal = 1.25 * Math.exp(-(r * r) / 0.07)
  return trap + ring + goal + 0.04 * Math.sin(x * 3) * Math.cos(z * 3)
}

function Terrain() {
  const geo = useMemo(() => {
    const n = 120
    const pos = new Float32Array(n * n * 3)
    const col = new Float32Array(n * n * 3)
    const a = new THREE.Color("#2a2d36")
    const b = new THREE.Color("#ff8a3d")
    const c = new THREE.Color("#6ee7f9")
    const tmp = new THREE.Color()
    let k = 0
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        const x = (i / (n - 1) - 0.5) * 5.2
        const z = (j / (n - 1) - 0.5) * 5.2
        const h = height(x, z)
        pos.set([x, h, z], k * 3)
        const nearGoal = Math.hypot(x - GOAL.x, z - GOAL.y) < 0.55
        tmp.copy(a).lerp(nearGoal ? c : b, Math.min(1, h * 1.1))
        col.set([tmp.r, tmp.g, tmp.b], k * 3)
        k++
      }
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    g.setAttribute("color", new THREE.BufferAttribute(col, 3))
    return g
  }, [])
  return (
    <points geometry={geo}>
      <pointsMaterial size={0.028} vertexColors transparent opacity={0.95} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// Start → drawn to the trap → tunnels straight through the barrier to the goal.
const PATH = new THREE.CatmullRomCurve3(
  [
    [-2.3, 0, 2.0],
    [-1.6, 0, 1.1],
    [-1.15, 0, 0.45],
    [-0.8, 0, 0.7],
    [-1.3, 0, 0.1],
    [-0.2, 0, -0.2],
    [0.55, 0, -0.4],
    [1.05, 0, -0.45],
    [1.35, 0, -0.45],
  ].map(([x, , z]) => new THREE.Vector3(x, height(x, z) + 0.08, z)),
)

const PATH_POINTS = PATH.getSpacedPoints(240)

function Agent() {
  const ref = useRef<THREE.Mesh>(null)
  const halo = useRef<THREE.Mesh>(null)
  const t = useRef(0)
  // The travelled path is revealed progressively, so a loop reset never streaks across the scene.
  const line = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(PATH_POINTS)
    g.setDrawRange(0, 0)
    return new THREE.Line(g, new THREE.LineBasicMaterial({ color: "#ffb27a", transparent: true, opacity: 0.85 }))
  }, [])
  useFrame((_, dt) => {
    t.current = (t.current + dt / 7) % 1.15
    const u = Math.min(1, t.current)
    const p = PATH.getPointAt(u)
    line.geometry.setDrawRange(0, Math.floor(u * PATH_POINTS.length))
    const inBarrier = Math.abs(Math.hypot(p.x - GOAL.x, p.z - GOAL.y) - 0.78) < 0.14
    ref.current?.position.copy(p)
    if (halo.current) {
      halo.current.position.copy(p)
      const target = inBarrier ? 3.2 : u >= 1 ? 2.2 + Math.sin(t.current * 30) * 0.3 : 1
      halo.current.scale.setScalar(THREE.MathUtils.lerp(halo.current.scale.x, target, 0.15))
      ;(halo.current.material as THREE.MeshBasicMaterial).color.set(inBarrier || u >= 1 ? "#6ee7f9" : "#ff8a3d")
    }
  })
  return (
    <>
      <primitive object={line} />
      <mesh ref={ref}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color="#ff8a3d" transparent opacity={0.35} depthWrite={false} />
      </mesh>
    </>
  )
}

function Rig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.08
    const r = state.size.width < 500 ? 7.6 : 6.4
    state.camera.position.set(Math.sin(t) * r, 4.2 + state.pointer.y * 0.4, Math.cos(t) * r)
    state.camera.lookAt(0.1, 0.1, 0)
  })
  return null
}

export default function TunnelScene({ active }: { active: boolean }) {
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, 1.75]} camera={{ fov: 40 }} gl={{ antialias: true, alpha: true }} aria-hidden>
      <Rig />
      <Terrain />
      <Agent />
    </Canvas>
  )
}
