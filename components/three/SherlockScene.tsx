"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { AdaptiveDpr, Environment, Float, Lightformer, PerformanceMonitor, Sparkles, useTexture } from "@react-three/drei"
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js"
import { SHERLOCK_H, SHERLOCK_PATH, SHERLOCK_W } from "./sherlockPath"

const LINES = [
  "Elementary. Open a case file.",
  "The game is afoot!",
  "Data first, theories later.",
  "You see, but do you observe?",
  "221B Labs — we solve things.",
]

const HEIGHT = 3.5 // world units
const S = HEIGHT / SHERLOCK_H
// Feature positions in the traced 1347×1425 px space (y measured from the top).
const px = (x: number, y: number) => new THREE.Vector2((x - SHERLOCK_W / 2) * S, (SHERLOCK_H / 2 - y) * S)
const PIPE = px(534, 628)
// Magnifier in the outstretched fist: the handle runs from below the fist up to the neck under the lens.
const HANDLE_END = px(222, 1095)
const NECK = px(129, 826)
const DEPTH = 70
const BEVEL = 22

/* The reference silhouette, extruded into a bevelled relief and textured with its own photo. */
function useSherlockGeometry() {
  return useMemo(() => {
    const data = new SVGLoader().parse(
      `<svg xmlns="http://www.w3.org/2000/svg"><path transform="matrix(1 0 0 -1 0 ${SHERLOCK_H})" d="${SHERLOCK_PATH}"/></svg>`,
    )
    const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p))
    const g = new THREE.ExtrudeGeometry(shapes, {
      depth: DEPTH,
      bevelEnabled: true,
      bevelThickness: BEVEL,
      bevelSize: 8,
      bevelSegments: 5,
      curveSegments: 6,
    })
    // UVs straight from the (y-up) outline so the photo lands exactly on the figure
    const pos = g.attributes.position as THREE.BufferAttribute
    const uv = new Float32Array(pos.count * 2)
    for (let i = 0; i < pos.count; i++) {
      uv[i * 2] = pos.getX(i) / SHERLOCK_W
      uv[i * 2 + 1] = pos.getY(i) / SHERLOCK_H
    }
    g.setAttribute("uv", new THREE.BufferAttribute(uv, 2))
    g.translate(-SHERLOCK_W / 2, -SHERLOCK_H / 2, -DEPTH / 2)
    g.scale(S, S, S)
    g.computeVertexNormals()
    return g
  }, [])
}

function PipeSmoke({ origin }: { origin: THREE.Vector3 }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas")
    c.width = c.height = 64
    const g = c.getContext("2d")!
    const r = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    r.addColorStop(0, "rgba(255,255,255,.9)")
    r.addColorStop(1, "rgba(255,255,255,0)")
    g.fillStyle = r
    g.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(c)
  }, [])
  const N = 22
  const ref = useRef<THREE.Points>(null)
  const data = useMemo(() => ({ pos: new Float32Array(N * 3), life: new Float32Array(N).map(() => Math.random()) }), [])
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    for (let i = 0; i < N; i++) {
      data.life[i] = (data.life[i] + dt * 0.16) % 1
      const l = data.life[i]
      data.pos[i * 3] = origin.x + Math.sin(l * 5 + i + t * 0.4) * 0.14 * l - l * 0.25
      data.pos[i * 3 + 1] = origin.y + l * 1.2
      data.pos[i * 3 + 2] = origin.z + Math.cos(l * 4 + i) * 0.06 * l
    }
    const p = ref.current
    if (p) (p.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial map={tex} size={0.34} color="#d9cbb2" transparent opacity={0.09} depthWrite={false} sizeAttenuation />
    </points>
  )
}

