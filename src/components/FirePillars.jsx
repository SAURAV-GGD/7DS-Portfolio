import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import VolumetricFire from './VolumetricFire'

// Colonnade freestanding Roman fire braziers flanking the sanctuary path
const BRAZIER_POSITIONS = [
  { x: -6.5, z: -15, seed: 101 },
  { x: 6.5, z: -35, seed: 102 },
  { x: -6.5, z: -58, seed: 103 },
  { x: 6.5, z: -80, seed: 104 },
  { x: -6.5, z: -102, seed: 105 },
  { x: 6.5, z: -122, seed: 106 },
  { x: -6.5, z: -144, seed: 107 },
  { x: 6.5, z: -166, seed: 108 },
]

const SPARK_COUNT = 16

function RomanBrazier({ position, seed }) {
  const groupRef = useRef()
  const lightRef = useRef()
  const sparksRef = useRef()

  const sparkData = useMemo(() => {
    const positions = new Float32Array(SPARK_COUNT * 3)
    const speeds = new Float32Array(SPARK_COUNT)
    for (let i = 0; i < SPARK_COUNT; i++) {
      const rx = (Math.sin(i * 12.9898 + seed) * 43758.5453) % 1
      const ry = (Math.sin(i * 78.233 + seed) * 43758.5453) % 1
      const rz = (Math.sin(i * 45.164 + seed) * 43758.5453) % 1
      positions[i * 3 + 0] = (Math.abs(rx) - 0.5) * 0.7
      positions[i * 3 + 1] = Math.abs(ry) * 2.0
      positions[i * 3 + 2] = (Math.abs(rz) - 0.5) * 0.7
      speeds[i] = 1.0 + Math.abs((Math.sin(i * 91.34 + seed) * 43758.5453) % 1) * 1.5
    }
    return { positions, speeds }
  }, [seed])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const flickerTime = t * 7.5 + seed * 9.3

    // Dynamic light flicker
    if (lightRef.current) {
      const flicker =
        Math.sin(flickerTime) * 0.8 +
        Math.sin(t * 17.2 + seed) * 0.4 +
        Math.sin(t * 29.1) * 0.2
      lightRef.current.intensity = Math.max(1.5, 4.0 + flicker)
    }

    // Spark upward drift
    if (sparksRef.current) {
      const pos = sparksRef.current.geometry.attributes.position.array
      for (let i = 0; i < SPARK_COUNT; i++) {
        const idx = i * 3
        pos[idx + 1] += delta * sparkData.speeds[i]
        pos[idx + 0] += Math.sin(t * 4 + i) * delta * 0.1
        if (pos[idx + 1] > 3.2) {
          pos[idx + 1] = 0.3
          pos[idx + 0] = (Math.random() - 0.5) * 0.6
          pos[idx + 2] = (Math.random() - 0.5) * 0.6
        }
      }
      sparksRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef} position={[position.x, -1.6, position.z]}>
      {/* ── 1. Heavy Roman Travertine Pedestal ── */}
      {/* Base Plinth */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[1.5, 0.5, 1.5]} />
        <meshStandardMaterial color="#261b13" roughness={0.92} metalness={0.06} />
      </mesh>
      {/* Fluted Column Shaft */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.42, 0.5, 1.4, 20]} />
        <meshStandardMaterial color="#2f2117" roughness={0.9} metalness={0.08} />
      </mesh>
      {/* Capital Rim */}
      <mesh position={[0, 2.0, 0]}>
        <boxGeometry args={[1.3, 0.25, 1.3]} />
        <meshStandardMaterial color="#36261a" roughness={0.88} metalness={0.08} />
      </mesh>

      {/* ── 2. Forged Roman Bronze Brazier Bowl ── */}
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.9, 0.5, 0.6, 20]} />
        <meshStandardMaterial color="#221812" roughness={0.7} metalness={0.7} />
      </mesh>
      {/* Brazier Lip Ring */}
      <mesh position={[0, 2.7, 0]}>
        <torusGeometry args={[0.9, 0.08, 10, 24]} />
        <meshStandardMaterial color="#302016" roughness={0.65} metalness={0.75} />
      </mesh>

      {/* ── 3. Glowing Incandescent Charcoal Bed ── */}
      <group position={[0, 2.65, 0]}>
        {/* Core Emissive Base */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.82, 0.65, 0.16, 18]} />
          <meshStandardMaterial
            color="#140703"
            emissive="#ff3800"
            emissiveIntensity={3.4}
            roughness={0.85}
          />
        </mesh>
        {/* Irregular Glowing Coal Briquettes */}
        {[
          { pos: [-0.35, 0.08, -0.2], s: 0.15, rot: [0.3, 0.6, 0.1] },
          { pos: [0.3, 0.09, 0.22], s: 0.17, rot: [0.8, 1.1, 0.4] },
          { pos: [-0.15, 0.11, 0.35], s: 0.14, rot: [1.2, 0.4, 0.7] },
          { pos: [0.22, 0.1, -0.32], s: 0.16, rot: [0.5, 1.7, 0.2] },
          { pos: [0.0, 0.12, 0.0], s: 0.18, rot: [0.2, 0.9, 0.5] },
        ].map((c, i) => (
          <mesh key={i} position={c.pos} rotation={c.rot} scale={c.s}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#0d0502"
              emissive={i % 2 === 0 ? '#ff3e00' : '#ff7700'}
              emissiveIntensity={2.9}
              roughness={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* ── 4. Procedural Volumetric Fire (mattatz/THREE.Fire) ── */}
      <group position={[0, 3.8, 0]}>
        <VolumetricFire
          size={[1.3, 2.4, 1.3]}
          color="#ff7524"
          speed={1.4}
          seed={seed}
        />

        {/* Ember Sparks floating from coals */}
        <points ref={sparksRef} position={[0, -0.9, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={SPARK_COUNT}
              array={sparkData.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.045}
            color="#ffc266"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>

      {/* ── 5. Dynamic Warm Illumination ── */}
      <pointLight
        ref={lightRef}
        position={[0, 3.2, 0]}
        color="#ff7f33"
        intensity={4.2}
        distance={14}
        decay={2}
      />
    </group>
  )
}

export default function FirePillars() {
  return (
    <group>
      {BRAZIER_POSITIONS.map((p, i) => (
        <RomanBrazier key={i} position={p} seed={p.seed} />
      ))}
    </group>
  )
}
