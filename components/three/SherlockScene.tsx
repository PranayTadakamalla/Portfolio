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

// A sheet of paper in his fist, cut from the same silhouette: same extrusion, bevel and near-black finish.
// A thin folded letter in his fist, cut from the same silhouette (near-black face, brass edge).
// Two panels meet at a centre crease; the top-right corner is folded over as a flap. y from the top.
const CREASE: [[number, number], [number, number]] = [[197, 968], [115, 630]]
const PAPER_L: [number, number][] = [[197, 968], [118, 985], [102, 930], [88, 874], [75, 818], [66, 762], [58, 705], [52, 648], [78, 643], [104, 637], [115, 630]]
const PAPER_R: [number, number][] = [[115, 630], [129, 628], [150, 619], [234, 718], [243, 749], [256, 798], [265, 848], [271, 899], [276, 950], [197, 968]]
const FOLD = 0.32 // radians each panel tips back from the crease

function usePaperGeometry() {
  return useMemo(() => {
    const up = ([x, y]: [number, number]) => new THREE.Vector2(x, SHERLOCK_H - y)
    const sheet = (pts: THREE.Vector2[], z: number) => {
      const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts), {
        depth: 2,
        bevelEnabled: true,
        bevelThickness: 1.5,
        bevelSize: 1.5,
        bevelSegments: 1,
        curveSegments: 4,
      })
      g.translate(0, 0, z - 1)
      return g
    }
    // the dog-ear: reflect the missing corner across the fold line so the flap lies on the right panel
    const [p1, p2, p3, p4] = [up([129, 628]), up([150, 619]), up([234, 718]), up([243, 749])]
    const corner = (() => {
      const d1 = p2.clone().sub(p1)
      const d2 = p3.clone().sub(p4)
      const t = ((p4.x - p1.x) * d2.y - (p4.y - p1.y) * d2.x) / (d1.x * d2.y - d1.y * d2.x)
      return p1.clone().add(d1.multiplyScalar(t))
    })()
    const axis = p3.clone().sub(p2).normalize()
    const rel = corner.clone().sub(p2)
    const folded = p2.clone().add(axis.clone().multiplyScalar(2 * rel.dot(axis))).sub(rel)

    const c0 = up(CREASE[0])
    const c1 = up(CREASE[1])
    const dir = new THREE.Vector3(c1.x - c0.x, c1.y - c0.y, 0).normalize()
    const hinge = (g: THREE.BufferGeometry, angle: number) =>
      g
        .translate(-c0.x, -c0.y, 0)
        .applyMatrix4(new THREE.Matrix4().makeRotationAxis(dir, angle))
        .translate(c0.x, c0.y, 0)

    return [
      hinge(sheet(PAPER_L.map(up), 0), -FOLD),
      hinge(sheet(PAPER_R.map(up), 0), FOLD),
      hinge(sheet([p2, p3, folded], 5), FOLD * 1.6),
    ].map((g) => {
      g.translate(-SHERLOCK_W / 2, -SHERLOCK_H / 2, 0).scale(S, S, S)
      g.computeVertexNormals()
      return g
    })
  }, [])
}

function Sherlock({ onPoke, shift, lift }: { onPoke: () => void; shift: number; lift: number }) {
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
  const paper = usePaperGeometry()
  const paperCaps = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1c140d", roughness: 0.7, metalness: 0.05, side: THREE.DoubleSide }), [])

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
      {paper.map((g, i) => (
        <mesh key={i} geometry={g} material={[paperCaps, sides]} castShadow />
      ))}
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
          <Sherlock onPoke={poke} shift={offsetX === 0 ? 1.35 : 0} lift={offsetX === 0 ? -0.35 : 0} />
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