// A proper magnifying glass: brass rim, a slightly convex glass lens that refracts and reflects, and a turned wooden handle.
function Magnifier({ lite }: { lite: boolean }) {
  const R = 0.27
  const dir = NECK.clone().sub(HANDLE_END)
  const handleLen = dir.length()
  const angle = Math.atan2(dir.y, dir.x) - Math.PI / 2 // local +y points from the handle end to the neck
  const lens = useMemo(() => {
    // biconvex lens: a flattened sphere, thicker in the middle
    const g = new THREE.SphereGeometry(R * 0.97, 48, 24)
    g.scale(1, 1, 0.12)
    return g
  }, [])
  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#f4efe4",
        metalness: 0,
        roughness: 0.02,
        transmission: lite ? 0 : 1,
        transparent: lite,
        opacity: lite ? 0.28 : 1,
        thickness: 0.18,
        ior: 1.52,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        specularIntensity: 1,
        envMapIntensity: 2.2,
        attenuationColor: new THREE.Color("#fff3d6"),
        attenuationDistance: 1.5,
      }),
    [lite],
  )
  const brass = useMemo(() => new THREE.MeshStandardMaterial({ color: "#c9973d", metalness: 1, roughness: 0.28, envMapIntensity: 1.6 }), [])
  const wood = useMemo(() => new THREE.MeshStandardMaterial({ color: "#3b2414", metalness: 0.1, roughness: 0.45 }), [])

  return (
    <group position={[HANDLE_END.x, HANDLE_END.y, 0.02]} rotation={[0, 0, angle]}>
      {/* handle: wooden grip, brass end cap and collar */}
      <mesh position={[0, handleLen * 0.45, 0]} material={wood}>
        <cylinderGeometry args={[0.038, 0.03, handleLen * 0.9, 20]} />
      </mesh>
      <mesh position={[0, 0.005, 0]} material={brass}>
        <sphereGeometry args={[0.036, 16, 12]} />
      </mesh>
      <mesh position={[0, handleLen * 0.93, 0]} material={brass}>
        <cylinderGeometry args={[0.03, 0.042, handleLen * 0.1, 20]} />
      </mesh>
      {/* lens, facing the viewer, turned a little so the rim reads as a ring */}
      <group position={[0, handleLen + R, 0]} rotation={[0, 0.35, 0]}>
        <mesh material={brass}>
          <torusGeometry args={[R, 0.028, 20, 80]} />
        </mesh>
        <mesh geometry={lens} material={glass} />
        {/* reflections on the curved glass: a soft arc and a small hot spot */}
        <mesh position={[0, 0, R * 0.13]} rotation={[0, 0, 0.5]}>
          <ringGeometry args={[R * 0.58, R * 0.72, 48, 1, 0, Math.PI * 0.5]} />
          <meshBasicMaterial color="#fff6e2" transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh position={[-R * 0.38, R * 0.42, R * 0.13]}>
          <circleGeometry args={[R * 0.07, 24]} />
          <meshBasicMaterial color="#fff6e2" transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0, R * 0.13]} rotation={[0, 0, 0.5 + Math.PI]}>
          <ringGeometry args={[R * 0.7, R * 0.78, 48, 1, 0, Math.PI * 0.3]} />
          <meshBasicMaterial color="#ffd9a0" transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </group>
  )
}

function Sherlock({ onPoke, shift, lift, lite }: { onPoke: () => void; shift: number; lift: number; lite: boolean }) {
  const geometry = useSherlockGeometry()
  const [color, normal] = useTexture(["/models/sherlock-color.webp", "/models/sherlock-normal.webp"])
  const group = useRef<THREE.Group>(null)
  const ember = useRef<THREE.PointLight>(null)
  const emberMat = useRef<THREE.MeshStandardMaterial>(null)
  const target = useMemo(() => new THREE.Vector2(), [])
  const frontZ = ((DEPTH / 2 + BEVEL) * S) + 0.01
  const smokeOrigin = useMemo(() => new THREE.Vector3(PIPE.x, PIPE.y + 0.05, frontZ), [frontZ])

  useMemo(() => {
    color.colorSpace = THREE.SRGBColorSpace
    color.anisotropy = 8
    normal.anisotropy = 8
  }, [color, normal])

  const caps = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: color,
        normalMap: normal,
        normalScale: new THREE.Vector2(1.1, 1.1),
        roughness: 0.82,
        metalness: 0.05,
      }),
    [color, normal],
  )
  const sides = useMemo(() => new THREE.MeshStandardMaterial({ color: "#3a2c1d", roughness: 0.7, metalness: 0.25 }), [])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    target.lerp(state.pointer, 0.05)
    if (group.current) {
      // turn toward the visitor, but never so far that the relief reads as flat
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0.22 + target.x * 0.3, 0.06)
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -target.y * 0.08, 0.06)
    }
    const f = 0.7 + Math.sin(t * 2.1) * 0.2 + Math.sin(t * 5.3) * 0.08
    if (ember.current) ember.current.intensity = f * 1.4
    if (emberMat.current) emberMat.current.emissiveIntensity = 1.5 + f * 2
  })

  return (
    <group
      ref={group}
      position={[shift, lift, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onPoke()
      }}
      onPointerOver={() => (document.body.style.cursor = "zoom-in")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      <mesh geometry={geometry} material={[caps, sides]} castShadow />
      <Magnifier lite={lite} />
      {/* pipe ember + smoke */}
      <mesh position={[PIPE.x, PIPE.y, frontZ]}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshStandardMaterial ref={emberMat} color="#ff7a2a" emissive="#ff5a10" emissiveIntensity={2} />
      </mesh>
      <pointLight ref={ember} position={[PIPE.x, PIPE.y + 0.05, frontZ + 0.15]} color="#ff8a3d" distance={1.4} intensity={1.2} />
      <PipeSmoke origin={smokeOrigin} />
    </group>
  )
}

