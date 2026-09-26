"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { ContactShadows, Environment, Float, Lightformer, MeshTransmissionMaterial, Sparkles } from "@react-three/drei"
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"

const LINES = [
  "Elementary. Open a case file.",
  "The game is afoot!",
  "Data first, theories later.",
  "You see, but do you observe?",
  "221B Labs — we solve things.",
  "Curious? Try the Research file.",
]

/* ---------- procedural textures ---------- */

// Classic houndstooth tweed, drawn once on a canvas.
function useTweed(a: string, b: string) {
  return useMemo(() => {
    const c = document.createElement("canvas")
    c.width = c.height = 128
    const g = c.getContext("2d")!
    g.fillStyle = a
    g.fillRect(0, 0, 128, 128)
    g.fillStyle = b
    const s = 16
    for (let y = 0; y < 128; y += s)
      for (let x = 0; x < 128; x += s) {
        g.beginPath()
        g.moveTo(x, y + s * 0.5)
        g.lineTo(x + s * 0.5, y)
        g.lineTo(x + s, y)
        g.lineTo(x + s * 0.5, y + s * 0.5)
        g.lineTo(x + s * 0.5, y + s)
        g.lineTo(x, y + s)
        g.closePath()
        g.fill()
      }
    // woolly speckle
    for (let i = 0; i < 1800; i++) {
      g.fillStyle = `rgba(255,240,210,${Math.random() * 0.06})`
      g.fillRect(Math.random() * 128, Math.random() * 128, 1, 1)
    }
    const t = new THREE.CanvasTexture(c)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(4, 4)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
    return t
  }, [a, b])
}

function useSoftDot() {
  return useMemo(() => {
    const c = document.createElement("canvas")
    c.width = c.height = 64
    const g = c.getContext("2d")!
    const r = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    r.addColorStop(0, "rgba(255,255,255,0.9)")
    r.addColorStop(1, "rgba(255,255,255,0)")
    g.fillStyle = r
    g.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(c)
  }, [])
}

/* ---------- pieces ---------- */

function lathe(points: [number, number][], seg = 40) {
  return new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), seg)
}

function PipeSmoke({ origin }: { origin: THREE.Vector3 }) {
  const tex = useSoftDot()
  const N = 26
  const ref = useRef<THREE.Points>(null)
  const data = useMemo(() => {
    const pos = new Float32Array(N * 3)
    const life = new Float32Array(N).map(() => Math.random())
    return { pos, life }
  }, [])
  useFrame((state, dt) => {
    const p = ref.current
    if (!p) return
    for (let i = 0; i < N; i++) {
      data.life[i] += dt * 0.28
      if (data.life[i] > 1) data.life[i] = 0
      const l = data.life[i]
      const t = state.clock.elapsedTime
      data.pos[i * 3] = origin.x + Math.sin(l * 6 + i + t * 0.6) * 0.12 * l
      data.pos[i * 3 + 1] = origin.y + l * 1.0
      data.pos[i * 3 + 2] = origin.z + Math.cos(l * 5 + i) * 0.08 * l
    }
    ;(p.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial map={tex} size={0.16} color="#d8cbb4" transparent opacity={0.13} depthWrite={false} sizeAttenuation />
    </points>
  )
}

function Magnifier({ lite }: { lite: boolean }) {
  return (
    <group>
      {/* handle */}
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 0.5, 16]} />
        <meshStandardMaterial color="#3a2414" roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.16, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.06, 16]} />
        <meshStandardMaterial color="#c9a24a" metalness={1} roughness={0.25} />
      </mesh>
      {/* brass rim */}
      <mesh position={[0, 0.14, 0]}>
        <torusGeometry args={[0.28, 0.035, 20, 64]} />
        <meshStandardMaterial color="#d4a94f" metalness={1} roughness={0.2} />
      </mesh>
      {/* lens */}
      <mesh position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.27, 0.27, 0.035, 48]} />
        {lite ? (
          <meshPhysicalMaterial color="#dfe9f2" roughness={0} metalness={0} transparent opacity={0.22} clearcoat={1} />
        ) : (
          <MeshTransmissionMaterial thickness={0.25} roughness={0} ior={1.45} chromaticAberration={0.06} anisotropicBlur={0.1} samples={4} resolution={256} />
        )}
      </mesh>
    </group>
  )
}

