import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Icosahedron, Points, PointMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'
import { useLang } from '../i18n/LanguageContext'

// Breathing neural point-cloud: a sphere of nodes that gently pulses
// with noise, like a thinking AI core.
function NeuralCloud() {
  const ref = useRef()
  const COUNT = 2800

  const { positions, base } = useMemo(() => {
    const base = new Float32Array(COUNT * 3)
    const positions = new Float32Array(COUNT * 3)
    const golden = Math.PI * (1 + Math.sqrt(5))
    for (let i = 0; i < COUNT; i++) {
      const t = i / COUNT
      const inclination = Math.acos(1 - 2 * t)
      const azimuth = golden * i
      const r = 1.65
      const x = r * Math.sin(inclination) * Math.cos(azimuth)
      const y = r * Math.sin(inclination) * Math.sin(azimuth)
      const z = r * Math.cos(inclination)
      base[i * 3] = x
      base[i * 3 + 1] = y
      base[i * 3 + 2] = z
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }
    return { positions, base }
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    const arr = ref.current.geometry.attributes.position.array
    for (let i = 0; i < COUNT; i++) {
      const bx = base[i * 3]
      const by = base[i * 3 + 1]
      const bz = base[i * 3 + 2]
      // cheap layered noise → organic "breathing"
      const n =
        Math.sin(bx * 2.0 + t * 1.1) * 0.05 +
        Math.sin(by * 3.0 + t * 1.4) * 0.045 +
        Math.sin(bz * 2.4 + t * 0.9) * 0.05
      const s = 1 + n
      arr[i * 3] = bx * s
      arr[i * 3 + 1] = by * s
      arr[i * 3 + 2] = bz * s
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.rotation.y = t * 0.07
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#9fe8ff"
        size={0.032}
        sizeAttenuation
        depthWrite={false}
        opacity={0.95}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

// Geodesic "network" lattices that read as connected neurons.
function NetworkLattice() {
  const a = useRef()
  const b = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (a.current) {
      a.current.rotation.y = t * 0.1
      a.current.rotation.x = t * 0.04
    }
    if (b.current) {
      b.current.rotation.y = -t * 0.06
      b.current.rotation.z = t * 0.03
    }
  })
  return (
    <group>
      <Icosahedron ref={a} args={[2.0, 1]}>
        <meshBasicMaterial color="#5BCDDA" wireframe transparent opacity={0.18} />
      </Icosahedron>
      <Icosahedron ref={b} args={[2.35, 2]}>
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.1} />
      </Icosahedron>
    </group>
  )
}

// Drifting data motes around the core.
function DataMotes() {
  const ref = useRef()
  const positions = useMemo(() => {
    const count = 700
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.rotation.y = t * 0.03
    ref.current.rotation.x = t * 0.015
  })
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#c9b6ff" size={0.02} sizeAttenuation depthWrite={false} opacity={0.5} />
    </Points>
  )
}

function CoreRig() {
  const group = useRef()
  useFrame((state) => {
    if (!group.current) return
    const p = state.pointer
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, p.x * 0.4, 0.04)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -p.y * 0.3, 0.04)
  })
  return (
    <Float speed={1.3} rotationIntensity={0.4} floatIntensity={1.2}>
      <group ref={group}>
        <NeuralCloud />
        <NetworkLattice />
      </group>
    </Float>
  )
}

export default function Scene3D() {
  const { dir } = useLang()
  const offsetX = dir === 'rtl' ? -1.7 : 1.7

  return (
    <div className="scene3d" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 6.5], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <pointLight position={[-5, -2, 3]} intensity={2.4} color="#5BCDDA" />
          <pointLight position={[4, 3, -3]} intensity={2.0} color="#8b5cf6" />
          <pointLight position={[0, 4, 4]} intensity={1.2} color="#9fe8ff" />
          <group position={[offsetX, 0.3, 0]} scale={1.05}>
            <CoreRig />
            <DataMotes />
          </group>
        </Suspense>
      </Canvas>
      <div className="scene3d__halo" style={{ [dir === 'rtl' ? 'left' : 'right']: '14%' }} />
      <style>{`
        .scene3d { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
        .scene3d canvas { width: 100% !important; height: 100% !important; }
        .scene3d__halo {
          position: absolute;
          top: 42%;
          width: 480px;
          height: 480px;
          transform: translateY(-50%);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(91,205,218,0.28) 0%, rgba(139,92,246,0.16) 42%, transparent 70%);
          filter: blur(34px);
          z-index: 0;
        }
        @media (max-width: 768px) {
          .scene3d__halo { width: 300px; height: 300px; top: 36%; }
        }
      `}</style>
    </div>
  )
}