// A soft shaft of lamplight behind him, like the photo's backlight.
function LightShaft() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uT: { value: 0 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
        fragmentShader: `varying vec2 vUv; uniform float uT;
          void main(){
            float x = vUv.x - .5 + (1. - vUv.y) * .25;
            float beam = smoothstep(.32, 0., abs(x)) * smoothstep(0., .9, vUv.y);
            float flick = .9 + .1 * sin(uT * 1.3);
            gl_FragColor = vec4(vec3(1., .72, .38) * beam * .16 * flick, beam * .16);
          }`,
      }),
    [],
  )
  useFrame((s) => (mat.uniforms.uT.value = s.clock.elapsedTime))
  return (
    <mesh position={[1.2, 1.2, -2.2]} rotation={[0, 0, -0.35]} material={mat}>
      <planeGeometry args={[3.2, 7]} />
    </mesh>
  )
}

function Rig({ offsetX }: { offsetX: number }) {
  const { camera, pointer, size } = useThree()
  useFrame(() => {
    // narrow screens: step back so the whole figure fits
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, size.width / size.height < 1 ? 9.4 : 7.2, 0.1)
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.25 - offsetX, 0.035)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.15 + pointer.y * 0.15, 0.035)
    camera.lookAt(-offsetX, 0.05, 0)
  })
  return null
}

export default function SherlockScene({
  active,
  lite,
  offsetX = 0,
  onSay,
  onReady,
}: {
  active: boolean
  lite: boolean
  offsetX?: number
  onSay?: (line: string | null) => void
  onReady?: () => void
}) {
  const last = useRef<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [dpr, setDpr] = useState(lite ? 1.25 : 1.75)

  const say = (line: string, ms: number) => {
    last.current = line
    onSay?.(line)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => onSay?.(null), ms)
  }
  const poke = () => {
    const pool = LINES.filter((x) => x !== last.current)
    say(pool[Math.floor(Math.random() * pool.length)], 3200)
  }

  useEffect(() => {
    const first = setTimeout(() => say("Ah, a visitor. Click me.", 3600), 2200)
    return () => {
      clearTimeout(first)
      clearTimeout(timer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={dpr}
      camera={{ position: [0, 0.15, 7.2], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => requestAnimationFrame(() => onReady?.())}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(lite ? 1.25 : 1.75)} />
      <AdaptiveDpr pixelated={false} />
      <fog attach="fog" args={["#0f0c0a", 7, 14]} />
      <ambientLight intensity={0.22} color="#b9a78a" />
      {/* backlight / rim, like the reference photo */}
      <directionalLight position={[3.5, 2.5, -3]} intensity={3.2} color="#ffc27a" />
      <directionalLight position={[-3, 1, -2.5]} intensity={1.2} color="#8fb3d9" />
      {/* soft front key so the tweed reads */}
      <directionalLight position={[-2, 2, 4]} intensity={0.65} color="#ffe2b8" />
      <Environment resolution={64} frames={1}>
        <Lightformer intensity={2} color="#ffd9a0" position={[2, 3, -3]} scale={[6, 2, 1]} />
        <Lightformer intensity={0.8} color="#8fb3d9" position={[-4, 1, 3]} scale={[3, 3, 1]} />
      </Environment>
      <Rig offsetX={offsetX} />
      <LightShaft />
      <Suspense fallback={null}>
        <Float speed={1.1} rotationIntensity={0.04} floatIntensity={0.18} floatingRange={[-0.03, 0.04]}>
          <Sherlock onPoke={poke} lite={lite} shift={offsetX === 0 ? 1.35 : 0} lift={offsetX === 0 ? -0.35 : 0} />
        </Float>
      </Suspense>
      <Sparkles count={lite ? 30 : 70} scale={[6, 5, 3]} position={[1, 0.6, -1]} size={2} speed={0.18} color="#e6c77f" opacity={0.45} />
      {!lite && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.55} luminanceThreshold={0.7} luminanceSmoothing={0.25} mipmapBlur resolutionScale={0.5} />
          <Vignette offset={0.25} darkness={0.65} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