function Sherlock({ lite, onPoke, raise }: { lite: boolean; onPoke: () => void; raise: React.MutableRefObject<number> }) {
  const tweed = useTweed("#5d4a36", "#4b3b2b")
  const capeTweed = useTweed("#6a5540", "#56452f")
  const root = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const eyeL = useRef<THREE.Group>(null)
  const eyeR = useRef<THREE.Group>(null)
  const brows = useRef<THREE.Group>(null)
  const arm = useRef<THREE.Group>(null)
  const ember = useRef<THREE.PointLight>(null)
  const emberMesh = useRef<THREE.MeshStandardMaterial>(null)
  const [hover, setHover] = useState(false)

  const coat = useMemo(() => lathe([[0.001, 0], [0.62, 0], [0.6, 0.25], [0.52, 0.8], [0.45, 1.3], [0.36, 1.58], [0.2, 1.72], [0.001, 1.74]]), [])
  const cape = useMemo(() => lathe([[0.001, 0.9], [0.98, 0.9], [0.9, 1.05], [0.66, 1.4], [0.38, 1.66], [0.001, 1.72]]), [])
  const pipeStem = useMemo(
    () =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([new THREE.Vector3(0.14, 2.02, 0.44), new THREE.Vector3(0.24, 1.9, 0.62), new THREE.Vector3(0.36, 1.86, 0.72)]),
        24,
        0.025,
        8,
      ),
    [],
  )
  const bowl = useMemo(() => lathe([[0.001, 0], [0.07, 0.01], [0.1, 0.08], [0.09, 0.17], [0.075, 0.17], [0.07, 0.05], [0.001, 0.05]], 24), [])
  const smokeOrigin = useMemo(() => new THREE.Vector3(0.42, 2.02, 0.74), [])
  const target = useMemo(() => new THREE.Vector2(), [])
  const nextBlink = useRef(2)

  useEffect(() => {
    document.body.style.cursor = hover ? "zoom-in" : ""
    return () => {
      document.body.style.cursor = ""
    }
  }, [hover])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    target.lerp(state.pointer, 0.08)
    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, target.x * 0.55, 0.1)
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -target.y * 0.25, 0.1)
      head.current.rotation.z = Math.sin(t * 0.8) * 0.03
    }
    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, target.x * 0.25 - 0.25, 0.05)
      root.current.scale.y = 1 + Math.sin(t * 1.6) * 0.008 // breathing
    }
    // blink
    const blink = t > nextBlink.current && t < nextBlink.current + 0.14 ? 0.1 : 1
    if (t > nextBlink.current + 0.14) nextBlink.current = t + 2 + Math.random() * 3.5
    // magnifier: lift to the right eye every few seconds or when poked
    const cycle = (t % 9) / 9
    const auto = cycle > 0.62 && cycle < 0.86 ? 1 : 0
    const want = Math.max(auto, raise.current)
    raise.current = Math.max(0, raise.current - dt * 0.35)
    if (arm.current) {
      const a = arm.current.userData as { k?: number }
      a.k = THREE.MathUtils.lerp(a.k ?? 0, want, 0.08)
      const k = a.k
      // raised: lens centre sits in front of the right eye (head y 2.2 + eye 0.06; lens is 0.2 below the arm pivot)
      arm.current.position.set(THREE.MathUtils.lerp(0.62, 0.17, k), THREE.MathUtils.lerp(1.2, 2.46, k), THREE.MathUtils.lerp(0.5, 0.9, k))
      arm.current.rotation.set(THREE.MathUtils.lerp(-0.2, 0, k), THREE.MathUtils.lerp(0.5, 0, k), THREE.MathUtils.lerp(-0.5, 0, k))
      if (eyeR.current) eyeR.current.scale.set(1 + k * 0.9, (1 + k * 0.9) * blink, 1 + k * 0.9)
      if (brows.current) brows.current.position.y = 0.14 + k * 0.06
    }
    if (eyeL.current) eyeL.current.scale.y = blink
    // ember flicker
    const f = 0.6 + Math.sin(t * 13) * 0.15 + Math.sin(t * 7.3) * 0.1
    if (ember.current) ember.current.intensity = f * 0.9
    if (emberMesh.current) emberMesh.current.emissiveIntensity = 2 + f * 2
  })

  const eye = (
    <>
      <mesh>
        <sphereGeometry args={[0.068, 20, 20]} />
        <meshStandardMaterial color="#17120e" roughness={0.2} />
      </mesh>
      <mesh position={[0.022, 0.024, 0.055]}>
        <sphereGeometry args={[0.018, 10, 10]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </>
  )

  return (
    <group
      ref={root}
      position={[0, -1.72, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onPoke()
      }}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {/* boots */}
      {[-0.22, 0.22].map((x) => (
        <mesh key={x} position={[x, 0.06, 0.18]} scale={[1, 0.6, 1.6]} castShadow>
          <sphereGeometry args={[0.14, 20, 16]} />
          <meshStandardMaterial color="#1b1512" roughness={0.35} />
        </mesh>
      ))}
      {/* Inverness coat + cape */}
      <mesh geometry={coat} position={[0, 0.08, 0]} castShadow>
        <meshStandardMaterial map={tweed} roughness={0.95} />
      </mesh>
      <mesh geometry={cape} position={[0, 0.08, 0]} castShadow>
        <meshStandardMaterial map={capeTweed} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {/* coat buttons */}
      {[0.55, 0.8, 1.05].map((y) => (
        <mesh key={y} position={[0, y, 0.62 - (y - 0.55) * 0.18]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#c9a24a" metalness={1} roughness={0.3} />
        </mesh>
      ))}
      {/* Sherlock's blue scarf */}
      <mesh position={[0, 1.76, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.24, 0.085, 16, 40]} />
        <meshStandardMaterial color="#2c4a6e" roughness={0.9} />
      </mesh>
      <mesh position={[0.1, 1.5, 0.3]} rotation={[0.25, 0, -0.12]}>
        <boxGeometry args={[0.13, 0.42, 0.06]} />
        <meshStandardMaterial color="#2c4a6e" roughness={0.9} />
      </mesh>
      {/* left arm resting */}
      <mesh position={[-0.6, 1.1, 0.12]} rotation={[0.1, 0, 0.35]} castShadow>
        <capsuleGeometry args={[0.12, 0.55, 8, 16]} />
        <meshStandardMaterial map={tweed} roughness={0.95} />
      </mesh>
      <mesh position={[-0.72, 0.72, 0.18]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#2a2320" roughness={0.6} />
      </mesh>

      {/* head */}
      <group ref={head} position={[0, 2.2, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.52, 40, 40]} />
          <meshStandardMaterial color="#e9c7a4" roughness={0.65} />
        </mesh>
        {/* ears */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.5, -0.02, 0]} scale={[0.5, 1, 0.8]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color="#e2b994" roughness={0.7} />
          </mesh>
        ))}
        {/* curls peeking out */}
        {Array.from({ length: 11 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 1.3 + Math.PI * 0.85
          return (
            <mesh key={i} position={[Math.cos(a) * 0.46, 0.1 + Math.sin(i * 1.7) * 0.05, Math.sin(a) * 0.46]}>
              <sphereGeometry args={[0.1, 14, 14]} />
              <meshStandardMaterial color="#2a1d14" roughness={0.8} />
            </mesh>
          )
        })}
        {/* face */}
        <group position={[0, 0.04, 0]}>
          <group ref={eyeL} position={[-0.17, 0.02, 0.46]}>
            {eye}
          </group>
          <group ref={eyeR} position={[0.17, 0.02, 0.46]}>
            {eye}
          </group>
          <group ref={brows} position={[0, 0.34 - 0.2, 0]}>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.17, 0, 0.47]} rotation={[0, 0, s * -0.18]}>
                <boxGeometry args={[0.14, 0.028, 0.02]} />
                <meshStandardMaterial color="#2a1d14" />
              </mesh>
            ))}
          </group>
          <mesh position={[0, -0.08, 0.52]} scale={[0.8, 1, 1.3]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#e2b48c" roughness={0.6} />
          </mesh>
          <mesh position={[-0.02, -0.21, 0.46]} rotation={[0, 0, Math.PI + 0.25]}>
            <torusGeometry args={[0.07, 0.013, 8, 20, Math.PI * 0.8]} />
            <meshStandardMaterial color="#8a4a3a" />
          </mesh>
          {/* cheeks */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.3, -0.12, 0.39]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color="#e99e86" transparent opacity={0.45} roughness={1} />
            </mesh>
          ))}
        </group>

        {/* deerstalker */}
        <group position={[0, 0.27, 0]} scale={0.95}>
          <mesh scale={[1.04, 0.86, 1.08]} castShadow>
            <sphereGeometry args={[0.55, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial map={tweed} roughness={0.95} side={THREE.DoubleSide} />
          </mesh>
          {[1, -1].map((s) => (
            <mesh key={s} position={[0, -0.02, s * 0.5]} rotation={[s * 0.6, s > 0 ? 0 : Math.PI, 0]} scale={[1, 1, 0.9]}>
              <cylinderGeometry args={[0.38, 0.38, 0.035, 32, 1, false, -Math.PI / 2, Math.PI]} />
              <meshStandardMaterial map={tweed} roughness={0.95} />
            </mesh>
          ))}
          {/* ear-flap bow on top */}
          <mesh position={[0, 0.47, 0]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshStandardMaterial color="#3b2e22" />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.09, 0.46, 0]} rotation={[Math.PI / 2, 0, s * 0.4]}>
              <torusGeometry args={[0.055, 0.016, 8, 16]} />
              <meshStandardMaterial color="#3b2e22" />
            </mesh>
          ))}
        </group>

        {/* calabash pipe, in local head space */}
        <group position={[0, -2.2, 0]}>
          <mesh geometry={pipeStem}>
            <meshStandardMaterial color="#2a1a10" roughness={0.4} />
          </mesh>
          <mesh geometry={bowl} position={[0.4, 1.83, 0.74]}>
            <meshStandardMaterial color="#c99b52" roughness={0.45} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0.4, 1.98, 0.74]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial ref={emberMesh} color="#ff7a2a" emissive="#ff5a10" emissiveIntensity={3} />
          </mesh>
          <pointLight ref={ember} position={[0.4, 2.05, 0.8]} color="#ff8a3d" distance={1.6} intensity={0.8} />
          <PipeSmoke origin={smokeOrigin} />
        </group>
      </group>

      {/* right arm + magnifying glass */}
      <group ref={arm} position={[0.62, 1.2, 0.5]}>
        <mesh position={[0, -0.62, -0.1]} rotation={[0.3, 0, 0.1]}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial color="#2a2320" roughness={0.6} />
        </mesh>
        <group position={[0, -0.34, 0]}>
          <Magnifier lite={lite} />
        </group>
      </group>
    </group>
  )
}

