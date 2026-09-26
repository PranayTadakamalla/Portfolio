"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing"
import { useMemo, useRef } from "react"
import * as THREE from "three"

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`

const vertex = /* glsl */ `
uniform float uTime; uniform float uMorph; uniform vec3 uMouse; uniform float uSize; uniform float uPR;
attribute vec3 aKnot; attribute float aRand;
varying float vMix; varying float vAlpha;
${NOISE}
void main(){
  vec3 p = mix(position, aKnot, smoothstep(0., 1., uMorph));
  float n = snoise(p * .55 + uTime * .12);
  p += normalize(p + 1e-4) * n * (.18 + .25 * uMorph);
  p += vec3(snoise(p*.9+uTime*.2), snoise(p*.9+17.+uTime*.2), snoise(p*.9-9.+uTime*.2)) * .06;
  vec3 d = p - uMouse; float dist = length(d);
  p += normalize(d) * smoothstep(1.4, 0., dist) * .55;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPR * (.55 + aRand) * (1. / -mv.z);
  vMix = clamp(n * .5 + .5 + (aRand - .5) * .6, 0., 1.);
  vAlpha = .55 + .45 * aRand;
}`

const fragment = /* glsl */ `
uniform vec3 uA; uniform vec3 uB; uniform vec3 uC;
varying float vMix; varying float vAlpha;
void main(){
  vec2 c = gl_PointCoord - .5; float r = length(c);
  if (r > .5) discard;
  float soft = smoothstep(.5, 0., r);
  vec3 col = mix(uA, uB, vMix);
  col = mix(col, uC, smoothstep(.75, 1., vMix));
  gl_FragColor = vec4(col, soft * soft * vAlpha);
}`

function buildGeometry(count: number) {
  const sphere = new Float32Array(count * 3)
  const knot = new Float32Array(count * 3)
  const rand = new Float32Array(count)
  const knotCurve = new THREE.TorusKnotGeometry(1.35, 0.42, 420, 48, 2, 3)
  const kp = knotCurve.attributes.position
  for (let i = 0; i < count; i++) {
    // Fibonacci sphere with a little thickness — "the whole".
    const k = i + 0.5
    const phi = Math.acos(1 - (2 * k) / count)
    const theta = Math.PI * (1 + Math.sqrt(5)) * k
    const r = 1.9 + (Math.random() - 0.5) * 0.12
    sphere.set([r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi)], i * 3)
    const j = Math.floor(Math.random() * kp.count)
    knot.set([kp.getX(j), kp.getY(j), kp.getZ(j)], i * 3)
    rand[i] = Math.random()
  }
  knotCurve.dispose()
  const g = new THREE.BufferGeometry()
  g.setAttribute("position", new THREE.BufferAttribute(sphere, 3))
  g.setAttribute("aKnot", new THREE.BufferAttribute(knot, 3))
  g.setAttribute("aRand", new THREE.BufferAttribute(rand, 1))
  return g
}

function Field({ count, scroll, lite }: { count: number; scroll: React.MutableRefObject<number>; lite: boolean }) {
  const points = useRef<THREE.Points>(null)
  const { viewport, camera } = useThree()
  const geometry = useMemo(() => buildGeometry(count), [count])
  const mouse = useMemo(() => new THREE.Vector3(99, 99, 99), [])
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uMouse: { value: mouse },
      uSize: { value: lite ? 20 : 26 },
      uPR: { value: Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio, 2) },
      uA: { value: new THREE.Color("#ff8a3d") },
      uB: { value: new THREE.Color("#6ee7f9") },
      uC: { value: new THREE.Color("#ece8e1") },
    }),
    [mouse, lite],
  )
  const ray = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])

  useFrame((state, dt) => {
    const u = uniforms
    u.uTime.value += dt
    u.uMorph.value += (Math.min(1, scroll.current * 1.4) - u.uMorph.value) * 0.06
    ray.setFromCamera(state.pointer, camera)
    const hit = new THREE.Vector3()
    if (ray.ray.intersectPlane(plane, hit) && points.current) {
      points.current.worldToLocal(hit)
      mouse.lerp(hit, 0.12)
    }
    if (points.current) {
      points.current.rotation.y += dt * 0.06
      points.current.rotation.x += (state.pointer.y * 0.25 - points.current.rotation.x) * 0.03
      points.current.rotation.z += (-state.pointer.x * 0.15 - points.current.rotation.z) * 0.03
      const s = viewport.width < 6 ? 0.78 : 1
      points.current.scale.setScalar(s)
      points.current.position.x = viewport.width < 6 ? 0 : viewport.width * 0.18
      points.current.position.y = viewport.width < 6 ? 1.1 - scroll.current * 1.5 : -scroll.current * 1.2
    }
  })

  return (
    <points ref={points} geometry={geometry}>
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function Core({ scroll }: { scroll: React.MutableRefObject<number> }) {
  const mesh = useRef<THREE.LineSegments>(null)
  const { viewport } = useThree()
  const geo = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.62, 1)), [])
  useFrame((_, dt) => {
    if (!mesh.current) return
    mesh.current.rotation.x += dt * 0.2
    mesh.current.rotation.y += dt * 0.28
    mesh.current.position.x = viewport.width < 6 ? 0 : viewport.width * 0.18
    mesh.current.position.y = viewport.width < 6 ? 1.1 - scroll.current * 1.5 : -scroll.current * 1.2
    const m = mesh.current.material as THREE.LineBasicMaterial
    m.opacity = 0.5 * (1 - Math.min(1, scroll.current * 2))
  })
  return (
    <lineSegments ref={mesh} geometry={geo}>
      <lineBasicMaterial color="#ff8a3d" transparent opacity={0.5} />
    </lineSegments>
  )
}

export default function HeroScene({ active, scroll, lite }: { active: boolean; scroll: React.MutableRefObject<number>; lite: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, lite ? 1.5 : 2]}
      camera={{ position: [0, 0, 6.2], fov: 45 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <Field count={lite ? 7000 : 16000} scroll={scroll} lite={lite} />
      <Core scroll={scroll} />
      {!lite && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.9} luminanceThreshold={0.15} luminanceSmoothing={0.4} mipmapBlur />
          <Vignette eskil={false} offset={0.2} darkness={0.75} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