function GasLamp() {
  const light = useRef<THREE.PointLight>(null)
  const glass = useRef<THREE.MeshStandardMaterial>(null)
  useFrame((s) => {
    const t = s.clock.elapsedTime
    const f = 1 + Math.sin(t * 9) * 0.04 + Math.sin(t * 23) * 0.03
    if (light.current) light.current.intensity = 14 * f
    if (glass.current) glass.current.emissiveIntensity = 3.2 * f
  })
  return (
    <group position={[1.95, -1.64, -1.9]}>
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.09, 3.2, 12]} />
        <meshStandardMaterial color="#141210" metalness={0.8} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 0.2, 12]} />
        <meshStandardMaterial color="#141210" metalness={0.8} roughness={0.5} />
      </mesh>
      <mesh position={[0, 3.45, 0]}>
        <cylinderGeometry args={[0.16, 0.26, 0.5, 6]} />
        <meshStandardMaterial ref={glass} color="#ffd79a" emissive="#ffb050" emissiveIntensity={3} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 3.8, 0]}>
        <coneGeometry args={[0.32, 0.26, 6]} />
        <meshStandardMaterial color="#141210" metalness={0.8} roughness={0.4} />
      </mesh>
      <pointLight ref={light} position={[0, 3.45, 0.2]} color="#ffb46b" intensity={14} distance={9} decay={1.6} />
    </group>
  )
}

// A trail of glowing footprints walking up to Sherlock.
function Footprints() {
  const refs = useRef<(THREE.MeshBasicMaterial | null)[]>([])
  const steps = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const z = 3.2 - i * 0.42
        const x = -1.8 + i * 0.2 + (i % 2 ? 0.14 : -0.14)
        return { x, z, r: -0.35 }
      }),
    [],
  )
  useFrame((s) => {
    const t = s.clock.elapsedTime * 1.4
    refs.current.forEach((m, i) => {
      if (!m) return
      const phase = (t - i * 0.35) % 5
      m.opacity = phase > 0 && phase < 2.4 ? Math.sin((phase / 2.4) * Math.PI) * 0.55 : 0
    })
  })
  return (
    <group position={[0, -1.7, 0]}>
      {steps.map((p, i) => (
        <mesh key={i} position={[p.x, 0.005, p.z]} rotation={[-Math.PI / 2, 0, p.r]} scale={[0.09, 0.2, 1]}>
          <circleGeometry args={[1, 20]} />
          <meshBasicMaterial ref={(m) => void (refs.current[i] = m)} color="#d4a94f" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function Rig({ offsetX }: { offsetX: number }) {
  const { camera, pointer } = useThree()
  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.35 - offsetX, 0.04)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.55 + pointer.y * 0.2, 0.04)
    camera.lookAt(-offsetX, 0.35, 0)
  })
  return null
}

export default function SherlockScene({
  active,
  lite,
  offsetX = 0,
  onSay,
}: {
  active: boolean
  lite: boolean
  offsetX?: number
  onSay?: (line: string | null) => void
}) {
  const raise = useRef(0)
  const last = useRef<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const say = (line: string, ms: number) => {
    last.current = line
    onSay?.(line)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => onSay?.(null), ms)
  }
  const poke = () => {
    raise.current = 1
    const pool = LINES.filter((x) => x !== last.current)
    say(pool[Math.floor(Math.random() * pool.length)], 3200)
  }

  useEffect(() => {
    const first = setTimeout(() => say("Ah, a visitor. Click me.", 3600), 2600)
    return () => {
      clearTimeout(first)
      clearTimeout(timer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      shadows={!lite}
      dpr={[1, lite ? 1.4 : 1.8]}
      camera={{ position: [0, 0.55, 8.9], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <fog attach="fog" args={["#0f0c0a", 7, 15]} />
      <ambientLight intensity={0.35} color="#b9a78a" />
      <directionalLight position={[3, 4, 3]} intensity={1.1} color="#ffe2b8" castShadow={!lite} shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 2, -3]} intensity={0.9} color="#8fb3d9" />
      <Environment resolution={64} frames={1}>
        <Lightformer intensity={2} color="#ffd9a0" position={[0, 3, 4]} scale={[6, 2, 1]} />
        <Lightformer intensity={1.2} color="#8fb3d9" position={[-4, 1, -2]} scale={[3, 3, 1]} />
      </Environment>
      <Rig offsetX={offsetX} />

      <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.25} floatingRange={[-0.03, 0.05]}>
        <Sherlock lite={lite} onPoke={poke} raise={raise} />
      </Float>

      <GasLamp />
      <Footprints />
      <Sparkles count={lite ? 40 : 90} scale={[7, 5, 4]} position={[1, 0.8, -0.5]} size={2.2} speed={0.25} color="#e6c77f" opacity={0.5} />
      <ContactShadows position={[0, -1.7, 0]} opacity={0.7} scale={8} blur={2.4} far={3} resolution={lite ? 256 : 512} color="#000000" />
      <mesh position={[0, -1.71, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[9, 48]} />
        <meshStandardMaterial color="#17120e" roughness={1} transparent opacity={0.6} />
      </mesh>

      {!lite && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.8} luminanceThreshold={0.6} luminanceSmoothing={0.3} mipmapBlur />
          <Noise opacity={0.035} />
          <Vignette offset={0.25} darkness={0.7} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
